import * as path from "path";
import { app, BrowserWindow, dialog, session, ipcMain, screen, shell, webContents, clipboard } from "electron";
import userAgents from "../../crusher-shared/constants/userAgents";
import { BrowserInput } from "./input";
const gotTheLock = app.requestSingleInstanceLock();
const highlighterStyle = require("./highlighterStyle.json");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

if (!gotTheLock) {
	console.warn("Two app instances running");
	app.quit();
} else {
	app.on("second-instance", (event, argv, workingDirectory) => {
		let url;
		const dialogResponse = dialog.showMessageBoxSync({
			message: "Current saved state would be lost. Do you want to continue?",
			type: "question",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
		});
		if (dialogResponse === 0) {
			app.relaunch();
			app.exit();
		}
		// Protocol handler for win and linux
		// argv: An array of the second instance’s (command line / deep linked) arguments
		if (process.platform == "win32" || process.platform === "linux") {
			// Keep only command line / deep linked arguments
			url = argv.slice(1);
			console.info("Args = " + url);
		}
	});
}
// To fix twitter webview issue
app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");
app.userAgentFallback =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36";

let APP_DOMAIN = process.env.APP_DOMAIN;

const extensionURLRegExp = new RegExp(/(^chrome-extension:\/\/)([^\/.]*)(\/test_recorder\.html?.*)/);

let USER_AGENT = userAgents.find((agent) => agent.name === "Google Chrome");

const loadExtension = (mainWindow) => {
	return new Promise((resolve) => {
		session.defaultSession
			.loadExtension(path.resolve(__dirname, "./extension"), { allowFileAccess: true })
			.then(({ id: extensionId }) => {
				const urlToOpen = app.commandLine.getSwitchValue("open-extension-url") || "chrome-extension://<EXTENSION_ID_HERE>/test_recorder.html";
				if (!urlToOpen.match(extensionURLRegExp)) {
					return mainWindow.loadURL(urlToOpen);
				}

				const finalExtensionURL = urlToOpen.replace(extensionURLRegExp, `$1${extensionId}$3`);
				return mainWindow.loadURL(finalExtensionURL);
			})
			.then(() => {
				resolve(true);
			});
	});
};

let mainWindow;

function getIconPath() {
	switch (process.platform) {
		case "win32":
			return path.join(__dirname, "icons/app.ico");
		default:
			return path.join(__dirname, "icons/app.png");
	}
}

async function reloadApp(mainWindow, completeReset = false) {
	const currentArgs = process.argv.slice(1).filter((a) => !a.startsWith("--open-extension-url="));
	await cleanupBeforeExit();
	app.relaunch({ args: completeReset ? currentArgs : currentArgs.concat([`--open-extension-url=${mainWindow.webContents.getURL()}`]) });
	app.exit();
}

function getWebViewContent() {
	const webViewContents = webContents.getAllWebContents();
	return webViewContents.find((a) => a.getType() === "webview");
}

async function createWindow() {
	app.commandLine.appendSwitch("--disable-site-isolation-trials");
	app.commandLine.appendSwitch("--disable-web-security");
	app.commandLine.appendSwitch("--allow-top-navigation");
	app.userAgentFallback = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36";

	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	mainWindow = new BrowserWindow({
		title: "Crusher Test Recorder",
		show: true,
		icon: getIconPath(),
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

	await mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] }, (responseDetails, updateCallback) => {
		Object.keys(responseDetails.responseHeaders).map((headers) => {
			if (["x-frame-options", "content-security-policy", "frame-options"].includes(headers.toString().toLowerCase())) {
				delete responseDetails.responseHeaders[headers];
			}
		});
		updateCallback({ cancel: false, responseHeaders: responseDetails.responseHeaders });
	});

	await loadExtension(mainWindow);

	await mainWindow.maximize();

	await session.defaultSession.cookies.set({
		name: "h-sid",
		value: "AQAAAXnN6yuZAAAAOKcCQqwRAAJ2fHLwkMzVKsxdxrCwXfy3",
		domain: ".test-headout.com",
		url: "https://www.test-headout.com/burj-khalifa-tickets-c-158/",
		path: "/",
		expirationDate: 1638209412,
	});

	ipcMain.on("restart-app", async (e) => {
		await reloadApp(mainWindow, true);
	});

	ipcMain.on("set-custom-backend-domain", async (e, domain) => {
		APP_DOMAIN = domain;
	});

	ipcMain.on("reload-extension", async () => {
		reloadApp(mainWindow);
	});

	ipcMain.on("focus-webview", () => {
		// @Note: This is a workaround to fix focus lost issue after overlay
		// on webview
	});

	ipcMain.on("get-app-path", (event) => {
		event.returnValue = app.getAppPath();
	});

	ipcMain.on("post-message-to-host", (event, data) => {
		mainWindow.webContents.send("post-message-to-host", data);
	});

	ipcMain.on("post-message-to-webview", (event, data) => {
		const webViewContent = getWebViewContent();
		webViewContent.send("post-message-to-webview", data);
	});

	ipcMain.handle("get-node-screenshot", async (event, data: { x: number; y: number; width: number; height: number }) => {
		const webViewContent = getWebViewContent();
		// console.log("Web view content is", webViewContent);
		if (!webViewContent) return null;

		const pageLayoutMetric = await webViewContent.debugger.sendCommand("Page.getLayoutMetrics");

		const page_zoom = pageLayoutMetric.visualViewport.zoom || 1;
		data.x *= page_zoom;
		data.y *= page_zoom;
		data.width *= page_zoom;
		data.height *= page_zoom;

		const screenshotCaptureInfo = await webViewContent.capturePage(data);
		// @Note: Doesn't work correctly, returns full page screenshot on elements.
		return screenshotCaptureInfo.toDataURL();
	});

	ipcMain.on("init-web-view", async (e, webContentsId) => {
		const webViewContent = getWebViewContent();
		// console.log("Web view content is", webViewContent);
		if (!webViewContent || webViewContent.debugger.isAttached()) return;
		console.log("Attaching now...");
		await webViewContent.debugger.attach("1.3");
		await webViewContent.debugger.sendCommand("Debugger.enable");
		await webViewContent.debugger.sendCommand("DOM.enable");
		await webViewContent.debugger.sendCommand("Runtime.enable");
		await webViewContent.debugger.sendCommand("Overlay.enable");
		await webViewContent.debugger.sendCommand("Debugger.setAsyncCallStackDepth", { maxDepth: 9999 });
		// @TODO: This should not be necessary. Look into this
		// It's here to enable DOMDebugger, which is not getting enabled by default
		await webViewContent.debugger.sendCommand("DOMDebugger.setXHRBreakpoint", { url: "http://nonsense.com" });
		const browserInput = new BrowserInput(webViewContent);

		webViewContent.debugger.on("message", async (event, method, params) => {
			if (method === "Runtime.consoleAPICalled") {
				const { args } = params;
				if (args.length === 2 && args[0].type === "string" && ["CRUSHER_HOVER_ELEMENT", "CRUSHER_CLICK_ELEMENT"].includes(args[0].value)) {
					switch (args[0].value) {
						case "CRUSHER_HOVER_ELEMENT":
							await browserInput.hover(args[1].objectId);
							break;
						case "CRUSHER_CLICK_ELEMENT":
							await browserInput.click(args[1].objectId);
							break;
						default:
							console.error("This simulated action not supported");
					}
				}
			}

			if (method === "Overlay.inspectNodeRequested") {
				await webViewContent.debugger.sendCommand("Overlay.setInspectMode", {
					mode: "none",
					highlightConfig: highlighterStyle,
				});
				const nodeObject = await webViewContent.debugger.sendCommand("DOM.resolveNode", { backendNodeId: params.backendNodeId });

				await webViewContent.debugger.sendCommand("Runtime.callFunctionOn", {
					functionDeclaration: "function(){const event = new CustomEvent('elementSelected', {detail:{element: this}}); window.dispatchEvent(event);}",
					objectId: nodeObject.object.objectId,
				});
			}
		});
	});

	ipcMain.on("set-user-agent", async (e, userAgent) => {
		USER_AGENT = userAgent;
		app.userAgentFallback = USER_AGENT.value;
	});

	ipcMain.on("turn-on-inspect-mode", async (e, msg) => {
		const webViewContent = getWebViewContent();

		if (webViewContent) {
			await webViewContent.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "searchForNode",
				highlightConfig: highlighterStyle,
			});
		}
	});
	ipcMain.on("turn-off-inspect-mode", async (e, msg) => {
		const webViewContent = getWebViewContent();

		if (webViewContent) {
			await webViewContent.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: highlighterStyle,
			});
		}
	});

	mainWindow.webContents.on("did-attach-webview", function (event, webContents) {
		webContents.setUserAgent(USER_AGENT.value);
	});

	mainWindow.webContents.on("new-window", function (event, popupUrl) {
		if (mainWindow.webContents.getURL().startsWith("chrome-extension")) {
			if (popupUrl.endsWith("#crusherExternalLink")) {
				event.preventDefault();
				shell.openExternal(popupUrl.substring(0, popupUrl.length - "#crusherExternalLink".length));
			} else if (!popupUrl.endsWith("#crusherBackendServer")) {
				event.preventDefault();
				mainWindow.webContents.executeJavaScript(
					`document.querySelector('#device_browser').src = "${popupUrl.substring(0, popupUrl.length - "#crusherBackendServer".length)}"`,
				);
			}
		} else {
			event.preventDefault();
			mainWindow.webContents.executeJavaScript(`window.location.href = "${popupUrl}"`);
		}
	});
}

app.whenReady().then(() => {
	createWindow();
	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

if (!app.isDefaultProtocolClient("crusher")) {
	// Define custom protocol handler. Deep linking works on packaged versions of the application!
	app.setAsDefaultProtocolClient("crusher");
}

async function cleanupBeforeExit() {
	console.log("Getting cleared");
	// const cookies = await session.defaultSession.cookies.get({ domain: APP_DOMAIN });
	await session.defaultSession.clearStorageData({
		storages: ["cookies", "localstorage"],
	});

	// if (cookies && cookies.length) {
	// 	for (const cookie of cookies) {
	// 		const nextYearDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

	// 		await session.defaultSession.cookies.set({
	// 			url: `http://${cookie.domain}`,
	// 			name: cookie.name,
	// 			value: cookie.value,
	// 			domain: cookie.domain,
	// 			path: cookie.path,
	// 			secure: cookie.secure,
	// 			httpOnly: cookie.httpOnly,
	// 			expirationDate: cookie.expirationDate ? cookie.expirationDate : nextYearDate.valueOf(),
	// 			sameSite: cookie.sameSite,
	// 		});
	// 	}
	// }
}

app.on("window-all-closed", async function () {
	await cleanupBeforeExit();
	if (process.platform !== "darwin") app.quit();
});
