import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { SlackOAuthResponse } from "@modules/slack/interface";
import { SlackService } from "@modules/slack/service";
import { resolvePathToFrontendURI } from "@utils/uri";
import { BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BuildReportStatusEnum, IBuildReportTable } from "../buildReports/interface";
import { IBuildTable } from "../builds/interface";
import { IProjectTable } from "../projects/interface";
import { IUserTable } from "../users/interface";
import { IIntegrationsTable, IntegrationServiceEnum } from "./interface";

@Service()
class IntegrationsService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private slackService: SlackService;

	async addIntegration(integrationConfig: any, integrationName: IntegrationServiceEnum, projectId: number) {
		return this.dbManager.insert(`INSERT INTO public.integrations (project_id, integration_name, meta) VALUES (?, ?, ?)`, [
			projectId,
			integrationName,
			JSON.stringify(integrationConfig),
		]);
	}

	async updateIntegration(integrationConfig: any, id: number) {
		return this.dbManager.update(`UPDATE public.integrations SET meta = ? WHERE id = ?`, [JSON.stringify(integrationConfig), id]);
	}

	async deleteIntegration(id: number) {
		return this.dbManager.delete(`DELETE FROM public.integrations WHERE id = ?`, [id]);
	}

	@CamelizeResponse()
	async getSlackIntegration(projectId: number): Promise<KeysToCamelCase<IIntegrationsTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.integrations WHERE project_id = ? AND integration_name = ?", [
			projectId,
			IntegrationServiceEnum.SLACK,
		]);
	}

	@CamelizeResponse()
	async getVercelIntegration(teamId: number): Promise<KeysToCamelCase<IIntegrationsTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.integrations WHERE team_id = ? AND integration_name = ?", [
			teamId,
			IntegrationServiceEnum.VERCEL,
		]);
	}

	@CamelizeResponse()
	async getListOfIntegrations(projectId: number): Promise<Array<KeysToCamelCase<IIntegrationsTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM public.integrations WHERE project_id = ?", [projectId]);
	}

	async saveSlackSettings(payload: { alertChannel: any; normalChannel: any }, projectId: number) {
		const existingSlackIntegration = await this.getSlackIntegration(projectId);
		if (!existingSlackIntegration) throw new BadRequestError("No slack integration found");
		const integrationConfig = existingSlackIntegration.meta;

		if (!integrationConfig.channel) {
			integrationConfig.channel = {};
		}
		integrationConfig.channel["alert"] = payload.alertChannel ? payload.alertChannel : null;
		integrationConfig.channel["normal"] = payload.normalChannel ? payload.normalChannel : null;

		return this.updateIntegration(integrationConfig, existingSlackIntegration.id);
	}

	async postSlackMessageIfNeeded(projectId: number, blocks: Array<any>, type: "alert" | "normal") {
		const integration = await this.getSlackIntegration(projectId);
		if (!integration) return;
		const integrationConfig = integration.meta;
		if (!integrationConfig.channel[type]) return;
		return this.slackService.postMessage(blocks, integrationConfig.channel[type].value, integrationConfig.oAuthInfo.accessToken);
	}


	async getSlackMessageBlockForBuildReport(
		buildRecord: KeysToCamelCase<IBuildTable>,
		projectRecord: KeysToCamelCase<IProjectTable>,
		buildReportRecord: KeysToCamelCase<IBuildReportTable>,
		userInfo: KeysToCamelCase<IUserTable>,
		reportStatus: BuildReportStatusEnum,
	): Promise<Array<any>> {
		const infoFields = [
			{
				type: "mrkdwn",
				text: `*Build Id:*\n${buildRecord.id}`,
			},
			{
				type: "mrkdwn",
				text: `*Tests Count:*\n${buildReportRecord.totalTestCount}`,
			},
			{
				type: "mrkdwn",
				text: `*Triggerred By:*\n${userInfo.name}`,
			},
			{
				type: "mrkdwn",
				text: `*Status:*\n${reportStatus}`,
			},
		];

		if (buildRecord.host && buildRecord.host !== "null") {
			infoFields.push({
				type: "mrkdwn",
				text: `*Host*:\n${buildRecord.host}`,
			});
		}

		return [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `A build was triggered for project ${projectRecord.name}:\n*<${resolvePathToFrontendURI(`/app/build/${buildRecord.id}`)}|#${
						buildRecord.latestReportId
					}>*`,
				},
			},
			{
				type: "section",
				fields: infoFields,
			},
			{
				type: "actions",
				elements: [
					{
						type: "button",
						text: {
							type: "plain_text",
							text: "View Reports",
							emoji: true,
						},
						value: "click_me_123",
						url: resolvePathToFrontendURI(`/app/build/${buildRecord.id}`),
						action_id: "button-action",
					},
				],
			},
		];
	}

}

export { IntegrationsService };
