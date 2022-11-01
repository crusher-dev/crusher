import { SlackService } from "@modules/slack/service";
import { GithubService } from "@modules/thirdParty/github/service";
import { generateToken } from "@utils/auth";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/uri";
import { userInfo } from "os";
import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Req, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { AlertingService } from "../alerting/service";
import { GithubIntegrationService } from "./githubIntegration.service";
import { IntegrationServiceEnum } from "./interface";
import { IntegrationsService } from "./service";
import { fetch } from "@utils/fetch";
import { UserAuthService } from "../users/auth.service";
import { v4 as uuidv4 } from "uuid";
import { UsersService } from "../users/service";
import { ProjectsService } from "../projects/service";
import { VercelService } from "./vercel/service";
@Service()
@JsonController("")
class IntegrationsController {
	@Inject()
	private slackService: SlackService;
	@Inject()
	private githubIntegrationService: GithubIntegrationService;
	@Inject()
	private vercelService: VercelService;
	@Inject()
	private integrationsService: IntegrationsService;
	@Inject()
	private projectAlertingService: AlertingService;
	@Inject()
	private userAuthService: UserAuthService;
	@Inject()
	private userService: UsersService;
	@Inject()
	private projectsService: ProjectsService;

	@Authorized()
	@Get("/integrations/vercel/actions/get.projects")
	async getVercelProjects(@CurrentUser({ required: true }) user, @QueryParams() params) {
		const { user_id: userId, team_id: teamId } = user;
		const vercelIntegration = await this.integrationsService.getVercelIntegration(teamId);
		const projects = await this.vercelService.getProjects(vercelIntegration.meta.accessToken);

		return projects;
	}

	@Authorized()
	@Get("/integrations/slack/actions/add")
	async addSlackIntegration(@CurrentUser({ required: true }) userInfo, @QueryParams() params, @Res() res) {
		const { team_id: teamId } = userInfo;
		const { code: slackCode, state: encodedState } = params;

		const { projectId, redirectUrl } = JSON.parse(decodeURIComponent(encodedState));
		const integrationConfig = await this.slackService.verifySlackIntegrationRequest(slackCode);

		const existingSlackIntegration = await this.integrationsService.getSlackIntegration(projectId);
		if (existingSlackIntegration) {
			await this.integrationsService.updateIntegration({ oAuthInfo: integrationConfig }, existingSlackIntegration.id);
		} else {
			await this.integrationsService.addIntegration({ oAuthInfo: integrationConfig }, IntegrationServiceEnum.SLACK, projectId, teamId);
		}

		await res.redirect(redirectUrl);
		return res;
	}

	@Authorized()
	@Get("/integrations/:project_id/slack/actions/remove")
	async removeSlackIntegration(@CurrentUser({ required: true }) userInfo, @Param("project_id") projectId: number, @QueryParams() params, @Res() res) {
		const existingSlackIntegration = await this.integrationsService.getSlackIntegration(projectId);
		if (!existingSlackIntegration) {
			throw new BadRequestError("Slack integration not found");
		}

		await this.integrationsService.deleteIntegration(existingSlackIntegration.id);

		return { status: "Successful" };
	}

	@Authorized()
	@Post("/integrations/:project_id/slack/actions/save.settings")
	async saveSlackIntegrationSettings(
		@CurrentUser({ required: true }) user,
		@Param("project_id") projectId: number,
		@Body() body: { alertChannel: any; normalChannel: any },
	) {
		return this.integrationsService.saveSlackSettings({ alertChannel: body.alertChannel, normalChannel: body.normalChannel }, projectId);
	}

	@Authorized()
	@Get("/integrations/:project_id")
	async getIntegrations(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number) {
		const integrationsList = await this.integrationsService.getListOfIntegrations(projectId);
		const slackIntegration = integrationsList.find((item) => item.integrationName === IntegrationServiceEnum.SLACK);
		const webhook = await this.projectsService.getProjectWebhook(projectId);
		const linkedRepo = await this.githubIntegrationService.getLinkedRepo(projectId);
		const vercelIntegration = await this.vercelService.getVercelIntegrationForProject(projectId);

		return {
			emailIntegration: true,
			slackIntegration: slackIntegration,
			webhook: webhook,
			gitIntegration: linkedRepo,
			vercelIntegration: vercelIntegration
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

		const gitLinkedProject = await this.githubIntegrationService.getIntegrationRecord(repoFullName);
		if(gitLinkedProject) throw new Error("Git repo is already linked to another project");
	
		const linkedRepo = await this.githubIntegrationService.getLinkedRepo(projectId);
		if (linkedRepo) throw new Error("Project is already connected to a github repository");

		const doc = await this.githubIntegrationService.linkRepo(repoId, repoFullName, installationId, repoLink, projectId, user_id);

		return {
			status: "Successful",
			data: {
				...doc,
			},
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
	@Get("/integrations/:project_id/github/actions/callback")
	async connectGithubAccount(@QueryParams() params: any, @Req() req: any, @Res() res: any) {
		const { code, state: encodedState } = params;
		const githubService = new GithubService();
		const tokenInfo = await githubService.parseGithubAccessToken(code);

		const state = JSON.parse(Buffer.from(encodedState, "base64").toString("ascii"));
		if (state.type === "auth") {
			const userInfo = await githubService.getUserInfo((tokenInfo as any).token);
			const githubRegisteredUser = await this.userService.getUserByGithubUserId(`${userInfo.id}`);

			if (!githubRegisteredUser) {
				const userRecord = await this.userAuthService.authUser(
					{
						name: userInfo.name || userInfo.userName,
						email: userInfo.email + uuidv4().substring(0, 10),
						password: uuidv4(),
					},
					req,
					res,
					state.inviteType ? encodedState : null,
					state.sessionInviteCode ? state.sessionInviteCode : null
				);

				await this.userService.setGithubUserId(`${userInfo.id}`, userRecord.userId);
			} else {
				await this.userAuthService.setUserAuthCookies(githubRegisteredUser.id, githubRegisteredUser.teamId, req, res);
			}
			const url = new URL(resolvePathToFrontendURI("/login_sucessful?github_token=" + (tokenInfo as any).token));
			if(state.lK) {
				url.searchParams.append("lK", state.lK);
			}
			return res.redirect(url.toString());
		}

		// @TODO: Use proper util functions here
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

	@Authorized()
	@Get("/integrations/:project_id/slack/channels")
	async getSlackChannels(
		@CurrentUser({ required: true }) userInfo,
		@Param("project_id") projectId: number,
		@QueryParams() params: { cursor?: string },
		@Res() res,
	) {
		const slackIntegration = await this.integrationsService.getSlackIntegration(projectId);
		if (!slackIntegration) throw new BadRequestError("No slack account connected");

		const slackIntegrationConfig = slackIntegration.meta;

		const fetchFromSlack = async (cursor?: string) => {
			const { channels, nextCursor } = await fetch("https://slack.com/api/conversations.list?types=public_channel,private_channel", {
				header: {
					Authorization: `Bearer ${slackIntegrationConfig.oAuthInfo.accessToken}`,
				},
				method: "GET",
				payload: {
					cursor: cursor ? cursor : "",
					limit: 50,
					exclude_archived: true,
				},
			}).then((data: any) => {
				return {
					accessToken: slackIntegrationConfig.oAuthInfo.accessToken,
					nextCursor: data.response_metadata ? data.response_metadata.next_cursor : "",
					channels: data.channels ? data.channels.map((channel) => ({ id: channel.id, name: channel.name })) : [],
				};
			});

			return { channels, nextCursor };
		};

		// Hit api until channels is not empty and nextCursor is present
		let channels = [];
		let nextCursor = params.cursor ? params.cursor : "";
		do {
			const { channels: newChannels, nextCursor: newNextCursor } = await fetchFromSlack(nextCursor);
			channels = channels.concat(newChannels);
			nextCursor = newNextCursor;
		} while (channels.length === 0 && nextCursor);

		return { channels, nextCursor };
	}

	@Authorized()
	@Get("/integrations/cli/commands")
	async getCliCommands(@CurrentUser({ required: true }) user) {
		const { user_id, team_id } = user;
		return ["npx crusher-cli test:create", "npx crusher-cli test:run"];
	}

	@Authorized()
	@Get("/integrations/:project_id/ci/command")
	async getIntegrationCommand(@CurrentUser({ required: true }) userInfo, @Param("project_id") projectId: number) {
		const { user_id, team_id } = userInfo;
		const githubUserToken = generateToken(user_id, team_id);

		return `npx crusher-cli test:run --token=${githubUserToken} --projectid=${projectId}`;
	}


	@Authorized()
	@Post("/integrations/:project_id/actions/save.webhook")
	async saveWebhook(@Param("project_id") projectId: number, @Body() body: { webhook: string }) {
		if (!body.webhook) throw new BadRequestError("No webhook provided");
		await this.projectsService.updateWebhook(body.webhook, projectId);
		return "Successful";
	}
}

export { IntegrationsController };
