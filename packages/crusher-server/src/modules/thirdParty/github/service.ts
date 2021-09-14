import { Service, Container } from "typedi";
import { DBManager } from "@modules/db";

import { Octokit } from "@octokit/rest";
import { OCTOKIT_CONFIG } from "../../../../config/github";
import { Logger } from "@utils/logger";
import { createAppAuth } from "@octokit/auth/dist-node";

@Service()
class GithubService {
	private dbManager: DBManager;
	private octokit: Octokit;

	constructor() {
		this.dbManager = Container.get(DBManager);

		this.octokit = new Octokit({
			authStrategy: createAppAuth,
			auth: OCTOKIT_CONFIG,
			log: console,
		});
	}

	async authenticateAsApp(installation_id: string) {
		await this.octokit.auth({ type: "app" });
		const {
			data: { token },
		} = await this.octokit.apps.createInstallationAccessToken({
			installation_id: parseInt(installation_id),
		});
		this.octokit = new Octokit({ auth: token });
	}

	async updateRunCheckStatus(owner: string, repo: string, runId: string, status: string, conclusion = null) {
		const values = conclusion ? { conclusion } : {};
		const _status = status ? { status } : {};

		await this.octokit.checks.update({
			owner: owner,
			repo: repo,
			check_run_id: parseInt(runId),
			..._status,
			...values,
		});
	}

	private async _createCheckRun(owner: string, repo: string, commitId: string, installation_id: string, external_id: number) {
		return this.octokit.checks.create({
			owner: owner,
			repo: repo,
			name: "Crusher CI",
			head_sha: commitId,
			external_id: external_id.toString(),
		});
	}

	async createCheckRun(payload: { installationId: string; repoName: string; commitId: string; buildId: number }) {
		const { installationId, repoName, commitId, buildId } = payload;

		const owner_name = repoName.split("/")[0];
		const repo_original_name = repoName.split("/")[1];

		const createCheckRunResponse = await this._createCheckRun(owner_name, repo_original_name, commitId, installationId, buildId);

		const {
			data: { id: checkRunId },
		} = createCheckRunResponse;

		return checkRunId;
	}
}

export { GithubService };
