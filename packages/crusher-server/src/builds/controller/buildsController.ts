import UserService from "../../core/services/UserService";
import { JsonController, Get, QueryParams, Authorized, BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import { getFullName } from "../../utils/helper";
import { IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";
import CommentsServiceV2 from "../../core/services/CommentsService";
import { BuildsService } from "crusher-server/src/core/services/BuildsService";
@Service()
@JsonController("/build")
export class BuildsController {
	@Inject()
	private userService: UserService;
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private commentsService: CommentsServiceV2;

	@Authorized()
	@Get("/list")
	public async getList(@QueryParams() params): Promise<IProjectBuildListResponse> {
		const { project_id } = params;
		if (!project_id) throw new BadRequestError();

		const builds = await this.buildsService.getBuildInfoList(project_id);
		return builds.map((buildData) => {
			return {
				id: buildData.buildId,
				// @Note: There is no exact such thing as build name. For now build name
				// is same as commit name if it present otherwise it will be null
				name: buildData.buildName,
				createdAt: new Date(buildData.buildCreatedAt).getTime() / 1000,
				tests: {
					totalCount: buildData.totalTestCount,
					passedCount: buildData.passedTestCount,
					failedCount: buildData.failedTestCount,
					reviewRequiredCount: buildData.reviewRequiredTestCount,
				},
				status: buildData.buildStatus,
				// In seconds
				duration: buildData.buildDuration,
				triggeredBy: {
					id: buildData.triggeredById,
					name: getFullName(buildData.triggeredByFirstName, buildData.triggeredByLastName),
				},
				commentCount: buildData.commentCount ? buildData.commentCount : 0,
			};
		});
	}
}
