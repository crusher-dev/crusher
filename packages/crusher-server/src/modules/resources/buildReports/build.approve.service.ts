import { Inject, Service } from "typedi";
import { BuildsService } from "../builds/service";
import { BadRequestError } from "routing-controllers";
import { ProjectsService } from "../projects/service";
import { BuildReportService } from "./service";

@Service()
export class BuildApproveService {
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private projectsService: ProjectsService;
	@Inject()
	private buildReportsService: BuildReportService;

	async approveBuild(reportId: number) {
		const buildReportRecord = await this.buildReportsService.getBuildReportRecord(reportId);
		if(!buildReportRecord) throw new BadRequestError("Invalid build report id provided");
		const buildRecord =  await this.buildsService.getBuild(buildReportRecord.jobId);

		const buildRecordMeta : { isProjectLevelBuild?: boolean } = JSON.parse(buildRecord.meta);
		// Approve the buildReport
		await this.buildReportsService.approveBuildReport(reportId);

		// For now there is only one build scope -> entire project
		if(buildRecordMeta.isProjectLevelBuild) {
			await this.projectsService.updateBaselineBuild(buildRecord.id, buildRecord.projectId);
		}
		
		return true;
	}
}
