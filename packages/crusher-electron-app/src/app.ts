import * as path from "path";
import { app, BrowserWindow, dialog, session, ipcMain, screen, shell, webContents, clipboard } from "electron";
import userAgents from "../../crusher-shared/constants/userAgents";
import { SDK } from "./sdk/sdk";
import { getAppIconPath } from "./utils";
import { MainWindow } from "./mainWindow";

class App {
	appWindow: BrowserWindow | null;

	async createAppWindow() {
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

		const mainWindow = new MainWindow(this.appWindow);
		await mainWindow.initialize();

		return true;
	}

	async initialize() {
		app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
		app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");
		app.commandLine.appendSwitch("--disable-site-isolation-trials");
		app.commandLine.appendSwitch("--disable-web-security");
		app.commandLine.appendSwitch("--allow-top-navigation");
		// For replaying actions
		app.commandLine.appendSwitch("--remote-debugging-port", "9112");
		app.setAsDefaultProtocolClient("crusher");

		app.userAgentFallback = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36";
		this.setupListeners();
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

		this.createIPCListeners();
	}

	cleanupStorageBeforeExit(): Promise<void> {
		this.appWindow = null;
		return session.defaultSession.clearStorageData({
			storages: ["cookies", "localstorage"],
		});
	}

	createIPCListeners() {
		ipcMain.on("get-app-path", (event) => {
			event.returnValue = app.getAppPath();
		});

		ipcMain.on("post-message-to-host", (event, data) => {
			this.appWindow.webContents.send("post-message-to-host", data);
		});

		ipcMain.on("set-user-agent", this.setUserAgent.bind(this));
		ipcMain.on("reload-extension", this.reloadExtension.bind(this));
		ipcMain.on("restart-app", this.restartApp.bind(this));
	}

	setUserAgent(event, userAgent) {
		// USER_AGENT = userAgent;
		app.userAgentFallback = userAgent.value;
	}

	async _reloadApp(mainWindow, completeReset = false) {
		const currentArgs = process.argv.slice(1).filter((a) => !a.startsWith("--open-extension-url="));
		await this.cleanupStorageBeforeExit();

		app.relaunch({ args: completeReset ? currentArgs : currentArgs.concat([`--open-extension-url=${mainWindow.webContents.getURL()}`]) });
		app.exit();
	}

	async restartApp() {
		await this._reloadApp(this.appWindow, true);
	}

	async reloadExtension() {
		await this._reloadApp(this.appWindow);
	}
}

const appInstance = new App();
appInstance.initialize();
