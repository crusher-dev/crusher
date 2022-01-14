import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Inject, Service } from "typedi";
import { IGitIntegrations } from "./interface";

@Service()
export class GithubIntegrationService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async linkRepo(repoId: number, repoName: string, installationId: string, repoLink: string, projectId: number, userId: number) {
		return this.dbManager.insert(
			"INSERT INTO git_integrations (repo_id, repo_name, repo_link, installation_id, project_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
			[repoId, repoName, repoLink, installationId, projectId, userId],
		);
	}

	@CamelizeResponse()
	async getInstallationRepo(repoName: string, projectId: number): Promise<KeysToCamelCase<IGitIntegrations & { _id: string }> | null> {
		const gitIntegrationRecord = await this.dbManager.fetchSingleRow("SELECT * FROM git_integrations WHERE repo_name = ? AND project_id = ?", [
			repoName,
			projectId,
		]);
		return { ...gitIntegrationRecord, _id: gitIntegrationRecord.id };
	}

	@CamelizeResponse()
	getLinkedRepo(projectId: number): Promise<KeysToCamelCase<IGitIntegrations & { _id: string }> | undefined> {
		return new Promise(async (resolve, reject) => {
			const gitIntegrationRecord = await this.dbManager.fetchSingleRow(
				"SELECT * FROM git_integrations WHERE project_id = ? ORDER BY created_at DESC LIMIT 1",
				[projectId],
			);
			if (!gitIntegrationRecord) return resolve(undefined);

			return resolve({
				...gitIntegrationRecord,
				_id: gitIntegrationRecord.id,
			});
		});
	}

	unlinkRepo(integrationId: string) {
		return this.dbManager.delete("DELETE FROM git_integrations WHERE id = ?", [integrationId]);
	}
}
