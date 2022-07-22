import { TestService } from "@modules/resources/tests/service";
import { UsersService } from "@modules/resources/users/service";
import { BrowserEnum } from "@modules/runner/interface";
import { SlackService } from "@modules/slack/service";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams, Res } from "routing-controllers";
import { Service, Inject } from "typedi";
import { GithubIntegrationService } from "../githubIntegration.service";
import { DeploymentReadyEvent } from "./interface";
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

    @Authorized()
    @Get("/integrations/vercel/actions/link")
    async linkVercelIntegration(@CurrentUser({ required: true }) user, @QueryParams() params: {next: string; code: string;}, @Res() res) {
        const { user_id: userId } = user;
        const userInfo = await this.userService.getUserInfo(userId);
        const userInfoMeta = JSON.parse(userInfo.meta);

        const selectedProjectId = userInfoMeta["appState.SELECTED_PROJECT_ID"];

        const {next, code} = params;
        const accessToken = await this.vercelService.getAccessToken(code);

        return this.vercelService.linkVercelIntegration({userId, projectId: selectedProjectId, accessToken});
    }

    @Post("/integrations/vercel/webhook")
    async handleVercelWebhook(@Body() body : DeploymentReadyEvent, @Res() res) {
        if(body.type === "deployment-ready") {
            console.log("Recieving webhook from vercel");
            const { githubOrg, githubRepo, githubCommitSha, githubCommitMessage } = body.payload.deployment.meta;
            const { url: deploymentUrl } = body.payload.deployment;

            const repoName = `${githubOrg}/${githubRepo}`;
            const verelIntegrationRecord = await this.vercelService.getIntegrationRecordFromRepoName(repoName);
            const vercelIntegrationMeta: {accessToken: string; userId: number;} = JSON.parse(verelIntegrationRecord.meta);
            const meta = {
                disableBaseLineComparisions: false,
                github: {
                    repoName: repoName,
                    commitId: githubCommitSha,
                }
            };

            return this.testService.runTestsInProject(
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
        }
    }
}

export { VercelIntegrationsController };