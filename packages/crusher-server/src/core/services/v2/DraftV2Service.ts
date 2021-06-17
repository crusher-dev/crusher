import { Service, Container } from "typedi";
import DBManager from "../../manager/DBManager";
import DraftInstanceService from "../DraftInstanceService";
import DraftInstanceResultsService from "../DraftInstanceResultsService";
import TestInstanceRecordingService from "../TestInstanceRecordingService";
import { InstanceStatus } from "../../interfaces/InstanceStatus";
import { TestLiveStepsLogs } from "../../../server/models/testLiveStepsLogs";
import { TestType } from "../../interfaces/TestType";
import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";

@Service()
export default class DraftV2Service {
	private dbManager: DBManager;
	private draftInstanceService: DraftInstanceService;
	private draftInstanceResultsService: DraftInstanceResultsService;
	private testInstanceRecordingService: TestInstanceRecordingService;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.draftInstanceService = Container.get(DraftInstanceService);
		this.testInstanceRecordingService = Container.get(TestInstanceRecordingService);
		this.draftInstanceResultsService = Container.get(DraftInstanceResultsService);
	}

	async getDraftInstanceStatus(instanceId: number) {
		const instance = await this.draftInstanceService.getDraftInstance(instanceId);
		const result = await this.draftInstanceResultsService.getDraftResult(instanceId);

		const testInstanceRecording = await this.testInstanceRecordingService.getTestRecording(instanceId);

		return {
			status: result ? instance.status : InstanceStatus.RUNNING,
			result,
			testInstanceRecording,
		};
	}

	getDraftLogs(draftId: number, logsAfter = 0): Promise<Array<iLiveStepLogs>> {
		return new Promise((resolve, reject) => {
			TestLiveStepsLogs.find(
				{
					testId: draftId,
					testType: TestType.DRAFT,
					createdAt: { $gt: new Date(logsAfter) },
				},
				function (err, logsArray) {
					if (err) reject(err);
					const logs = logsArray.map((log: any) => {
						return log.toObject();
					});

					if (logs && logs.length) {
						resolve(logs as Array<iLiveStepLogs>);
					} else {
						reject("No logs found");
					}
				},
			);
		});
	}
}
