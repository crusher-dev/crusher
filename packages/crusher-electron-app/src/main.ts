import {app, BrowserWindow, session} from 'electron';

import * as path from "path";
const Element = function(){};

const loadExtension =  (mainWindow) => {
	return new Promise((resolve, reject) => {
		session.defaultSession.loadExtension(path.resolve(__dirname, '../../crusher-extension/build/'), {allowFileAccess: true}).then(async ({ id: extensionId }) => {
			await mainWindow.loadURL(`chrome-extension://${extensionId}/test_recorder.html`);
			resolve(true);
		});
	});
};

async function createWindow () {
	app.commandLine.appendSwitch('disable-site-isolation-trials');
	app.commandLine.appendSwitch('disable-web-security');

	const mainWindow = new BrowserWindow({
		webPreferences: {
			// preload: path.join(__dirname, 'preload.js'),
			nativeWindowOpen: true,
			nodeIntegration: true,
			nodeIntegrationInSubFrames: true,
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
	await mainWindow.webContents.debugger.attach();

	await mainWindow.webContents.debugger.sendCommand('Debugger.enable');
	await mainWindow.webContents.debugger.sendCommand('Runtime.enable');
	await mainWindow.webContents.debugger.sendCommand("Debugger.setAsyncCallStackDepth", {maxDepth: 9999});

	mainWindow.webContents.debugger.on('message', async (event, method, params) => {
		if(method==="Runtime.consoleAPICalled"){
			if(params.type === 'log' && params.args && params.args.length){
				if(params.args[0].value === "somelog"){
					console.log(params.args[1], params.args[2]);
				}
			}
			if(params.type === 'trace' && params.args && params.args.length == 4){
				if(params.stackTrace.callFrames.length < 2) return;
				let lastFrame = params.stackTrace.callFrames[params.stackTrace.callFrames.length - 2];
				if(params.stackTrace.parent){
					if(params.stackTrace.parent.callFrames.length < 2) return;
					lastFrame = params.stackTrace.parent.callFrames[params.stackTrace.parent.callFrames.length - 2];
				}

				if(lastFrame.functionName.startsWith("crusher__stack")) {
					if(["link", "meta", "body"].includes(params.args[1].description.trim())) return;
					const options = params.args[3];
					if(options.value) {
						const eventKeyMapArr = lastFrame.functionName.split("__");
						await mainWindow.webContents.debugger.sendCommand("Runtime.callFunctionOn", {functionDeclaration: "pushToEventMutationArr", silent: true, executionContextId: params.executionContextId, arguments: [{value: eventKeyMapArr[eventKeyMapArr.length - 1]},{objectId: params.args[1].objectId}, {value: "test"}]});
						console.log("DOM mutation on ", params.args[0].value, " from hover:", params.args[1].description, lastFrame.functionName);
					}
				}
			}
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