import { UsersService } from "@modules/resources/users/service";
import { JsonController, Get, Param } from "routing-controllers";
import { Inject, Service } from "typedi";
import CommentsServiceV2 from "@core/services/CommentsService";
import { BuildsService } from "@modules/resources/builds/service";
import { IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";

@Service()
@JsonController("")
export class BuildsController {
	@Inject()
	private userService: UsersService;
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private commentsService: CommentsServiceV2;

	@Get("/projects/:project_id/builds")
	public async getList(@Param("project_id") project_id): Promise<IProjectBuildListResponse> {
		const builds = await this.buildsService.getBuildInfoList(project_id);

		const buildsList = builds.map((buildData) => {
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
					name: buildData.triggeredByName,
				},
				commentCount: buildData.commentCount ? buildData.commentCount : 0,
			};
		});

		return buildsList;
	}
}
