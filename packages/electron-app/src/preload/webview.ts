// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("recorder", {
    sendMessage: async(...args) => ipcRenderer.invoke("send-message", ...args),
});