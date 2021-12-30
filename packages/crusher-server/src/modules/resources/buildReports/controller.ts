import { Authorized, Get, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BuildReportService } from "@modules/resources/buildReports/service";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";
import { BuildApproveService } from "./build.approve.service";

@Service()
@JsonController("")
class BuildReportController {
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private buildApproveService: BuildApproveService;

	@Authorized()
	@Get("/builds/:build_id/reports/:report_id")
	public async getReport(@Param("build_id") buildId: number): Promise<IBuildReportResponse> {
		// @TODO: Use report_id here instead of build_id
		return this.buildReportService.getBuildReport(buildId);
	}

	@Authorized()
	@Post("/builds/:build_id/reports/:report_id/actions/approve")
	async approveBuild(@Param("build_id") buildId: number, @Param("report_id") buildReportId: number): Promise<string> {
		// @TODO: Need to keep a track of who markes the job as passed
		await this.buildApproveService.approveBuild(buildReportId);
		return "Successful";
	}

	@Authorized()
	@Get("/builds/:build_id/report")
	public async getReports(@Param("build_id") buildId: number): Promise<IBuildReportResponse> {
		// @TODO: Use report_id here instead of build_id

		return this.buildReportService.getBuildReport(buildId);
	}
}

export { BuildReportController };
