import child_process, { ChildProcess } from "child_process";
import fs from "fs";
import { app, BrowserWindow } from "electron";
import { AnyAction, Store } from "redux";
import { setProxyInitializing, setProxyState } from "../store/actions/app";

const resultsTunnelRegexp = new RegExp(/results\stunnel\s(.*)/gms);

class ProxyManager {
	_currentProxyProcess: ChildProcess | null;
	_results: any | null;
	_logs: Array<string> = [];

	isDisabled: boolean = false;

	constructor(private store: Store<unknown, AnyAction>) {}

	private handleProxyResults(result: string) {
		const jsonContentRaw = result.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, "");
		this._results = JSON.parse(jsonContentRaw);

		console.info("[ProxyManager]: Tunnel is ready and live");
		// console.table
		console.table(Object.entries(this._results).map((a: any) => {
				return { name: a[0], tunnel: a[1].tunnel, intercept: a[1].intercept}
		}));

		this.store.dispatch(setProxyState(this._results));
		this.store.dispatch(setProxyInitializing(false));
	}

	initializeProxy(configFilePath: string) {
		if (this.isDisabled) return;
		console.info("[ProxyManager]: Initializing proxy", { configFilePath });

		this._logs = [];
		try {
			const cliPath = app.commandLine.getSwitchValue("crusher-cli-path");
			this._currentProxyProcess = child_process.exec(`node ${cliPath} tunnel --config=${configFilePath}`);

			this.store.dispatch(setProxyInitializing(true));

			this._currentProxyProcess.stdout.on("data", (data) => {
				const matches = resultsTunnelRegexp.exec(data.toString());
				if (data.includes("results tunnel") && matches) {
					return this.handleProxyResults(matches[1]);
				}
				console.debug(`[ProxyManager/cloudflared] ${data.toString()}`);
				this._logs.push(data.toString());
			});
			this._currentProxyProcess.stderr.on("data", (data) => {
				console.error("[ProxyManager/cloudflared]: " + data);
			});
			this._currentProxyProcess.on("exit", () => {
				this.store.dispatch(setProxyInitializing(false));
			});
		} catch (err) {
			console.error(`[ProxyManager]: Error '${err.message}' occurred during initialization`, { stack: err.stack });
			throw new Error("Error reading config file");
		}
	}

	public disableProxy() {
		this._logs = [];
		if (this._currentProxyProcess) {
			console.info("[ProxyManager]: Killing an existing tunnel process");

			this.store.dispatch(setProxyState({}));
			this._currentProxyProcess.kill();
			this._currentProxyProcess = null;
			this._results = null;
		}
	}
}

export { ProxyManager };
