import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ILogProgressRequestPayload, TestInstanceStatusEnum } from "./interface";

@Service()
class BuildTestInstancesService {
	@Inject()
	private dbManager: DBManager;

	async markRunning(instanceId: number) {
		return this.dbManager.update(`UPDATE test_instances SET status = ? WHERE id = ?`, [TestInstanceStatusEnum.RUNNING, instanceId]);
	}

	logProgress(instanceId: number, logRequestPayload: ILogProgressRequestPayload) {
		// Something
	}
}

export { BuildTestInstancesService };
