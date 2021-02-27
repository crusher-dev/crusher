import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { CreateProjectHostRequest } from "../interfaces/services/projectHosts/CreateProjectHostRequest";
import { iHostListResponse } from "../../../../crusher-shared/types/response/hostListResponse";

@Service()
export default class ProjectHostsService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createHost(host: CreateProjectHostRequest) {
		const { name, url, projectId, userId } = host;
		return this.dbManager.insertData(`INSERT INTO project_hosts SET ?`, {
			host_name: name,
			url: url,
			project_id: projectId,
			user_id: userId,
		});
	}

	async getHost(hostId: number) {
		return this.dbManager.fetchSingleRow(`SELECT id, host_name, url FROM project_hosts WHERE id = ?`, [hostId]);
	}

	async getAllHosts(projectId: number): Promise<Array<iHostListResponse>> {
		return this.dbManager.fetchData(`SELECT * FROM project_hosts WHERE project_id = ?`, [projectId]);
	}

	async deleteHost(hostId: number) {
		return this.dbManager.fetchSingleRow(`DELETE FROM project_hosts WHERE id=?`, [hostId]);
	}
}
