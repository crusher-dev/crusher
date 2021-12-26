// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("isCrusherRecorder", true);

contextBridge.exposeInMainWorld("recorder", {
    sendMessage: async(...args) => { console.log("Sending data"); ipcRenderer.sendToHost("recorder-message", ...args) },
});