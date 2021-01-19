import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { MonitoringSettings } from "../interfaces/db/MonitoringSettings";
import { iMonitoringListResponse } from '@crusher-shared/types/response/monitoringListResponse';

@Service()
export default class MonitoringService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async saveSettingsForProject(settings: MonitoringSettings, projectId: number) {
		const monitoringSettings = await this.getSettingsForProject(projectId);
		if (!monitoringSettings) {
			await this.dbManager.insertData(`INSERT INTO monitoring_settings SET ?`, settings);
		}
		return this.dbManager.fetchSingleRow(`UPDATE monitoring_settings SET ? WHERE project_id = ?`, [settings, projectId]);
	}

	async addMonitoringForProject(settings: MonitoringSettings, projectId: number) {
		return  this.dbManager.insertData(`INSERT INTO monitoring_settings SET ?`, settings);

	}

	async getMonitoringListForProject(projectId: number): Promise<Array<iMonitoringListResponse>> {
		return this.dbManager.fetchData("SELECT *, project_hosts.host_name target_host_name FROM monitoring_settings, project_hosts WHERE monitoring_settings.project_id = ? AND project_hosts.id = monitoring_settings.target_host", [projectId]);
	}

	async getSettingsForProject(projectId: number): Promise<MonitoringSettings> {
		return this.dbManager.fetchSingleRow("SELECT *, project_hosts.host_name target_host_name FROM monitoring_settings, project_hosts WHERE monitoring_settings.project_id = ? AND project_hosts.id = monitoring_settings.target_host", [projectId]);
	}

	async getProjectsForCronNow(): Promise<Array<MonitoringSettings>> {
		return this.dbManager.fetchData(`SELECT * FROM monitoring_settings WHERE UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(last_cron_run) > test_interval`);
	}

	async updateLastCronRunForProject(projectId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE monitoring_settings SET last_cron_run = NOW() WHERE project_id=?`, [projectId]);
	}
}
