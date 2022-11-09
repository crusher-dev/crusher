import child_process, { ChildProcess } from "child_process";
import { app } from "electron";
import { AnyAction, Store } from "redux";
import { readProjectConfig } from "../lib/project-config";
import { setProxyInitializing, setProxyState } from "../store/actions/app";
import { getRelativePath } from "../utils";
import { Message, BlankMessage } from "@crusher-shared/modules/logger/utils";
import { chalkShared } from "@shared/modules/logger";

const resultsTunnelRegexp = new RegExp(/results\stunnel\s(.*)/gms);

class ProxyManager {
	_currentProxyProcess: ChildProcess | null;
	_results: any | null;
	_logs: string[] = [];

	isDisabled: boolean = false;

	constructor(private store: Store<unknown, AnyAction>) { }

	private handleProxyResults(result: string) {
		const extractJsonRegex = new RegExp(/\{.*}/gm);
		const matches = result.match(extractJsonRegex);
		if (!matches) throw new Error("Error while reading tunnel logs");
		const jsonContentRaw = matches[0].replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, "");
		this._results = JSON.parse(jsonContentRaw);
		Message(chalkShared.bgMagentaBright.bold, ' tools  ', `🚇 Tunnel is ready and live\n`);

		// console.info("[ProxyManager]: Tunnel is ready and live");
		// // console.table
		(console as any).tablePlain(
			Object.entries(this._results).map((a: any) => {
				return { name: a[0], tunnel: a[1].tunnel, intercept: a[1].intercept };
			}),
		);

		this.store.dispatch(setProxyState(this._results));
		this.store.dispatch(setProxyInitializing(false));
	}

	initializeProxy(configFilePath: string) {
		if (this.isDisabled || !configFilePath) return;

		const projectConfig = readProjectConfig(configFilePath);
		if (!(projectConfig && projectConfig.proxy)) return;
		(console as any).logPlain("\n");
		// Message(chalkShared.bgMagentaBright.bold, ' tools  ', `🚇 Creating cloudflare tunnel from ${chalkShared.magentaBright(getRelativePath(configFilePath))}\n`);
		// BlankMessage(`${chalkShared.gray('run with CRUSHER_DEBUG=1 mode if tunnel is not working.')}`);
		// BlankMessage("Create tunnel proxy defined in " + getRelativePath(configFilePath));
		this._logs = [];
		try {
			this.isDisabled = true;
			const cliPath = app.commandLine.getSwitchValue("crusher-cli-path");
			this._currentProxyProcess = child_process.exec(`node ${cliPath} tunnel --config=${configFilePath} --colors`);

			this.store.dispatch(setProxyInitializing(true));

			this._currentProxyProcess.stdout.on("data", (data) => {
				const matches = resultsTunnelRegexp.exec(data.toString());
	
				if(data.includes(" ")) {
					(console as any).logPlain(data);
				}
				else {
					console.debug(`[ProxyManager/cloudflared] ${data.toString()}`);
				}
				if (data.includes("intercept") && data.includes("url")) {
					const consoleTableOutput = data.toString();
					(console as any).logPlain(consoleTableOutput);
					return;
					// return this.handleProxyResults(data);
				}
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
