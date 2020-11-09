import {
	Authorized,
	Body,
	CurrentUser,
	Get,
	JsonController,
	MethodNotAllowedError,
	Param,
	Post,
	QueryParams,
	Res,
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import ProjectService from '../../core/services/ProjectService';
import TestService from '../../core/services/TestService';
import ClIService from '../../core/services/ClIService';
import { appendParamsToURI } from '../../utils/url';
import AlertingService from '../../core/services/AlertingService';
import JobsService, { TRIGGER } from '../../core/services/JobsService';
import UserService from '../../core/services/UserService';
import { Logger } from '../../utils/logger';
import { resolvePathToFrontendURI } from '../../core/utils/uri';

@Service()
@JsonController('/alerting')
export class AlertingController {
	@Inject()
	private cliService: ClIService;
	@Inject()
	private jobsService: JobsService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private testService: TestService;
	@Inject()
	private alertingService: AlertingService;
	@Inject()
	private userService: UserService;

	@Authorized()
	@Get('/connect/github')
	async connectGithub(@CurrentUser({ required: true }) user, @Res() res) {
		if (!process.env.GITHUB_CLIENT_ID) {
			throw new MethodNotAllowedError();
		}

		res.redirect(
			appendParamsToURI(`https://github.com/login/oauth/authorize`, {
				client_id: process.env.GITHUB_CLIENT_ID,
			}),
		);
	}

	@Authorized()
	@Get('/connect/github/callback')
	async githubCallback(@CurrentUser({ required: true }) user, @QueryParams() params, @Res() res) {
		if (!process.env.GITHUB_CLIENT_ID) {
			throw new MethodNotAllowedError();
		}

		const { user_id } = user;
		const { code } = params;
		await this.alertingService.addGithubCode(code, user_id);
		return res.redirect(
			appendParamsToURI(`https://app.crusher.dev`, {
				client_id: process.env.GITHUB_CLIENT_ID,
			}),
		);
	}

	@Post('/hooks/reciever')
	async hookReciever(@Body() body) {
		const { check_suite, action, installation, repositories } = body;
		Logger.info('AlertingController::hookReceiver', `Received webhook from github: (${action})`);

		if (action === 'created' && installation && repositories) {
			const { id: installationId } = installation;
			for (let repo of repositories) {
				const { full_name } = repo;
				await this.userService.addOrUpdateGithubInstallation(full_name, installationId);
			}
		}
		return body;
	}

	@Get('/add/slack')
	async addSlackCallback(@CurrentUser({ required: true }) user, @QueryParams() params, @Res() res) {
		try {
			const { user_id, team_id } = user;
			const { code, state: project_id } = params;
			const integrationConfig = await this.alertingService.getSlackAccessConfig(code);
			if (!integrationConfig || integrationConfig.ok === false) {
				throw new Error('Not valid request');
			}

			const { insertId: integrationId } = await this.alertingService.addSlackIntegration(integrationConfig, user_id);
			await this.alertingService.addAlertIntegrationToProject(integrationId, project_id, user_id, integrationConfig);
		} catch (ex) {}
		res.redirect(resolvePathToFrontendURI('app/project/settings/alerting'));
		return;
	}

	@Get('/getSlackIntegrations/:project_id')
	async getSlackIntegrationForProject(@CurrentUser({ required: true }) user, @Param('project_id') project_id: number) {
		const { user_id, team_id } = user;

		return this.alertingService.getSlackIntegrationsInProject(project_id);
	}
}
