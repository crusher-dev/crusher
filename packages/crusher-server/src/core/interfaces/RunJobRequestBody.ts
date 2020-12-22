export interface RunJobRequestBody {
	id: number;
	prId?: number;
	branchName?: string;
	repoName?: string;
	commitId?: string;
	projectId: number;
	reportId: number;
	trigger: "MANUAL" | "CRON" | "PR";
	status: "QUEUED" | "RUNNING" | "FINISHED" | "TIMEOUT" | "ABORTED";
	platform?: "CHROME" | "FIREFOX" | "SAFARI" | "ALL";
	githubCheckRunId?: string;
	host?: string;
	testCount: number;
	githubInstallationId?: string;
}
