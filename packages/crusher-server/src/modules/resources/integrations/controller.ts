import { SlackService } from "@modules/slack/service";
import { userInfo } from "os";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Res } from "routing-controllers";
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
		@Body() body: { projectId: number; repoId: number; repoName: string; repoLink: string; installationId: string },
	) {
		const { user_id } = user;
		const { projectId, repoId, repoName, repoLink, installationId } = body;
		const doc = await this.githubIntegrationService.linkRepo(repoId, repoName, installationId, repoLink, projectId, user_id);

		return {
			status: "Successful",
			data: { ...(doc.toObject() as any), _id: doc._id.toString() },
		};
	}

	@Authorized()
	@Post("/integrations/:project_id/github/actions/unlink")
	async unlinkGithubRepo(@CurrentUser({ required: true }) user, @Body() body: { id: string }) {
		await this.githubIntegrationService.unlinkRepo(body.id);
		return "Successful";
	}

	@Authorized()
	@Get("/repos/list/:projectId")
	async getLinkedReposList(@CurrentUser({ required: true }) user, @Param("projectId") projectId: number) {
		return {
			linkedRepo: this.githubIntegrationService.getLinkedRepo(projectId),
		};
	}
}

export { IntegrationsController };
