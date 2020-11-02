import { Service, Container } from 'typedi';
import DBManager from '../manager/DBManager';
import { MonitoringSettings } from '../interfaces/db/MonitoringSettings';

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
		return this.dbManager.fetchSingleRow(`UPDATE monitoring_settings SET ? WHERE project_id = ?`, [
			settings,
			projectId,
		]);
	}

	async getSettingsForProject(projectId: number): Promise<MonitoringSettings> {
		return this.dbManager.fetchSingleRow('SELECT * FROM monitoring_settings WHERE project_id = ?', [projectId]);
	}

	async getProjectsForCronNow(): Promise<Array<MonitoringSettings>> {
		return this.dbManager.fetchData(
			`SELECT * FROM monitoring_settings WHERE UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(last_cron_run) > test_interval`,
		);
	}

	async updateLastCronRunForProject(projectId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE monitoring_settings SET last_cron_run = NOW() WHERE project_id=?`, [
			projectId,
		]);
	}
}
