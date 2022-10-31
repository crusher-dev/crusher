import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { EmailManager } from "@modules/email";
import { IBuildReportTable, BuildReportStatusEnum } from "@modules/resources/buildReports/interface";
import { IBuildTable } from "@modules/resources/builds/interface";
import { BuildsService } from "@modules/resources/builds/service";
import { IntegrationsService } from "@modules/resources/integrations/service";
import { VercelService } from "@modules/resources/integrations/vercel/service";
import { ProjectsService } from "@modules/resources/projects/service";
import { UsersService } from "@modules/resources/users/service";
import { getTemplateFileContent } from "@utils/helper";
import { resolvePathToFrontendURI } from "@utils/uri";
import { Inject, Service } from "typedi";
import { WebhookManager } from "../webhook";

@Service()
class RunnerIntegrationsService {
    @Inject()
    private usersService: UsersService;
    @Inject()
    private projectsService: ProjectsService;
    @Inject()
    private buildService: BuildsService;
    @Inject()
    private integrationsService: IntegrationsService;
    @Inject()
    private vercelService: VercelService;
    @Inject()
    private emailManager: EmailManager;

    async handleIntegrations(
        buildRecord: KeysToCamelCase<IBuildTable>,
        buildReportRecord: KeysToCamelCase<IBuildReportTable>,
        reportStatus: BuildReportStatusEnum,
    ) {
        const userInfo = await this.usersService.getUserInfo(buildRecord.userId);
        const projectRecord = await this.projectsService.getProject(buildRecord.projectId);
        const webhookUrl  = await this.projectsService.getProjectWebhook(buildRecord.projectId);
        // Github Integration
        await this.buildService.markGithubCheckFlowFinished(reportStatus, buildRecord.id);
        // Slack Integration
        await this.integrationsService.postSlackMessageIfNeeded(
            buildRecord.projectId,
            await this.integrationsService.getSlackMessageBlockForBuildReport(buildRecord, projectRecord, buildReportRecord, userInfo, reportStatus),
            reportStatus === BuildReportStatusEnum.PASSED ? "normal" : "alert",
        );

        if(webhookUrl) {
            await WebhookManager.send(webhookUrl, {
                reportStatus: reportStatus,
                buildId: buildRecord.id,
                host: buildRecord.host,
                triggeredBy: userInfo.name,
                totalTests: buildReportRecord.totalTestCount,
                buildReportUrl: resolvePathToFrontendURI(`/app/build/${buildRecord.id}`),
                projectName: projectRecord.name
            });
        }
        
        const buildRecordMeta: { vercel: { checkId: string; deploymentId: string; teamId: string;}, github: { repoName: string; commitId: string;}} = buildRecord.meta ? JSON.parse(buildRecord.meta) : null;
        if(buildRecordMeta && buildRecordMeta.vercel && buildRecordMeta.github) {
            const repoName = buildRecordMeta.github.repoName;
            const {vercelIntegrationRecord} = await this.vercelService.getIntegrationRecordFromRepoName(repoName);
            if(!vercelIntegrationRecord) {
                console.error("Could not find vercel integration record for repo: ", repoName);
                return;
            }
    
            const vercelIntegrationMeta : {accessToken: string; userId: number;} = vercelIntegrationRecord.meta;
            const detailsUrl = `${resolvePathToFrontendURI(`/app/build/${buildRecord.id}`)}`;
    
            await this.vercelService.finishDeploymentChecks(
                vercelIntegrationMeta.accessToken,
                buildRecordMeta.vercel.deploymentId,
                buildRecordMeta.vercel.checkId,
                buildRecordMeta.vercel.teamId,
                this.vercelService.getVercelConclusionFromBuildReportStatus(reportStatus),
                detailsUrl
            );
        };
    }


    async sendReportStatusEmails(buildRecord: KeysToCamelCase<IBuildTable>, buildReportStatus: BuildReportStatusEnum): Promise<Array<Promise<boolean>>> {
        if (buildReportStatus === BuildReportStatusEnum.PASSED) return;
    
        const usersInProject = await this.usersService.getUsersInProject(buildRecord.projectId);
        const emailTemplateFilePathMap = {
            [BuildReportStatusEnum.PASSED]:
            //@ts-ignore
                typeof __non_webpack_require__ !== "undefined" ? "/email/templates/passedJob.ejs" : "/../../email/templates/passedJob.ejs",
            [BuildReportStatusEnum.MANUAL_REVIEW_REQUIRED]:
            //@ts-ignore
                typeof __non_webpack_require__ !== "undefined"
                    ? "/email/templates/manualReviewRequiredJob.ejs"
                    : "/../../email/templates/manualReviewRequiredJob.ejs",
            [BuildReportStatusEnum.FAILED]:
            //@ts-ignore
                typeof __non_webpack_require__ !== "undefined" ? "/email/templates/failedJob.ejs" : "/../../email/templates/failedJob.ejs",
        };
        
        const emailTemplate = await getTemplateFileContent(__dirname + emailTemplateFilePathMap[buildReportStatus], {
            buildId: buildRecord.id,
            branchName: buildRecord.branchName,
            buildReviewUrl: resolvePathToFrontendURI(`/app/build/${buildRecord.id}`),
        });
    
        return usersInProject.map((user) => {
            return this.emailManager.sendEmail(user.email, `Build ${buildRecord.id} ${buildReportStatus}`, emailTemplate);
        });
    }
    
}

export { RunnerIntegrationsService };  