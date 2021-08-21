import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { BrowserEnum } from "@modules/runner/interface";

export interface IProjectMonitoringTable extends BaseRowInterface {
	project_id: number;
	created_by: number;
	last_cron_on: number;
	target_host_id: number;
	platform: BrowserEnum;
	test_interval: number;
	tags: string;
	id: number;
}
