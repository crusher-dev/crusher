import { iAction } from "@crusher-shared/types/action";
import { Authorized, Body, JsonController, Param, Post } from "routing-controllers";
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
}

export { BuildTestInstancesController };
