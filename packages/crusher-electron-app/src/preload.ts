// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
	'electron',
	{
		turnOnInspectMode: () => ipcRenderer.send('turn-on-inspect-mode'),
		turnOffInspectMode: () => ipcRenderer.send('turn-off-inspect-mode')
	}
)