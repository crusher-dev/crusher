// Preload (Isolated World)
import { app, contextBridge, ipcRenderer } from "electron";

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
	focusOnWebView: () => ipcRenderer.send("focus-webview"),
	initWebView: (webContentsId) => ipcRenderer.send("init-web-view", webContentsId),
	getAppPath: () => ipcRenderer.sendSync("get-app-path"),
	setUserAgent: async (userAgent) => ipcRenderer.invoke("set-user-agent", userAgent),
	restartApp: () => ipcRenderer.send("restart-app"),
	getNode: async (selector) => ipcRenderer.invoke("get-node", selector),
	executeCustomCodeScript: async (scriptFunction: string) => ipcRenderer.invoke("execute-custom-code", scriptFunction),

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
