import { SlackService } from "@modules/slack/service";
import { userInfo } from "os";
import { Authorized, CurrentUser, Get, JsonController, Param, Post, QueryParams, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { AlertingService } from "../alerting/service";
import { IntegrationServiceEnum } from "./interface";
import { IntegrationsService } from "./service";

@Service()
@JsonController("")
class IntegrationsController {
	@Inject()
	private slackService: SlackService;
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
}

export { IntegrationsController };
