import { iAction } from "@crusher-shared/types/action";
import { TestService } from "@modules/resources/tests/service";
import { Authorized, BadRequestError, Body, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BuildsService } from "../service";
import { ILogProgressRequestPayload } from "./interface";
import { BuildTestInstancesService } from "./service";

// @TODO: Setup super authorization here. These APIs should not be available
// to public
@Service()
@JsonController("")
class BuildTestInstancesController {
	@Inject()
	private buildTestInstancesService: BuildTestInstancesService;
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private testService: TestService;

	@Post("/builds/:build_id/instances/:instance_id/actions/mark.running")
	async handleTestRunning(@Param("instance_id") instanceId: number, @Body() body: { githubCheckRunId?: string | null }) {
		await this.buildTestInstancesService.markRunning(instanceId);
		return "Successful";
	}

	@Post("/builds/:build_id/instances/:instance_id/actions/log.finished")
	async handleTestFinished(@Param("instance_id") instanceId: number, @Body() body: { githubCheckRunId?: string | null; hasFailed: boolean }) {
		return "Successful";
	}

	@Post("/builds/:build_id/instances/:instance_id/actions/log")
	async logProgressOfTest(@Param("instance_id") instanceId: number, @Body() body: ILogProgressRequestPayload): Promise<string> {
		await this.buildTestInstancesService.logProgress(instanceId, body);
		return "Successful";
	}

	@Post("/builds/:build_id/instances/:instance_id/action.addRecordedVideo")
	async addRecordedVideo(@Body() body: { recordedVideoUrl: string }, @Param("build_id") buildId: number, @Param("instance_id") instanceId: number) {
		const { recordedVideoUrl } = body;
		if (!recordedVideoUrl) throw new BadRequestError("No video url provided");

		const buildInstanceRecord = await this.buildTestInstancesService.getInstance(instanceId);
		const buildRecord = await this.buildsService.getBuild(buildId);
		await this.buildTestInstancesService.addRecordedVideo(recordedVideoUrl, instanceId);

		if (buildRecord.isDraftJob) {
			// Only set featured video for draft job
			await this.testService.addFeaturedVideo(recordedVideoUrl, buildInstanceRecord.testId);
		}
		return "Succesful";
	}
}

export { BuildTestInstancesController };
