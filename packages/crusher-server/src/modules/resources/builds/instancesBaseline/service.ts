import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import {
	IBuildInstanceActionResults,
	ICreateBuildTestInstanceResultPayload,
	ILogProgressRequestPayload,
	ITestInstanceResultSetsTable,
	ITestInstanceScreenshotsTable,
	ITestInstancesTable,
	TestInstanceResultSetConclusionEnum,
	TestInstanceResultSetStatusEnum,
	TestInstanceResultStatusEnum,
	TestInstanceStatusEnum,
} from "./interface";
import { IActionResultItemWithIndex, ISavedActionResultItemWithIndex } from "@crusher-shared/types/common/general";
import { VisualDiffService } from "@modules/visualDiff";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { BuildTestInstanceScreenshotService } from "./screenshots.service";
import * as path from "path";
import { IVisualDiffResult } from "@modules/visualDiff/interface";
import { BrowserEnum } from "@modules/runner/interface";
import { ProjectsService } from "@modules/resources/projects/service";
import { StorageManager } from "@modules/storage";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";

// Diff delta percent should be lower than 0.05 to be considered as pass
const DIFF_DELTA_PASS_THRESHOLD = 0.25;
// Diff delta percent above 5% means marking it as failed
const DIFF_DELTA_FAILED_THRESHOLD = 5;

export type IVisualDiffResultWithConclusion = IVisualDiffResult & { status: TestInstanceResultStatusEnum };
@Service()
class BuildTestInstancesService {
	@Inject()
	private dbManager: DBManager;
	@Inject()
	private visualDiffService: VisualDiffService;
	@Inject()
	private projectsService: ProjectsService;

	@Inject()
	private buildTestInstanceScreenshotService: BuildTestInstanceScreenshotService;

	@Inject()
	private storageManager: StorageManager;

	@CamelizeResponse()
	private async getInstanceBaseline(testId: number, host: string, context: string): Promise<KeysToCamelCase<ITestInstanceResultSetsTable> | null> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.test_instance_result_sets WHERE instance_id = ?", [instanceId]);
	}
}

export { BuildTestInstancesService };
