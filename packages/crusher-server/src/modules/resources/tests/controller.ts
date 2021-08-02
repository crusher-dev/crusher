import { UserService } from "@modules/resources/users/service";
import { JsonController, Get, QueryParams, Authorized, BadRequestError, Post, Param, CurrentUser } from "routing-controllers";
import { Inject, Service } from "typedi";
import { TestService } from "@modules/resources/tests/service";
import { isUsingLocalStorage } from "@utils/helper";
import { IProjectTestsListResponse } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";

@Service()
@JsonController("/teams/:team_id/projects/:project_id/tests")
export class TestController {
	@Inject()
	private userService: UserService;
	@Inject()
	private testService: TestService;

	@Authorized()
	@Get("/")
	@CamelizeResponse()
	async getList(@Param("project_id") projectId: number): Promise<IProjectTestsListResponse> {
		return (await this.testService.getTestsInProject(projectId)).map((testData) => {
			const videoUrl = testData.featured_video_uri ? testData.featured_video_uri : null;

			return {
				id: testData.id,
				testName: testData.name,
				createdAt: new Date(testData.created_at).getTime() / 1000,
				videoUrl: isUsingLocalStorage() && videoUrl ? videoUrl.replace("http://localhost:3001/", "/output/") : videoUrl,
				// @Note: Add support for taking random screenshots in case video is switched off
				imageURL: null,
				// @Note: Hardcoded for now, will be changed later
				isPassing: true,
				// @Note: Hardcoded for now, will be changed later
				firstRunCompleted: true,
				deleted: true,
			};
		});
	}

	@Authorized()
	@Post("/actions/run")
	async runProjectTests(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number) {
		return this.testService.runTestsInProject(projectId, user.user_id);
	}

	@Authorized()
	@Post("/:test_id/actions/delete")
	async deleteTest(@CurrentUser({ required: true }) user, @Param("test_id") testId: number) {
		const deleteResult = await this.testService.deleteTest(testId);
		if (!deleteResult.changedRows) throw new BadRequestError("No such test found with given id");

		return "Success";
	}
}
