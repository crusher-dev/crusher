// @DEV: Setup helper for CElectron dev env

import { MESSAGE_TYPES } from "../messageListener";

function setupContentScriptForElectronReload() {
	window["CRUSHER_CONTENT_SCRIPT"] = true;
	// Mock electron injected object
	if (!(window as any).electron) {
		(window as any).electron = {
			reloadExtension: () => {
				console.log("TRYING TO RELOAD");
				(window as any).electron.host.postMessage({
					type: MESSAGE_TYPES.RELOAD_ELECTRON_EXTENSION,
					frameId: null,
					value: true,
				});
			},
		};
	}
}

function setupBackgroundScriptForExtensionReload() {
	(window as any)["CRUSHER_BACKGROUND_SCRIPT"] = true;
}

export { setupContentScriptForElectronReload, setupBackgroundScriptForExtensionReload };
