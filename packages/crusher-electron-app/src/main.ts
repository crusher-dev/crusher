import * as path from "path";
import { app, BrowserWindow, session, ipcMain, protocol, screen } from "electron";

let APP_DOMAIN = process.env.APP_DOMAIN;

const extensionURLRegExp = new RegExp(/(^chrome-extension:\/\/)([^\/.]*)(\/test_recorder\.html?.*)/);

const loadExtension = (mainWindow) => {
	return new Promise((resolve) => {
		session.defaultSession
			.loadExtension(path.resolve(__dirname, "./extension"), { allowFileAccess: true })
			.then(({ id: extensionId }) => {
				const urlToOpen = app.commandLine.getSwitchValue("openExtensionURL") || "chrome-extension://<EXTENSION_ID_HERE>/test_recorder.html";
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

function reloadApp(mainWindow) {
	app.relaunch({ args: process.argv.slice(1).concat([`--openExtensionURL=${mainWindow.webContents.getURL()}`]) });
	app.exit();
}

async function createWindow() {
	app.commandLine.appendSwitch("--disable-site-isolation-trials");
	app.commandLine.appendSwitch("--disable-web-security");
	app.commandLine.appendSwitch("--allow-top-navigation");

	const { width, height } = screen.getPrimaryDisplay().workAreaSize


	mainWindow = new BrowserWindow({
		title: "Crusher Test Recorder",
		show: true,
		icon: getIconPath(),
		minWidth: width > 1600 ? 1600 : width,
		minHeight: height > 873 ? 873 : height,
		enableLargerThanScreen: true,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nativeWindowOpen: true,
			webSecurity: false,
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

	await session.defaultSession.cookies.set({
		name: "h-sid",
		value: "AQAAAXnN6yuZAAAAOKcCQqwRAAJ2fHLwkMzVKsxdxrCwXfy3",
		domain: ".test-headout.com",
		url: "https://www.test-headout.com/burj-khalifa-tickets-c-158/",
		path: "/",
		expirationDate: 1638209412,
	});

	await mainWindow.webContents.debugger.attach("1.3");
	await mainWindow.webContents.debugger.sendCommand("Debugger.enable");
	await mainWindow.webContents.debugger.sendCommand("DOM.enable");
	await mainWindow.webContents.debugger.sendCommand("Runtime.enable");
	await mainWindow.webContents.debugger.sendCommand("Overlay.enable");
	await mainWindow.webContents.debugger.sendCommand("Debugger.setAsyncCallStackDepth", { maxDepth: 9999 });

	ipcMain.on("set-custom-backend-domain", async (e, domain) => {
		APP_DOMAIN = domain;
	});

	ipcMain.on("reload-extension", async () => {
		reloadApp(mainWindow);
	});

	ipcMain.on("turn-on-inspect-mode", async (e, msg) => {
		await mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "searchForNode",
			highlightConfig: {
				showInfo: true,
				showStyles: true,
				contentColor: { r: 233, g: 255, b: 177, a: 0.39 },
			},
		});
	});
	ipcMain.on("turn-off-inspect-mode", async (e, msg) => {
		await mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "none",
			highlightConfig: {
				showInfo: true,
				showStyles: true,
				contentColor: {
					r: 233,
					g: 255,
					b: 177,
					a: 0.39,
				},
			},
		});
	});
	mainWindow.webContents.debugger.on("message", async (event, method, params) => {
		if (method === "Overlay.inspectNodeRequested") {
			await mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: {
					showInfo: true,
					showStyles: true,
					contentColor: {
						r: 233,
						g: 255,
						b: 177,
						a: 0.39,
					},
				},
			});
		}
	});
	mainWindow.webContents.on("new-window", function (event, popupUrl) {
		if (mainWindow.webContents.getURL().startsWith("chrome-extension")) {
			if (!popupUrl.endsWith("#crusherBackendServer")) {
				event.preventDefault();
				mainWindow.webContents.executeJavaScript(`document.querySelector('#device_browser').src = "${popupUrl}"`);
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

app.on("window-all-closed", async function () {
	const cookies = await session.defaultSession.cookies.get({ domain: APP_DOMAIN });
	await session.defaultSession.clearStorageData({
		storages: ["cookies", "localstorage"],
	});

	if (cookies && cookies.length) {
		for (const cookie of cookies) {
			const nextYearDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

			await session.defaultSession.cookies.set({
				url: `http://${cookie.domain}`,
				name: cookie.name,
				value: cookie.value,
				domain: cookie.domain,
				path: cookie.path,
				secure: cookie.secure,
				httpOnly: cookie.httpOnly,
				expirationDate: cookie.expirationDate ? cookie.expirationDate : nextYearDate.valueOf(),
				sameSite: cookie.sameSite,
			});
		}
	}

	if (process.platform !== "darwin") app.quit();
});
