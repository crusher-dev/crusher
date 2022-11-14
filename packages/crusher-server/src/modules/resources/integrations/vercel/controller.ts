import { Analytics } from "@crusher-shared/modules/analytics/AnalyticsManager";
import { ServerEventsEnum } from "@crusher-shared/modules/analytics/constants";
import { RedisManager } from "@modules/redis";
import { BuildsService } from "@modules/resources/builds/service";
import { TestService } from "@modules/resources/tests/service";
import { UsersService } from "@modules/resources/users/service";
import { BrowserEnum } from "@modules/runner/interface";
import { SlackService } from "@modules/slack/service";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/uri";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Res } from "routing-controllers";
import { Service, Inject } from "typedi";
import { GithubIntegrationService } from "../githubIntegration.service";
import { IntegrationsService } from "../service";
import { DeploymentCreatedEvent, DeploymentPreparedEvent, DeploymentReadyEvent } from "./interface";
import { VercelService } from "./service";

@Service()
@JsonController("")
class VercelIntegrationsController {
	@Inject()
	private vercelService: VercelService;
    @Inject()
    private gitIntegrationService: GithubIntegrationService;
    @Inject()
    private userService: UsersService;
    @Inject()
    private testService: TestService;
    @Inject()
    private buildService: BuildsService;
    @Inject()
    private redisManager: RedisManager;
    @Inject()
    private integrationsService: IntegrationsService;


	@Authorized()
	@Get("/integrations/vercel/actions/get.projects")
	async getVercelProjects(@CurrentUser({ required: true }) user, @QueryParams() params) {
		const { user_id: userId, team_id: teamId } = user;
		const vercelIntegration = await this.integrationsService.getVercelIntegration(teamId);
		const projects = await this.vercelService.getProjects(vercelIntegration.meta.accessToken, vercelIntegration.meta.vercelTeamId);

		return projects;
	}

    @Authorized()
    @Get("/integrations/vercel/actions/link")
    async linkVercelIntegration(@CurrentUser({required: true}) user, @QueryParams() params: {next: string; code: string; teamId: string; configurationId: string;}, @Res() res) {
        const {user_id: userId, team_id: teamId} = user;
        
        const userInfo = await this.userService.getUserInfo(userId);
        const userInfoMeta = JSON.parse(userInfo.meta);
        console.log("User info meta", userInfoMeta);
        const selectedProjectId = userInfoMeta["appState.SELECTED_PROJECT_ID"];

        const {next, code, teamId: vercelTeamId, configurationId} = params;
        const accessToken = await this.vercelService.getAccessToken(code);

        await this.vercelService.linkVercelIntegration({userId, teamId, projectId: selectedProjectId, configurationId: configurationId, accessToken, vercelTeamId});
        
        return res.redirect(next);
    }

    @Authorized()
    @Post("/integrations/:project_id/vercel/actions/connect")
    async connectVercelIntegration(@Param("project_id") projectId: number, @CurrentUser({required: true}) user, @Body() body: {vercel_project_id: string; vercel_project_name: string; meta: any}, @Res() res) {
        const {user_id: userId, team_id: teamId} = user;
        const { vercel_project_id: vercelProjectId, vercel_project_name: vercelProjectName, meta } = body;

        const vercelTeamIntegration = await this.integrationsService.getVercelIntegration(teamId);

        const existingProjectVercelIntegration = await this.vercelService.getVercelIntegrationForProject(projectId);
        if(!existingProjectVercelIntegration) {
            await this.vercelService.addVercelIntegrationForProject({
                userId,
                projectId,
                vercelProjectId,
                name: vercelProjectName,
                meta: meta,
                integrationId: vercelTeamIntegration.id,
            });
        } else {
            await this.vercelService.updateVercelIntegrationForProject(meta, projectId);
        }

        Analytics.trackProject({
			groupId: projectId,
			event: ServerEventsEnum.LINK_VERCEL_REPO,
			properties: {
				userId: userId,
				vercelProjectName: vercelProjectName,
                vercelProjectId: vercelProjectId,
			}
		});

        return "Successful";
    }

    @Authorized()
    @Post("/integrations/:project_id/vercel/actions/disconnect")
    async disconnectVercelIntegration(@Param("project_id") projectId: number, @CurrentUser({required: true}) user, @Res() res) {
        await this.vercelService.deleteVercelIntegrationForProject(projectId);
        return "Successful";
    }

    @Post("/integrations/vercel/webhook")
    async handleVercelWebhook(@Body() body : DeploymentReadyEvent | DeploymentPreparedEvent | DeploymentCreatedEvent, @Res() res) {
        if(body.type === "deployment-prepared") {
            console.log("Recieving webhook from vercel");
            const check = await this.redisManager.get(body.payload.deploymentId);
            if(!check) throw new Error("Deployment not found");

            const { projectId: vercelProjectId } = body.payload;
            const { githubOrg, githubRepo, githubCommitSha, githubCommitMessage } = body.payload.deployment.meta;
            const { url: deploymentUrl } = body.payload.deployment;

            const repoName = `${githubOrg}/${githubRepo}`;
            const vercelIntegrationRecord = await this.vercelService.getVercelIntegrationFromVercelProjectId(vercelProjectId);
            const vercelTeamIntegration = await this.integrationsService.getIntegrationById(vercelIntegrationRecord.integrationId);

            const vercelIntegrationMeta: {accessToken: string; userId: number;} = vercelTeamIntegration.meta;
            const meta = {
                disableBaseLineComparisions: false,
                vercel: {
                    checkId: check,
                    deploymentId: body.payload.deploymentId,
                    teamId: body.teamId,
                },
                github: {
                    repoName: repoName,
                    commitId: githubCommitSha,
                    githubCommitMessage: githubCommitMessage
                }
            };

            console.log("Triggering test now for project: " + repoName);
            // await this.vercelService.createDeploymentStatus(vercelIntegrationMeta.accessToken, body.payload.deploymentId, body.teamId, "");
            const build = await this.testService.runTestsInProject(
                vercelIntegrationRecord.projectId,
                vercelIntegrationMeta.userId,
                { host: "https://" + deploymentUrl, context: null },
                meta,
                null,
                [BrowserEnum.CHROME],
                null,
                null,
                null,
                null,
            );

            await this.vercelService.updateDeploymentStatus(vercelIntegrationMeta.accessToken, body.payload.deploymentId, check, body.teamId, "running", await this.buildService.getFrontendBuildReportUrl(build.buildId));
        } else if (body.type === "deployment") {
            console.log("Deployment created, webhook called");
            const { githubOrg, githubRepo, githubCommitSha, githubCommitMessage } = body.payload.deployment.meta;
            const { url: deploymentUrl } = body.payload.deployment;
            const { projectId: vercelProjectId } = body.payload;

            const repoName = `${githubOrg}/${githubRepo}`;
            const vercelIntegrationRecord = await this.vercelService.getVercelIntegrationFromVercelProjectId(vercelProjectId);
            const vercelTeamIntegration = await this.integrationsService.getIntegrationById(vercelIntegrationRecord.integrationId);

            const vercelIntegrationMeta: {accessToken: string; userId: number;} = vercelTeamIntegration.meta;
            
            console.log("Creating check now: " + repoName);
            const checkIdResponse = await this.vercelService.createDeploymentStatus(vercelIntegrationMeta.accessToken, body.payload.deploymentId, body.teamId, "");
            console.log("Check id: " + checkIdResponse.id);

            await this.redisManager.set(body.payload.deploymentId, checkIdResponse.id, {expiry: { type: "s", value: 60 * 60}});
        }
        return "Success";
    }
}

export { VercelIntegrationsController };