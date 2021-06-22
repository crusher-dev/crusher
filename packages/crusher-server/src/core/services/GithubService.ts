import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";

import { Octokit } from "@octokit/rest";
import { OCTOKIT_CONFIG } from "../../../config/github";
import { Logger } from "../../utils/logger";

const { createAppAuth } = require("@octokit/auth/dist-node");

@Service()
export default class GithubService {
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

		// @ts-ignore
		await this.octokit.checks.update({
			owner: owner,
			repo: repo,
			check_run_id: parseInt(runId),
			..._status,
			...values,
		});
	}

	async createCheckRun(owner: string, repo: string, commitId: string, installation_id: string, external_id: string) {
		return this.octokit.checks.create({
			owner: owner,
			repo: repo,
			name: "Crusher CI",
			head_sha: commitId,
			external_id: external_id.toString(),
		});
	}

	async createCheckRunFromJob(job) {
		const { installation_id, repo_name, commit_id, id } = job;
		if (!installation_id || !repo_name || !commit_id || !id) {
			Logger.error(`GithubService::createCheckRunFromJob`, "Not enough data fro creating check run");
			return false;
		}

		const owner_name = repo_name.split("/")[0];
		const repo_original_name = repo_name.split("/")[1];

		if (!owner_name || !repo_original_name) {
			Logger.error(`GithubService::createCheckRunFromJob`, "Not good repo name", {
				repo_name,
			});
			return false;
		}

		const createCheckRunResponse = await this.createCheckRun(owner_name, repo_original_name, commit_id, installation_id, id);

		const {
			data: { id: checkRunId },
		} = createCheckRunResponse;

		return { checkRunId };
	}
}
