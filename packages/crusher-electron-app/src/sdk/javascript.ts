import { Debugger } from "electron";
import { Protocol } from "playwright/types/protocol";
import * as utilityScriptSource from "playwright/lib/generated/utilityScriptSource";
import { getExceptionMessage } from "./utils";
export type ObjectId = string;

export class ExecutionContext {
	readonly _cdp: Debugger;
	readonly _executionContext: Protocol.Runtime.ExecutionContextDescription;
	private _utilityScriptPromise: Promise<ObjectId> | undefined;

	constructor(executionContext: Protocol.Runtime.ExecutionContextDescription, cdp: Debugger) {
		this._cdp = cdp;
		this._executionContext = executionContext;
	}

	async rawEvaluateHandle(expression: string): Promise<ObjectId> {
		const { exceptionDetails, result: remoteObject } = await this._cdp.sendCommand("Runtime.evaluate", {
			expression,
			contextId: this._executionContext.id,
		});
		if (exceptionDetails) throw new Error("Evaluation failed: " + getExceptionMessage(exceptionDetails));

		return remoteObject.objectId!;
	}

	utilityScript(): Promise<ObjectId> {
		if (!this._utilityScriptPromise) {
			const source = `
      (() => {
        ${utilityScriptSource.source}
        return new pwExport();
      })();`;
			this._utilityScriptPromise = this.rawEvaluateHandle(source);
		}
		return this._utilityScriptPromise;
	}
}
