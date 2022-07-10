import { Service, Container } from "typedi";
import { DBManager } from "@modules/db";

import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { OCTOKIT_CONFIG } from "../../../../config/github";
import { createAppAuth } from "@octokit/auth/dist-node";
import { BuildStatusEnum } from "@modules/resources/builds/interface";
import { GithubCheckConclusionEnum } from "./interface";
import { Authentication } from "@octokit/auth-oauth-app/dist-types/types";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import axios from "axios";
import { BadRequestError } from "routing-controllers";
import { resolvePathToFrontendURI } from "@utils/uri";

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

	async createOrUpdateIssueComment(githubMeta: { fullRepoName: string; commit: string }, buildId: number, projectId: number) {
		const { fullRepoName, commit } = githubMeta;
		const { ownerName: owner, repoName: repo } = this.extractRepoAndOwnerName(fullRepoName);

		const pullRequests: { data: Array<any> } = await this.octokit.repos.listPullRequestsAssociatedWithCommit({
			owner: owner,
			repo: repo,
			commit_sha: commit,
		});
		const issuesArr = pullRequests.data.map((pullRequest: any) => pullRequest.number);
		return Promise.all(
			issuesArr.map(async (issueNumber) => {
				const comments = await this.octokit.rest.issues.listComments({
					owner: owner,
					repo: repo,
					issue_number: issueNumber,
				});
				const crusherBotComment = (comments as any).data.find((comment: any) => comment.user.html_url === process.env.GITHUB_APP_URL);
				const githubMessage = `This pull request is being automatically tested with Crusher ([learn more](https://vercel.link/github-learn-more)).
To see the status of your build, click below or on the icon next to each commit.

🔍  View builds: ${resolvePathToFrontendURI(`/app/build/${buildId}`)}
✅  Add a new test: ${resolvePathToFrontendURI(`/project/${projectId}/create`)}`;

				if (!crusherBotComment) {
					return this.octokit.rest.issues.createComment({
						owner: owner,
						repo: repo,
						issue_number: issueNumber,
						body: githubMessage,
					});
				} else {
					return this.octokit.rest.issues.updateComment({
						comment_id: crusherBotComment.id,
						owner: owner,
						repo: repo,
						body: githubMessage,
					});
				}
			}),
		);
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

	async getUserInfo(accessToken: string): Promise<{ name: string; email: string; id: number; userName: string }> {
		const octokit = new Octokit({ auth: accessToken });
		const userInfo: any = await octokit.users.getAuthenticated();
		const userEmails: any = await octokit.users.listEmailsForAuthenticated();

		const primaryEmail = userEmails.data.find((email: any) => email.primary);
		if (!primaryEmail) throw new BadRequestError("No primary email address found");

		return { name: userInfo.data.name, email: primaryEmail.email, id: userInfo.data.id, userName: userInfo.data.login };
	}
}

export { GithubService };
