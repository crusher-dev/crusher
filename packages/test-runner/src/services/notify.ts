import fetch from "node-fetch";
import { iAction } from "@shared/types/action";

export class NotifyService {
	buildId: number;
	buildTestInstanceId: number;
	githubCheckRunId?: string | null;

	constructor(buildId: number, buildTestInstanceId: number, githubCheckRunId: string | null = null) {
		this.buildId = buildId;
		this.buildTestInstanceId = buildTestInstanceId;
		this.githubCheckRunId = githubCheckRunId;
	}

	async notifyTestAddedToQueue(): Promise<boolean> {
		console.debug(`Instance #${this.buildTestInstanceId} of #${this.buildId} started`);

		return fetch(`http://localhost:8000/builds/${this.buildId}/instances/${this.buildTestInstanceId}/actions/mark.running`, {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ githubCheckRunId: this.githubCheckRunId }),
		})
			.then((res) => res.text())
			.then((res) => {
				if (res === "Successful") return true;
				return false;
			});
	}

	async notifyTestFinished(hasFailed: boolean): Promise<boolean> {
		console.debug(`Instance #${this.buildTestInstanceId} of #${this.buildId} ${hasFailed ? "failed" : "completed"}`);

		return fetch(`http://localhost:8000/builds/${this.buildId}/instances/${this.buildTestInstanceId}/actions/log.finished`, {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ hasFailed, githubCheckRunId: this.githubCheckRunId }),
		})
			.then((res) => res.text())
			.then((res) => {
				if (res === "Successful") return true;
				return false;
			});
	}

	async logStep(action: iAction, status: "RUNNING" | "COMPLETED" | "FAILED", payload: any): Promise<boolean> {
		console.debug(`Instance #${this.buildTestInstanceId} of #${this.buildId}: ${action.type}[${status}]`);

		return fetch(`http://localhost:8000/builds/${this.buildId}/instances/${this.buildTestInstanceId}/actions/log`, {
			method: "POST",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ action, status, payload, githubCheckRunId: this.githubCheckRunId }),
		})
			.then((res) => res.text())
			.then((res) => {
				if (res === "Successful") return true;
				return false;
			});
	}
}
