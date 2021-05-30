var _a = require('electron'), contextBridge = _a.contextBridge, ipcRenderer = _a.ipcRenderer;
contextBridge.exposeInMainWorld('electron', {
    turnOnInspectMode: function () { return ipcRenderer.send('turn-on-inspect-mode'); },
    turnOffInspectMode: function () { return ipcRenderer.send('turn-off-inspect-mode'); }
});
//# sourceMappingURL=preload.js.map