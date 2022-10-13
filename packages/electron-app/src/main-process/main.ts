import { setupLogger } from "@crusher-shared/modules/logger";
setupLogger("recorder");

require("v8-compile-cache");
import { isProduction, parseDeepLinkUrlAction } from "./../utils";
import { app, session } from "electron";
import { APP_NAME } from "../../config/about";
import { AppWindow } from "./app-window";
import { now } from "./now";
import { installSameOriginFilter } from "./same-origin-filter";
import configureStore from "../store/configureStore";
import { getGlobalAppConfig } from "../lib/global-config";
import { SettingsManager } from "../lib/settingsManager";
import path from "path";

//     Sentry.init({ dsn: "https://392b9a7bcc324b2dbdff0146ccfee044@o1075083.ingest.sentry.io/6075223" });
//     require('update-electron-app')({
// 		repo: 'crusherdev/crusher-downloads',
// 		updateInterval: '5 minutes',
// 		logger: require('electron-log')
// 	});

// app.setAppLogsPath();

let mainWindow: AppWindow | null = null;

const launchTime = now();
let readyTime: number | null = null;

type OnDidLoadFn = (window: AppWindow) => void;
let onDidLoadFns: OnDidLoadFn[] | null = [];

function setupElectronApp() {
	app.setName(APP_NAME);
	// app.setAppLogsPath()

	app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
	app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");
	// app.commandLine.appendSwitch("--disable-site-isolation-trials");
	// app.commandLine.appendSwitch("--disable-web-security");
	app.commandLine.appendSwitch("--allow-top-navigation");
	// For replaying actions
	app.commandLine.appendSwitch("--remote-debugging-port", "0");

	app.setAboutPanelOptions({
		applicationName: APP_NAME,
		applicationVersion: app.getVersion(),
		copyright: "Copyright © 2021",
		credits: "Made with ❤️ by crusher team",
	});
	if(isProduction()) {
		app.setAsDefaultProtocolClient("crusher");
	} else {
		console.log("Registering protocol client", process.execPath, process.argv);
		app.setAsDefaultProtocolClient("crusher", process.execPath, [path.resolve(process.argv[1])]);
	}
}
setupElectronApp();

app.on("ready", async function () {
	if (isDuplicateInstance) return;
	readyTime = now() - launchTime;

	createWindow();
	installSameOriginFilter(session.defaultSession.webRequest);
});

let isDuplicateInstance = false;

const gotSingleInstanceLock = app.requestSingleInstanceLock();
isDuplicateInstance = !gotSingleInstanceLock;

if (process.platform === "linux" && !isDuplicateInstance) {
	onDidLoad(() => {
		handlePossibleProtocolLauncherArgs(process.argv);
	});
}

app.on("second-instance", (event, args) => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		if (!mainWindow.isVisible()) {
			mainWindow.show();
		}

		mainWindow.focus();
	}
	handlePossibleProtocolLauncherArgs(args);
});

function handlePossibleProtocolLauncherArgs(args: string[]) {
	if (args.length > 1) {
		const lastArg = args[args.length - 1];
		if (lastArg.startsWith("crusher://")) {
			handleAppURL(args[1]);
		}
	}
}

if (isDuplicateInstance) {
	app.quit();
}

function handleAppURL(url: string) {
	const action = parseDeepLinkUrlAction(url);
	console.log("Got this deep link", action);
	onDidLoad((window) => {
		// This manual focus call _shouldn't_ be necessary, but is for Chrome on
		// macOS. See https://github.com/desktop/desktop/issues/973.
		window.focus();
		if (action) window.sendMessage("url-action", { action });
	});
}

app.on("open-url", (event, url) => {
	event.preventDefault();
	handleAppURL(url);
});

function createWindow() {
	const globalAppConfig = getGlobalAppConfig();
	const _store = configureStore(undefined, "main", true);
	const settings = SettingsManager.getSavedSettings();

	// initialReduxState.app.shouldShowOnboardingOverlay = localStorage.getItem("app.showShouldOnboardingOverlay") === "false" ? false : true;

	if (!settings.backendEndPoint) {
		settings.backendEndPoint = process.env.BACKEND_URL;
	}
	if (!settings.frontendEndPoint) {
		settings.frontendEndPoint = process.env.FRONTEND_URL;
	}

	const initialState = {
		...(_store.getState() as any),
		app: {
			...(_store.getState() as any).app,
			settings: {
				...(_store.getState() as any).app.settings,
				...settings,
			},
			accountInfo: globalAppConfig?.userInfo ? globalAppConfig.userInfo : null,
		},
	};
	const store = configureStore(initialState, "main");

	const window = new AppWindow(store);

	if (!isProduction()) {
		const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require("electron-devtools-installer");

		require("electron-debug")({ showDevTools: true });

		const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];

		for (const extension of extensions) {
			try {
				installExtension(extension, { loadExtensionOptions: { allowFileAccess: true } });
			} catch { }
		}
	}

	window.onClose(() => {
		mainWindow = null;
	});

	window.onDidLoad(() => {
		window.sendLaunchTimingStats({
			mainReadyTime: readyTime!,
			loadTime: window.loadTime!,
			rendererReadyTime: window.rendererReadyTime!,
		});

		const fns = onDidLoadFns!;
		onDidLoadFns = null;

		for (const fn of fns) {
			fn(window);
		}
	});

	window.load();

	mainWindow = window;
}

function onDidLoad(fn: OnDidLoadFn) {
	if (onDidLoadFns) {
		onDidLoadFns.push(fn);
	} else {
		if (mainWindow) {
			fn(mainWindow);
		}
	}
}
