import { Inject, Service } from "typedi";
import { BuildsService } from "@modules/resources/builds/service";
import { ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { IBuildTaskPayload } from "./interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ITestTable } from "@modules/resources/tests/interface";
import { PLATFORM } from "@crusher-shared/types/platform";

@Service()
class TestsRunner {
	@Inject()
	private buildsService: BuildsService;

	private async addTestRequestToQueue(...args) {}

	private async startBuildTask(buildTaskInfo: IBuildTaskPayload) {
		const { tests } = buildTaskInfo;

		for (const test of tests) {
			switch (buildTaskInfo.browser) {
				case PLATFORM.ALL: {
					const testsQueueRequestPromises = [PLATFORM.CHROME, PLATFORM.FIREFOX, PLATFORM.SAFARI].map((platform) => {
						return this.addTestRequestToQueue();
					});
					await Promise.all(testsQueueRequestPromises);
					break;
				}
				case PLATFORM.CHROME:
				case PLATFORM.FIREFOX:
				case PLATFORM.SAFARI:
					await this.addTestRequestToQueue();
					break;
				default:
					throw new Error("Browser not available");
			}
		}
	}

	async runTests(tests: Array<KeysToCamelCase<ITestTable>>, buildPayload: ICreateBuildRequestPayload) {
		const testIds = tests.map((test) => test.id);
		buildPayload.config = {
			...buildPayload.config,
			testIds: testIds,
		};

		const build = await this.buildsService.createBuild(buildPayload);

		const buildInfo = {
			...buildPayload,
			tests: tests,
			isInitialTest: false,
			isVideoOn: true,
			buildId: build.insertId,
		};

		// @TODO: Add implementation to queue the job
		await this.startBuildTask(buildInfo);

		return { buildId: build.insertId, buildInfo: buildInfo };
	}
}

export { TestsRunner };
