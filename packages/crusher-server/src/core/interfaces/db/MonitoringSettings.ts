import { Platform } from '../Platform';
import { BaseRowInterface } from './BaseRowInterface';

export interface MonitoringSettings extends BaseRowInterface {
	id?: number;
	target_host: number;
	platform: Platform;
	test_interval: number;
	project_id: number;
	last_cron_run?: any;
	user_id?: number;
}
