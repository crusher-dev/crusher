import {app, BrowserWindow, session, ipcMain} from 'electron';
import * as path from "path";

require('dotenv').config();

const APP_DOMAIN = process.env.NODE_ENV === "development" ?
	process.env.LOCAL_DOMAIN : process.env.PRODUCTION_DOMAIN;

const loadExtension =  (mainWindow) => {
	const isBundlingForRelease = process.env.TARGET === "release";

	return new Promise((resolve) => {
		session.defaultSession.loadExtension(
			path.resolve(__dirname, `${isBundlingForRelease ? "./extension" : "../../crusher-extension/build"}`),
			{ allowFileAccess: true}
		).then(({ id: extensionId }) => {
			return mainWindow.loadURL(`chrome-extension://${extensionId}/test_recorder.html`);
		}).then(() => {
			resolve(true);
		});
	});
};

let mainWindow;

async function createWindow () {
	app.commandLine.appendSwitch('--disable-site-isolation-trials');
	app.commandLine.appendSwitch('--disable-web-security');
	app.commandLine.appendSwitch("--allow-top-navigation");
	mainWindow = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nativeWindowOpen: true,
			webSecurity: false,
			devTools: true
		}
	});
	await mainWindow.maximize();

	await mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
		(responseDetails, updateCallback)=>{
			Object.keys(responseDetails.responseHeaders).map(headers => {
				if(["x-frame-options", "content-security-policy", "frame-options"].includes(headers.toString().toLowerCase())) {
					delete responseDetails.responseHeaders[headers];
				}
			});
			updateCallback({cancel: false, responseHeaders: responseDetails.responseHeaders});
		}
	);
	await loadExtension(mainWindow);

	await session.defaultSession.cookies.set({
		name: "h-sid",
		value: "AQAAAXnN6yuZAAAAOKcCQqwRAAJ2fHLwkMzVKsxdxrCwXfy3",
		domain: ".test-headout.com",
		url: "https://www.test-headout.com/burj-khalifa-tickets-c-158/",
		path: "/",
		expirationDate: 1638209412
	});

	await mainWindow.webContents.debugger.attach("1.3");
	await mainWindow.webContents.debugger.sendCommand('Debugger.enable');
	await mainWindow.webContents.debugger.sendCommand('DOM.enable');
	await mainWindow.webContents.debugger.sendCommand('Runtime.enable');
	await mainWindow.webContents.debugger.sendCommand('Overlay.enable');
	await mainWindow.webContents.debugger.sendCommand("Debugger.setAsyncCallStackDepth", {maxDepth: 9999});
	ipcMain.on('turn-on-inspect-mode', async (e, msg) => {
		await mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "searchForNode", highlightConfig: {
				'showInfo': true,
				'showStyles':true,
				'contentColor':{r: 233, g: 255, b: 177, a: 0.39}
			}
		});
	});
	ipcMain.on('turn-off-inspect-mode', async (e, msg) => {
		await mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
			mode: "none",
			highlightConfig: {
				'showInfo': true,
				'showStyles':true,
				'contentColor':{
					r: 233,
					g: 255,
					b: 177,
					a: 0.39
				}
			}
		});
	});
	mainWindow.webContents.debugger.on('message', async (event, method, params) => {
		if(method === "Overlay.inspectNodeRequested"){
			await mainWindow.webContents.debugger.sendCommand("Overlay.setInspectMode", {
				mode: "none",
				highlightConfig: {
					'showInfo': true,
					'showStyles':true,
					'contentColor':{
						r: 233,
						g: 255,
						b: 177,
						a: 0.39
					}
				}
			});
		}
	});
	mainWindow.webContents.on('new-window', function(event, popupUrl) {
		if(mainWindow.webContents.getURL().startsWith("chrome-extension")) {
			if(!popupUrl.includes(APP_DOMAIN)) {
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
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	});
});

app.on('window-all-closed', async function () {
	const cookies = await session.defaultSession.cookies.get({domain: APP_DOMAIN});
	await session.defaultSession.clearStorageData({
		storages: [
			"cookies",
			"localstorage"
		]
	});

	if(cookies && cookies.length){

		for(let cookie of cookies) {
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
				sameSite: cookie.sameSite
			});
		}
	}

	if (process.platform !== 'darwin') app.quit()
});