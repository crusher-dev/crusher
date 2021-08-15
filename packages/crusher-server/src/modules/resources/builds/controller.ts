import { UsersService } from "@modules/resources/users/service";
import { JsonController, Get, Param, QueryParams } from "routing-controllers";
import { Inject, Service } from "typedi";
import CommentsServiceV2 from "@core/services/CommentsService";
import { BuildsService } from "@modules/resources/builds/service";
import { IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { BuildTriggerEnum } from "./interface";
import { BuildReportStatusEnum } from "../buildReports/interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { IUserTable } from "../users/interface";

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
	public async getBuildsList(
		@Param("project_id") projectId: number,
		@QueryParams() params: { trigger?: BuildTriggerEnum; triggeredBy?: number; searchQuery?: string; page?: number; status?: BuildReportStatusEnum },
	): Promise<IProjectBuildListResponse & { availableAuthors: Array<Pick<KeysToCamelCase<IUserTable>, "name" | "email" | "id">> }> {
		if (!params.page) params.page = 0;

		const buildsData = await this.buildsService.getBuildInfoList(projectId, params);

		const buildsList = buildsData.list.map((buildData) => {
			return {
				id: buildData.buildId,
				// @Note: There is no exact such thing as build name. For now build name
				// is same as commit name if it present otherwise it will be null
				name: buildData.buildName,
				trigger: buildData.buildTrigger,
				createdAt: new Date(buildData.buildCreatedAt).getTime(),
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

		const availableAuthors = (await this.userService.getUsersInProject(projectId)).map((user) => {
			return { name: user.name, email: user.email, id: user.id };
		});

		return {
			list: buildsList,
			totalPages: buildsData.totalPages,
			availableAuthors: availableAuthors,
		};
	}
}
