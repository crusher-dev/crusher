import { Inject, Service } from "typedi";
import { iTest } from "@crusher-shared/types/db/test";
import { TestType } from "@core/interfaces/TestType";
import { addJobToRequestQueue } from "@utils/queue";
import { BuildsService } from "@modules/resources/builds/service";
import { ICreateBuildRequestPayload } from "@modules/resources/builds/interface";

@Service()
class TestsRunner {
	@Inject()
	private buildsService: BuildsService;

	async runTests(tests: Array<iTest>, buildPayload: ICreateBuildRequestPayload) {
		const testIds = tests.map((test) => test.id);
		buildPayload.config = {
			...buildPayload.config,
			testIds: testIds,
		};

		const job = await this.buildsService.createBuild(buildPayload);

		const jobInfo = {
			...buildPayload,
			tests: tests,
			jobId: job.insertId,
			testType: TestType.SAVED,
		};

		// @TODO: Add implementation to queue the job
		// await addJobToRequestQueue(jobInfo);

		return { jobId: job.insertId, jobInfo: jobInfo };
	}
}

export { TestsRunner };
