console.log("Ready now...");

import * as Sentry from "@sentry/electron"
import { isProduction } from "./../utils"
import { app, session } from "electron";
import { APP_NAME } from "../../config/about";
import { enableSourceMaps } from "../lib/source-map-support";
import { AppWindow } from "./app-window";
import { now } from "./now";
import { installSameOriginFilter } from "./same-origin-filter";
import configureStore from "../store/configureStore";

if(isProduction() && process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    require('update-electron-app')({
		repo: 'crusherdev/crusher-downloads',
		updateInterval: '5 minutes',
		logger: require('electron-log')
	});
}

app.setAppLogsPath();
enableSourceMaps();

let mainWindow: AppWindow | null = null

const launchTime = now();
let readyTime: number | null = null

type OnDidLoadFn = (window: AppWindow) => void
let onDidLoadFns: Array<OnDidLoadFn> | null = []

function setupElectronApp() {
	app.setName(APP_NAME);
	app.setAppLogsPath()
	app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy')

	app.setAboutPanelOptions({
		applicationName: APP_NAME,
		applicationVersion: app.getVersion(),
		copyright: "Copyright © 2021",
		credits: "Made with ❤️ by Crusher team",
	});
	app.setAsDefaultProtocolClient("crusher");
}
setupElectronApp();

app.on("ready", function() {
	if(isDuplicateInstance) return;
	readyTime = now() - launchTime

	createWindow();
	installSameOriginFilter(session.defaultSession.webRequest)

});

let isDuplicateInstance = false;

const gotSingleInstanceLock = app.requestSingleInstanceLock()
isDuplicateInstance = !gotSingleInstanceLock;

app.on("second-instance", (event, args, workingDirectory) => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
		  mainWindow.restore()
		}
  
		if (!mainWindow.isVisible()) {
		  mainWindow.show()
		}
  
		mainWindow.focus()
	  }
});

if (isDuplicateInstance) {
    app.quit()
}

let store;
function createWindow() {
	console.log("Creating window now...");
	const store = configureStore(global.state, 'main');

	store.subscribe(async () => {
		// persist store changes
		// TODO: should this be blocking / wait? _.throttle?
		console.log("Changes occurred in store");
	});

	const window = new AppWindow(store)

	if (!isProduction()) {
	  const {
		default: installExtension,
		REACT_DEVELOPER_TOOLS,
		REDUX_DEVTOOLS
	  } = require('electron-devtools-installer')
  
	  require('electron-debug')({ showDevTools: true })
  
	  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  
	  for (const extension of extensions) {
		try {
		  installExtension(extension, {loadExtensionOptions: { allowFileAccess: true }})
		} catch (e) {  }
	  }
	}
  
	window.onClose(() => {
	  mainWindow = null;
	})
  
	window.onDidLoad(() => {
	  window.show()
	  window.sendLaunchTimingStats({
		mainReadyTime: readyTime!,
		loadTime: window.loadTime!,
		rendererReadyTime: window.rendererReadyTime!,
	  })
  
	  const fns = onDidLoadFns!
	  onDidLoadFns = null
	  for (const fn of fns) {
		fn(window)
	  }
	})
  
	window.load()
  
	mainWindow = window
}