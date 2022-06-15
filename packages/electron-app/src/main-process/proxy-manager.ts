import child_process, { ChildProcess } from "child_process";
import { resolvePathToAppDirectory } from "../lib/global-config";
import fs from "fs";
import { BrowserWindow } from "electron";
import { AnyAction, Store } from "redux";
import { setProxyInitializing, setProxyState } from "../store/actions/app";

const resultsTunnelRegexp = new RegExp(/results\stunnel\s(.*)/gsm);

class ProxyManager {
    _currentProxyProcess: ChildProcess | null;
    _selectedProjectProxy: string | null;
    _results: any | null;

    constructor(private store: Store<unknown, AnyAction>) {

    }

    initializeProxy(configFilePath: string) {
        try {

            const configFileContent = fs.readFileSync(configFilePath, "utf8");
            const configFile = JSON.parse(configFileContent);

            this._selectedProjectProxy = configFile.projectId;
            this._currentProxyProcess = child_process.exec(`node /Users/utkarsh/Desktop/crusher/cli/dist/src/bin/index.js tunnel --config=${configFilePath}`);

            this.store.dispatch(setProxyInitializing(true));
		// const logWindow = new BrowserWindow({
		// 	title: "Log",
		// 	autoHideMenuBar: true,
		// 	show:true,
		// 	frame: false,
        //     width: 602,
        //     height: 200,
		// 	// This fixes subpixel aliasing on Windows
		// 	// See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
		// 	backgroundColor: "#111213",
		// 	hasShadow: false,
        //     webPreferences: {
		// 		// Disable auxclick event
		// 		// See https://developers.google.com/web/updates/2016/10/auxclick
		// 		nodeIntegration: true,
		// 		enableRemoteModule: true,
		// 		spellcheck: true,
		// 		worldSafeExecuteJavaScript: false,
		// 		contextIsolation: false,
		// 		webviewTag: true,
		// 		nodeIntegrationInSubFrames: true,
		// 		webSecurity: false,
		// 		nativeWindowOpen: true,
		// 		devTools: false,
		// 		enablePreferredSizeMode: true,
		// 	},
		// 	acceptFirstMouse: true,
		// });



        const handleProxyResults = (jsonContent) => {
            this._results = jsonContent;
            this.store.dispatch(setProxyState(jsonContent));
        };

		// logWindow.loadURL("data:text/html,%3Chtml%3E%3Cbody%3E%3Ctextarea%20id%3D%22textarea%22%20style%3D%22height%3A%20100%25%3B%20width%3A%20100%25%3B%22%3E%3C%2Ftextarea%3E%3Cstyle%3Ehtml%2C%20body%7B%20margin%3A%200%3B%20padding%3A%200%3B%7D%3C%2Fstyle%3E%3C%2Fbody%3E%3C%2Fhtml%3E");
        // logWindow.setPosition(688, 455);

            this._currentProxyProcess.stdout.on('data', (data) => {
                const matches = resultsTunnelRegexp.exec(data.toString());

                if(data.includes('results tunnel') && matches) {
                    const jsonContentRaw = matches[1].replace(/(\r\n|\n|\r)/gm, "").replace(/ /g,'')
                    const jsonContent = JSON.parse(jsonContentRaw);
                    handleProxyResults(jsonContent);
                    this.store.dispatch(setProxyInitializing(false));
                    // return logWindow.destroy();
                }
                // logWindow.webContents.executeJavaScript(`(function (){document.querySelector("#textarea").value += ${JSON.stringify(JSON.stringify(data) + "\n")}; document.getElementById("textarea").scrollTop = document.getElementById("textarea").scrollHeight;})()`);
            });
            this._currentProxyProcess.stderr.on('data', (data) => {
                console.error("Proxy command error", data);
            });
        } catch(err) {
            console.error(err);
            throw new Error("Error reading config file");
        }
    }

    disableProxy() {
        if (this._currentProxyProcess) {
            this._currentProxyProcess.kill();
            this._results = null;
            this._selectedProjectProxy = null;
        }
    }
}

export { ProxyManager };