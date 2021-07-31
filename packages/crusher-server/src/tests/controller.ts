import UserService from "../core/services/UserService";
import { JsonController, Get, QueryParams, Authorized, BadRequestError } from "routing-controllers";
import { Inject, Service } from "typedi";
import TestService from "../core/services/TestService";
import { isUsingLocalStorage } from "../utils/helper";

@Service()
@JsonController("/tests")
export class TestController {
	@Inject()
	private userService: UserService;
	@Inject()
	private testService: TestService;

	@Authorized()
	@Get("/list")
	public async getList(@QueryParams() params): Promise<any> {
		const { project_id } = params;
		if (!project_id) throw new BadRequestError();

		return (await this.testService.getAllTestsInProject(project_id)).map((testData) => {
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
			};
		});
	}
}
