import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ICreateEnvironmentPayload, IEnvironmentTable, IUpdateEnvironmentPayload } from "./interface";
import { getInsertOrUpdateQuerySetFromObject, getSnakedObject } from "@utils/helper";
import { BadRequestError } from "routing-controllers";
@Service()
class ProjectEnvironmentService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getEnvironmentsList(projectId: number): Promise<Array<KeysToCamelCase<IEnvironmentTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM environments WHERE project_id = ?", [projectId]);
	}

	async createEnvironment(payload: ICreateEnvironmentPayload) {
		return this.dbManager.insert("INSERT INTO environments SET project_id = ?, name = ?, browser = ?, vars = ?, user_id = ?", [
			payload.projectId,
			payload.name,
			JSON.stringify(payload.browser),
			JSON.stringify(payload.vars),
			payload.userId,
		]);
	}

	@CamelizeResponse()
	async getEnvironment(environmentId: number): Promise<IEnvironmentTable> {
		return this.dbManager.fetchSingleRow("SELECT * FROM environments WHERE id = ?", [environmentId]);
	}

	async deleteEnvironment(environmentId: number) {
		return this.dbManager.delete("DELETE FROM environments WHERE id = ?", [environmentId]);
	}

	private validateUpdatePayload(payload: IUpdateEnvironmentPayload) {
		if (!payload) throw new BadRequestError("Invalid update payload");

		const payloadKeys = Object.keys(payload);
		const validKeys = Object.keys(payload).filter((key) => {
			return ["name", "host", "browser", "vars"].includes(key);
		});

		if (validKeys.length !== payloadKeys.length) throw new BadRequestError("Invalid update payload");
	}

	async updateEnvironment(payload: IUpdateEnvironmentPayload, environmentId: number) {
		this.validateUpdatePayload(payload);
		if (payload.browser) {
			(payload as any).browser = JSON.stringify(payload.browser);
		}

		const [setQuery, setQueryValues] = getInsertOrUpdateQuerySetFromObject(getSnakedObject(payload));

		return this.dbManager.update(`UPDATE environments SET ${setQuery} WHERE id = ?`, [...setQueryValues, environmentId]);
	}
}

export { ProjectEnvironmentService };
