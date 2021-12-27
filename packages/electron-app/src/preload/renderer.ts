// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("electron", {
    sendMessage: async() => ipcRenderer.invoke("renderer-message"),
});
