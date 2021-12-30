import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BrowserEnum } from "@modules/runner/interface";

export interface IMonitoringTable extends BaseRowInterface {
	id: number;
	project_id: number;
	environment_id: number;
	test_interval: number;
	last_cron_run: any;
}

export type ICreateMonitoringPayload = KeysToCamelCase<Omit<IMonitoringTable, "created_at" | "updated_at" | "id" | "last_cron_run">>;
export type IUpdateMonitoringPayload = Omit<ICreateMonitoringPayload, "projectId">;

export type IQueuedMonitoringsDetails = Array<{
	id: number;
	projectId: number;
	environmentId: number;
	testInterval: number;
	lastCronRun: number;
	environmentName: string;
	environmentBrowser: Array<BrowserEnum>;
	environmentVars: string;
	host: string | null;
}>;
