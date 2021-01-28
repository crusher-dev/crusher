import { BaseRowInterface } from './baseRow';
import { PLATFORM } from '../platform';

export interface iMonitoringSettings extends BaseRowInterface {
	id?: number;
	target_host: number;
	platform: PLATFORM;
	test_interval: number;
	project_id: number;
	last_cron_run?: any;
	user_id?: number;
}
