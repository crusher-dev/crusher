import { RedisManager } from "@modules/redis";
import { TestService } from "@modules/resources/tests/service";
import { UsersService } from "@modules/resources/users/service";
import { BrowserEnum } from "@modules/runner/interface";
import { SlackService } from "@modules/slack/service";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/uri";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Res } from "routing-controllers";
import { Service, Inject } from "typedi";
import { GithubIntegrationService } from "../githubIntegration.service";
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
    private redisManager: RedisManager;

    @Get("/integrations/vercel/actions/link")
    async linkVercelIntegration(@QueryParams() params: {next: string; code: string;}, @Res() res) {
        const userId: any = "1104";
        const userInfo = await this.userService.getUserInfo(userId);
        const userInfoMeta = JSON.parse(userInfo.meta);
        console.log("User info meta", userInfoMeta);
        const selectedProjectId = userInfoMeta["appState.SELECTED_PROJECT_ID"];

        const {next, code} = params;
        const accessToken = await this.vercelService.getAccessToken(code);

        await this.vercelService.linkVercelIntegration({userId, projectId: selectedProjectId, accessToken});
        return res.redirect(next);
    }

    @Post("/integrations/vercel/webhook")
    async handleVercelWebhook(@Body() body : DeploymentReadyEvent | DeploymentPreparedEvent | DeploymentCreatedEvent, @Res() res) {
        if(body.type === "deployment-prepared") {
            console.log("Recieving webhook from vercel");
            const check = await this.redisManager.get(body.payload.deploymentId);
            if(!check) throw new Error("Deployment not found");

            const { githubOrg, githubRepo, githubCommitSha, githubCommitMessage } = body.payload.deployment.meta;
            const { url: deploymentUrl } = body.payload.deployment;

            const repoName = `${githubOrg}/${githubRepo}`;
            const verelIntegrationRecord = await this.vercelService.getIntegrationRecordFromRepoName(repoName);
            const vercelIntegrationMeta: {accessToken: string; userId: number;} = verelIntegrationRecord.meta;
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
                }
            };

            console.log("Triggering test now for project: " + repoName);
            // await this.vercelService.createDeploymentStatus(vercelIntegrationMeta.accessToken, body.payload.deploymentId, body.teamId, "");
            const build = await this.testService.runTestsInProject(
                verelIntegrationRecord.projectId,
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

            await this.vercelService.updateDeploymentStatus(vercelIntegrationMeta.accessToken, body.payload.deploymentId, check, body.teamId, "running", resolvePathToFrontendURI("/app/build/" + build.buildId));
        } else if (body.type === "deployment") {
            console.log("Deployment created, webhook called");
            const { githubOrg, githubRepo, githubCommitSha, githubCommitMessage } = body.payload.deployment.meta;
            const { url: deploymentUrl } = body.payload.deployment;

            const repoName = `${githubOrg}/${githubRepo}`;
            const verelIntegrationRecord = await this.vercelService.getIntegrationRecordFromRepoName(repoName);
            const vercelIntegrationMeta: {accessToken: string; userId: number;} = verelIntegrationRecord.meta;

            console.log("Creating check now: " + repoName);
            const checkIdResponse = await this.vercelService.createDeploymentStatus(vercelIntegrationMeta.accessToken, body.payload.deploymentId, body.teamId, "");
            console.log("Check id: " + checkIdResponse.id);

            await this.redisManager.set(body.payload.deploymentId, checkIdResponse.id, {expiry: { type: "s", value: 60 * 60}});
        }
        return "Success";
    }
}

export { VercelIntegrationsController };