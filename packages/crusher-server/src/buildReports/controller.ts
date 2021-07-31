import UserService from "../core/services/UserService";
import { JsonController, Get, Authorized, Param, QueryParams, BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import CommentsServiceV2 from "../core/services/CommentsService";
import { BuildReportService } from "./service";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";

@Service()
@JsonController("/build/reports")
class BuildReportController {
	@Inject()
	private userService: UserService;
	@Inject()
	private buildReportService: BuildReportService;
	@Inject()
	private commentsService: CommentsServiceV2;

	@Authorized()
	@Get("/")
	public async getList(@QueryParams() params): Promise<IBuildReportResponse> {
		const { build_id } = params;
		if (!build_id) throw new BadRequestError("No build_id found in payload");

		return this.buildReportService.getBuildReport(build_id);
	}
}

export { BuildReportController };