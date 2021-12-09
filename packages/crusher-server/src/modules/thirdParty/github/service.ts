import { Service, Container } from "typedi";
import { DBManager } from "@modules/db";

import { Octokit } from "@octokit/rest";
import { OCTOKIT_CONFIG } from "../../../../config/github";
import { Logger } from "@utils/logger";
import { createAppAuth } from "@octokit/auth/dist-node";
import { BuildStatusEnum } from "@modules/resources/builds/interface";
import { GithubCheckConclusionEnum } from "./interface";
import { Authentication } from "@octokit/auth-oauth-app/dist-types/types";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

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

	extractRepoAndOwnerName(fullRepoName: string): { ownerName: string; repoName: string } {
		const splitArr = fullRepoName.split("/");
		return { ownerName: splitArr[0], repoName: splitArr[1] };
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

	async updateRunCheckStatus(githubMeta: { owner: string; repo: string; checkRunId: any }, conclusion: GithubCheckConclusionEnum) {
		const response = await this.octokit.checks.update({
			owner: githubMeta.owner,
			repo: githubMeta.repo,
			check_run_id: githubMeta.checkRunId,
			conclusion: conclusion,
		});

		return response;
	}

	private async _createCheckRun(fullRepoName: string, commitId: string, installation_id: string, external_id: number) {
		const { ownerName, repoName } = this.extractRepoAndOwnerName(fullRepoName);

		return this.octokit.checks.create({
			owner: ownerName,
			repo: repoName,
			status: "in_progress",
			name: "Crusher CI",
			head_sha: commitId,
			external_id: external_id.toString(),
		});
	}

	async createCheckRun(payload: { installationId: string; repoName: string; commitId: string; buildId: number }) {
		const { installationId, repoName: fullReponame, commitId, buildId } = payload;

		const createCheckRunResponse = await this._createCheckRun(fullReponame, commitId, installationId, buildId);

		const {
			data: { id: checkRunId },
		} = createCheckRunResponse;

		return checkRunId;
	}

	async parseGithubAccessToken(code: string): Promise<Authentication> {
		const auth = createOAuthAppAuth({
			clientId: process.env.GITHUB_APP_CLIENT_ID,
			clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
		});

		const tokenAuthentication = await auth({
			type: "token",
			code: code,
		});

		return tokenAuthentication;
	}
}

export { GithubService };
