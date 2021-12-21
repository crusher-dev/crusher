// @DEV: Setup helper for CElectron dev env
function setupContentScriptForElectronReload() {
	window["CRUSHER_CONTENT_SCRIPT"] = true;
}

function setupBackgroundScriptForExtensionReload() {
	(window as any)["CRUSHER_BACKGROUND_SCRIPT"] = true;
}

export { setupContentScriptForElectronReload, setupBackgroundScriptForExtensionReload };
