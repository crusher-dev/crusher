// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

const callbacks = [];

ipcRenderer.on("post-message-to-webview", (event, data) => {
	for (const callbackInfo of callbacks) {
		callbackInfo.callback({ data });
	}
});

contextBridge.exposeInMainWorld("isCrusherRecorder", true);

contextBridge.exposeInMainWorld("electron", {
	reloadExtension: () => ipcRenderer.send("reload-extension"),
	webview: {
		addEventListener: (type, callback) => {
			callbacks.push({ type, callback });
		},
	},
	host: {
		postMessage: (data) => {
			ipcRenderer.send("post-message-to-host", data);
		},
	},
});
