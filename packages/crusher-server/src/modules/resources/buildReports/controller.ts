import { UserService } from "@modules/resources/users/service";
import { Authorized, Get, JsonController, Param } from "routing-controllers";
import { Inject, Service } from "typedi";
import CommentsServiceV2 from "@core/services/CommentsService";
import { BuildReportService } from "@modules/resources/buildReports/service";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";
import { BuildsService } from "@modules/resources/builds/service";

@Service()
@JsonController("")
class BuildReportController {
	@Inject()
	private userService: UserService;
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private commentsService: CommentsServiceV2;
	@Inject()
	private buildsService: BuildsService;

	@Authorized()
	@Get("/builds/:build_id/reports/:report_id")
	public async getReport(@Param("build_id") buildId: number, @Param("report_id") reportId: number): Promise<IBuildReportResponse> {
		// @TODO: Use report_id here instead of build_id
		return this.buildReportService.getBuildReport(buildId);
	}

	@Authorized()
	@Get("/builds/:build_id/reports")
	public async getReports(@Param("build_id") buildId: number): Promise<IBuildReportResponse> {
		// @TODO: Use report_id here instead of build_id

		return this.buildReportService.getBuildReport(buildId);
	}
}

export { BuildReportController };
