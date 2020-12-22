import { JobBuild } from "../../db/JobBuild";

export interface CreateJobRequest {
	projectId?: JobBuild;
	trigger?: string;
	host?: string;
	status?: string;
	prId?: number;
	branchName?: string;
	commitId?: string;
	repoName?: string;
	installationId?: string;
	commitName?: string;
	meta?: string;
	platform?: string;
}
