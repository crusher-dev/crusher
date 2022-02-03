import fetch from "node-fetch";
import { ActionStatusEnum, IRunnerLogManagerInterface, IRunnerLogStepMeta } from "@shared/lib/runnerLog/interface";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import * as url from "url";
export class Notifier implements IRunnerLogManagerInterface {
	buildId: number;
	buildTestInstanceId: number;

	constructor(buildId: number, buildTestInstanceId: number, githubCheckRunId: string | null = null) {
		this.buildId = buildId;
		this.buildTestInstanceId = buildTestInstanceId;
	}

	private getRequestUrl(relativeUrl: string) {
		return url.resolve(process.env.BACKEND_URL, relativeUrl);
	}

	async notifyTestStarted(message: string, meta: any) {
		fetch(this.getRequestUrl(`/builds/${this.buildId}/instances/${this.buildTestInstanceId}/actions/mark.running`), {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		})
			.then((res) => res.text())
			.then((res) => {
				if (res === "Successful") return true;
				return false;
			})
			.catch((err) => {
				console.error("Error", err);
			});
	}

	async notifyTestFinished(message: string, hasFailed: boolean, meta: any) {
		fetch(this.getRequestUrl(`builds/${this.buildId}/instances/${this.buildTestInstanceId}/actions/log.finished`), {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ hasFailed, message: message, meta }),
		})
			.then((res) => res.text())
			.then((res) => {
				if (res === "Successful") return true;
				return false;
			})
			.catch((err) => {
				console.error("Error", err);
			});
	}

	async logTest(status: ActionStatusEnum, message: string, meta: any = {}): Promise<void> {
		console.debug(message);

		if (status === ActionStatusEnum.STARTED) {
			return this.notifyTestStarted(message, meta);
		} else if (status === ActionStatusEnum.COMPLETED) {
			return this.notifyTestFinished(message, false, meta);
		} else if (status === ActionStatusEnum.FAILED) {
			return this.notifyTestFinished(message, true, meta);
		}

		throw new Error("Invalid format to log test state");
	}

	async logStep(actionType: ActionsInTestEnum, status: ActionStatusEnum, message: string, meta: IRunnerLogStepMeta): Promise<void> {
		console.debug(message);

		fetch(this.getRequestUrl(`builds/${this.buildId}/instances/${this.buildTestInstanceId}/actions/log`), {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ actionType, status, message: message, payload: meta }),
		})
			.then((res) => res.text())
			.then((res) => {
				if (res === "Successful") return true;
				return false;
			})
			.catch((err) => {
				console.error("Error", err);
			});
	}
}
