import UserService from "../core/services/UserService";
import { JsonController, Get, Authorized, Param } from "routing-controllers";
import { Inject, Service } from "typedi";
import CommentsServiceV2 from "../core/services/CommentsService";
import { BuildReportService } from "./service";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";

@Service()
@JsonController("/teams/:team_id/projects/:project_id/builds/:build_id/reports")
class BuildReportController {
	@Inject()
	private userService: UserService;
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private commentsService: CommentsServiceV2;

	@Authorized()
	@Get("/:report_id")
	public async getReport(@Param("team_id") teamId, @Param("project_id") projectId, @Param("build_id") buildId: number, @Param("report_id") reportId: number): Promise<IBuildReportResponse> {
		// @TODO: Use report_id here instead of build_id

		return this.buildReportService.getBuildReport(buildId);
	}
}

export { BuildReportController };