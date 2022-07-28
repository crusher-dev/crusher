import { Inject, Service } from "typedi";
import { BuildsService } from "../builds/service";
import { BadRequestError } from "routing-controllers";
import { ProjectsService } from "../projects/service";
import { BuildReportService } from "./service";
import { GithubService } from "@modules/thirdParty/github/service";
import { GithubCheckConclusionEnum } from "@modules/thirdParty/github/interface";

@Service()
export class BuildApproveService {
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private projectsService: ProjectsService;
	@Inject()
	private buildReportsService: BuildReportService;

	private githubService: GithubService;

	constructor() {
		this.githubService = new GithubService();
	}

	async approveBuild(reportId: number) {
		const buildReportRecord = await this.buildReportsService.getBuildReportRecord(reportId);
		if (!buildReportRecord) throw new BadRequestError("Invalid build report id provided");
		const buildRecord = await this.buildsService.getBuild(buildReportRecord.jobId);

		const buildRecordMeta: { isProjectLevelBuild?: boolean } = JSON.parse(buildRecord.meta);
		// Approve the buildReport
		await this.buildReportsService.approveBuildReport(reportId);

		// For now there is only one build scope -> entire project
		if (buildRecordMeta.isProjectLevelBuild) {
			await this.projectsService.updateBaselineBuild(buildRecord.id, buildRecord.projectId);
		}

		if (buildRecord.checkRunId) {
			const { repoName, ownerName } = this.githubService.extractRepoAndOwnerName(buildRecord.repoName);

			await this.githubService.updateRunCheckStatus(
				{ repo: buildRecord.repoName, owner: ownerName, checkRunId: buildRecord.checkRunId },
				GithubCheckConclusionEnum.SUCCESS,
				await this.buildsService.getFrontendBuildReportUrl(buildRecord.id),
			);
		}
		return true;
	}
}
