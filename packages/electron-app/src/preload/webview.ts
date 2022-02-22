// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("isCrusherRecorder", true);

contextBridge.exposeInMainWorld("recorder", {
    sendMessage: async (...args) => { ipcRenderer.sendToHost("recorder-message", ...args) },
    canRecordEvents: () => { return ipcRenderer.sendSync("recorder-can-record-events") },
});