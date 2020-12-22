import { Inject, Service } from "typedi";
import { Authorized, CurrentUser, Get, JsonController, Param } from "routing-controllers";
import TestInstanceService from "../../../core/services/TestInstanceService";
import JobsService from "../../../core/services/JobsService";
import TestInstanceV2Service from "../../../core/services/v2/TestInstanceV2Service";
import CommentsServiceV2 from "../../../core/services/v2/CommentsServiceV2";
import TestInstanceResultsV2 from "../../../core/services/v2/TestInstanceResultsV2";
import { TestLogsService } from "../../../core/services/mongo/testLogs";

@Service()
@JsonController("/v2/test_instance")
export class TestInstanceControllerV2 {
	@Inject()
	private testInstanceService: TestInstanceService;
	@Inject()
	private jobsService: JobsService;
	@Inject()
	private testInstanceV2Service: TestInstanceV2Service;
	@Inject()
	private commentsServiceV2: CommentsServiceV2;
	@Inject()
	private testLogsService: TestLogsService;

	@Authorized()
	@Get("/logs/:instance_id")
	async getJob(@CurrentUser({ required: true }) user, @Param("instance_id") instanceId: number) {
		const instanceLogs = (await this.testLogsService.getLogsOfInstanceInJob(instanceId)).map((log) => {
			return log["_doc"];
		});

		return instanceLogs;
	}
}
