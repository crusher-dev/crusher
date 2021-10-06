import { SlackService } from "@modules/slack/service";
import { GithubService } from "@modules/thirdParty/github/service";
import { generateToken } from "@utils/auth";
import { resolvePathToBackendURI } from "@utils/uri";
import { userInfo } from "os";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { AlertingService } from "../alerting/service";
import { GithubIntegrationService } from "./githubIntegration.service";
import { IntegrationServiceEnum } from "./interface";
import { IntegrationsService } from "./service";
@Service()
@JsonController("")
class IntegrationsController {
	@Inject()
	private slackService: SlackService;
	@Inject()
	private githubIntegrationService: GithubIntegrationService;
	@Inject()
	private integrationsService: IntegrationsService;
	@Inject()
	private projectAlertingService: AlertingService;

	@Authorized()
	@Get("/integrations/slack/actions/add")
	async addSlackIntegration(@CurrentUser({ required: true }) userInfo, @QueryParams() params, @Res() res) {
		const { code: slackCode, state: encodedState } = params;

		const { projectId, redirectUrl } = JSON.parse(decodeURIComponent(encodedState));
		const integrationConfig = await this.slackService.verifySlackIntegrationRequest(slackCode);
		const slackIntegrationRecord = await this.integrationsService.addSlackIntegration(integrationConfig, projectId);

		await res.redirect(redirectUrl);
		return res;
	}

	@Authorized()
	@Get("/integrations/:project_id")
	async getIntegrations(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number) {
		const integrationsList = await this.integrationsService.getListOfIntegrations(projectId);
		const slackIntegration = integrationsList.find((item) => item.integrationName === IntegrationServiceEnum.SLACK);

		return {
			emailIntegration: true,
			slackIntegration: slackIntegration,
		};
	}

	@Authorized()
	@Post("/integrations/:project_id/github/actions/link")
	async linkGithubRepo(
		@CurrentUser({ required: true }) user,
		@Param("project_id") projectId: number,
		@Body() body: { repoId: number; repoName: string; repoFullName: string; repoLink: string; installationId: string },
	) {
		const { user_id } = user;
		const { repoId, repoName, repoLink, installationId, repoFullName } = body;

		const linkedRepo = await this.githubIntegrationService.getLinkedRepo(projectId);
		if (linkedRepo) throw new Error("Project is already connected to a github repository");

		const doc = await this.githubIntegrationService.linkRepo(repoId, repoFullName, installationId, repoLink, projectId, user_id);

		return {
			status: "Successful",
			data: { ...(doc.toObject() as any), _id: doc._id.toString() },
		};
	}

	@Authorized()
	@Post("/integrations/:project_id/github/actions/unlink")
	async unlinkGithubRepo(@CurrentUser({ required: true }) user, @Body() body: { id: string }) {
		if (!body.id) throw new BadRequestError("Integration id not provided");

		await this.githubIntegrationService.unlinkRepo(body.id);
		return "Successful";
	}

	@Authorized()
	@Get("/integrations/:project_id/github/list/repo")
	async getLinkedReposList(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number) {
		return {
			linkedRepo: await this.githubIntegrationService.getLinkedRepo(projectId),
		};
	}

	// @TODO: Clean "cannot set headers after they are sent" error
	@Authorized()
	@Get("/integrations/:project_id/github/actions/callback")
	async connectGithubAccount(@QueryParams() params, @Res() res: any) {
		const { code } = params;
		const githubService = new GithubService();
		const tokenInfo = await githubService.parseGithubAccessToken(code);

		const redirectUrl = new URL(process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "http://localhost:3000/");
		redirectUrl.searchParams.append("token", (tokenInfo as any).token);
		res.redirect(redirectUrl.toString());
	}

	@Authorized()
	@Get("/integrations/:project_id/github/actions/code")
	async getGithubActionCode(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number) {
		const linkedRepo = await this.githubIntegrationService.getLinkedRepo(projectId);
		if (!linkedRepo) throw new BadRequestError("No repo linked");

		const githubUserToken = generateToken(user.user_id, user.team_id);

		return {
			code: `- name: Start crusher tests
  run: |
    curl --location --request POST '${resolvePathToBackendURI(`projects/${projectId}/tests/actions/run`)}' \\
    --header 'Content-Type: application/x-www-form-urlencoded' \\
    --cookie "token=${githubUserToken}" \\
    --data-urlencode 'githubRepoName=${linkedRepo.repoName}' \\
    --data-urlencode 'githubCommitId=\${{github.event.pull_request.head.sha}}'`,
		};
	}
}

export { IntegrationsController };
