import {app, BrowserWindow, session, ipcMain} from 'electron';

import * as path from "path";
const Element = function(){};

const loadExtension =  (mainWindow) => {
	return new Promise((resolve, reject) => {
		session.defaultSession.loadExtension(
			path.resolve(__dirname, '../../crusher-extension/build/'),
			{ allowFileAccess: true}
		).then(async ({ id: extensionId }) => {
			await mainWindow.loadURL(`chrome-extension://${extensionId}/test_recorder.html`);
			resolve(true);
		});
	});
};

async function createWindow () {
	app.commandLine.appendSwitch('--disable-site-isolation-trials');
	app.commandLine.appendSwitch('--disable-web-security');
	app.commandLine.appendSwitch("--allow-top-navigation");

	const mainWindow = new BrowserWindow({
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
			if(!popupUrl.includes("localhost:8000") && !popupUrl.includes("crusher.dev")) {
				event.preventDefault();
				mainWindow.webContents.executeJavaScript(`document.querySelector('#device_browser').src = "${popupUrl}"`);
			}
		} else {
			event.preventDefault();
			mainWindow.webContents.executeJavaScript(`window.location.href = "${popupUrl}"`);
		}
	});

	mainWindow.webContents.session.clearStorageData({
		storages: [
			"cookies",
			"serviceworkers",
			"cachestorage",
			"websql",
			"shadercache",
			"filesystem",
			"indexdb",
			"appcache"
		]
	});
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
