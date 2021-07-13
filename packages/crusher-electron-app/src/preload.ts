// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

const callbacks = [];

ipcRenderer.on("post-message-to-host", (event, data) => {
	for (const callbackInfo of callbacks) {
		callbackInfo.callback({ data });
	}
});

contextBridge.exposeInMainWorld("electron", {
	turnOnInspectMode: () => ipcRenderer.send("turn-on-inspect-mode"),
	turnOffInspectMode: () => ipcRenderer.send("turn-off-inspect-mode"),
	setCustomBackendDomain: (domain) => ipcRenderer.send("set-custom-backend-domain", domain),
	reloadExtension: () => ipcRenderer.send("reload-extension"),
	initWebView: (webContentsId) => ipcRenderer.send("init-web-view", webContentsId),
	getAppPath: () => ipcRenderer.sendSync("get-app-path"),
	setUserAgent: (userAgent) => ipcRenderer.send("set-user-agent", userAgent),
	webview: {
		postMessage: (data) => {
			ipcRenderer.send("post-message-to-webview", data);
		},
	},
	host: {
		addEventListener: (type, callback) => {
			callbacks.push({ type, callback });
		},
	},
});
