import * as path from "path";
import { app, BrowserWindow, dialog, session, ipcMain, screen, shell, webContents, clipboard, crashReporter } from "electron";
import { getAppIconPath } from "./utils";
import { MainWindow } from "./mainWindow";
import * as Sentry from "@sentry/electron";

if (process.env.NODE_ENV === "production") {
	Sentry.init({ dsn: "https://392b9a7bcc324b2dbdff0146ccfee044@o1075083.ingest.sentry.io/6075223" });
	require("update-electron-app")({
		repo: "crusherdev/crusher-downloads",
		updateInterval: "5 minutes",
		logger: require("electron-log"),
	});
}

app.setName("Crusher Recorder");
app.setAboutPanelOptions({
	applicationName: "Crusher Recorder",
	applicationVersion: app.getVersion(),
	copyright: "Copyright © 2021",
	credits: "Made with ❤️ by Crusher team",
});

// @Note: Remove this from here
const devices = [
	{
		id: "Pixel33XL",
		name: "Mobile",
		width: 393,
		height: 786,
		visible: true,
		mobile: true,
		userAgent: "Mozilla/5.0 (Linux; Android 7.1.1; Pixel Build/NOF27B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36",
	},
	{
		id: "GoogleChromeMediumScreen",
		name: "Desktop M",
		width: 1280,
		height: 800,
		visible: true,
		userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
	},
	{
		id: "GoogleChromeLargeScreenL",
		name: "Desktop L",
		width: 1440,
		height: 800,
		visible: true,
		userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
	},
];

class App {
	appWindow: BrowserWindow | null;
	mainWindow: MainWindow | null;
	hasInstanceLock: boolean;
	state: { userAgent: string };

	async initialize() {
		console.log("Initializng now...");
		if (!app.requestSingleInstanceLock()) {
			// Allow only one instance of crusher app
			console.warn("Two instances of crusher app running");
			app.quit();
			return;
		}

		app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
		app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");
		app.commandLine.appendSwitch("--disable-site-isolation-trials");
		app.commandLine.appendSwitch("--disable-web-security");
		app.commandLine.appendSwitch("--allow-top-navigation");
		// For replaying actions
		app.commandLine.appendSwitch("--remote-debugging-port", "9112");
		app.setAsDefaultProtocolClient("crusher");

		this.state = {
			userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
		};

		app.userAgentFallback = this.state.userAgent;
		this.setupListeners();
	}

	async createAppWindow() {
		await this.cleanupStorage();

		const { width, height } = screen.getPrimaryDisplay().workAreaSize;

		this.appWindow = new BrowserWindow({
			title: "Crusher Test Recorder",
			show: true,
			icon: getAppIconPath(),
			minWidth: width > 1600 ? 1600 : width,
			minHeight: height > 873 ? 873 : height,
			enableLargerThanScreen: true,
			webPreferences: {
				webviewTag: true,
				webSecurity: false,
				preload: path.join(__dirname, "preload.js"),
				nativeWindowOpen: true,
				devTools: true,
			},
		});

		this.appWindow.webContents.on("devtools-reload-page", function () {
			console.log("did-finish-load", true);
		});

		this.mainWindow = new MainWindow(this, this.appWindow, this.state);
		await this.mainWindow.initialize();

		this.appWindow.on("close", () => {
			if (process.platform === "darwin") app.quit();
		});

		return true;
	}

	setupListeners() {
		app.whenReady().then(this.createAppWindow.bind(this));
		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) this.createAppWindow();
		});

		app.on("window-all-closed", async () => {
			await this.cleanupStorageBeforeExit();
			if (process.platform !== "darwin") app.quit();
		});

		app.on("second-instance", this.handleSecondInstance.bind(this));
		app.on("open-url", this.handleDeepLink.bind(this));

		this.createIPCListeners();
	}

	async handleDeepLink(event, data) {
		if (process.platform === "darwin") {
			if (data.startsWith("crusher://")) {
				const dialogResponse = dialog.showMessageBoxSync({
					message: "Current saved state would be lost. Do you want to continue?",
					type: "question",
					buttons: ["Yes", "Cancel"],
					defaultId: 1,
				});

				if (dialogResponse === 0 && app.hasSingleInstanceLock()) {
					await this._reloadApp(this.appWindow, true, [data]);
				}
			}
		}
		console.log("Link is this", data);
	}

	async handleSecondInstance(event, argv, workingDirectory) {
		const dialogResponse = dialog.showMessageBoxSync({
			message: "Current saved state would be lost. Do you want to continue?",
			type: "question",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
		});

		if (dialogResponse === 0 && app.hasSingleInstanceLock()) {
			await this._reloadApp(this.appWindow, true, argv.slice(1));
		}
	}

	async cleanupStorage() {
		try {
			session.fromPartition("crusher").clearStorageData({
				storages: ["cookies", "localstorage", "indexdb"],
			});
		} catch (err) {}
	}

	cleanupStorageBeforeExit(): Promise<void> {
		this.appWindow = null;
		return this.cleanupStorage();
	}

	createIPCListeners() {
		ipcMain.on("get-app-path", (event) => {
			event.returnValue = app.getAppPath();
		});

		ipcMain.handle("set-user-agent", this.setUserAgent.bind(this));
		ipcMain.on("reload-extension", this.reloadExtension.bind(this));
		ipcMain.on("restart-app", this.restartApp.bind(this));
	}

	async setUserAgent(event, userAgent): Promise<boolean> {
		const dialogResponse = dialog.showMessageBoxSync({
			message: "Current saved state would be lost. Do you want to continue?",
			type: "question",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
		});

		if (dialogResponse === 0) {
			await this.cleanupStorage();
			this.state.userAgent = userAgent;
			app.userAgentFallback = userAgent;
			return true;
		}

		return false;
	}

	async _setDevice(deviceId: string): Promise<boolean> {
		await this.cleanupStorage();

		const extensionUrl = new URL(this.mainWindow.webContents.getURL());
		if (extensionUrl.searchParams.get("device") !== deviceId) {
			const device = devices.find((device) => device.id === deviceId);
			this.state.userAgent = device.userAgent;
			app.userAgentFallback = device.userAgent;

			extensionUrl.searchParams.set("device", device.id);
			this.mainWindow.webContents.loadURL(extensionUrl.toString());
			return true;
		}

		return false;
	}

	async _reloadApp(mainWindow, completeReset = false, argv = []) {
		const currentArgs = process.argv.slice(1).filter((a) => !a.startsWith("--open-extension-url="));
		await this.cleanupStorageBeforeExit();

		const finalArgs = completeReset ? currentArgs : currentArgs.concat([`--open-extension-url=${mainWindow.webContents.getURL()}`]);

		app.relaunch({ args: finalArgs.concat(argv) });
		app.exit();
	}

	async restartApp() {
		await this._reloadApp(this.appWindow, true);
	}

	async reloadExtension() {
		await this._reloadApp(this.appWindow);
	}
}

export { App };

const appInstance = new App();
appInstance.initialize();
