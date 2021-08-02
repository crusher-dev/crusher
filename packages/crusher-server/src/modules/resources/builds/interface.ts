import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { PLATFORM } from "@crusher-shared/types/platform";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum BuildStatusEnum {
	"CREATED" = "CREATED",
	"QUEUED" = "QUEUED",
	"RUNNING" = "RUNNING",
	"FINISHED" = "FINISHED",
	"TIMEOUT" = "TIMEOUT",
	"ABORTED" = "ABORTED",
}

export enum BuildTriggerEnum {
	"MANUAL" = "MANUAL",
	"CLI" = "CLI",
	"CRON" = "CRON",
}

export interface IBuildConfig {
	browser?: PLATFORM;
	testIds: Array<number>;
}

export interface IBuildTable extends BaseRowInterface {
	id: number;
	latest_report_id?: number;
	pr_id?: string;
	commit_id?: string;
	repo_name?: string;
	branch_name?: string;
	commit_name?: string;
	installation_id?: string;
	status: BuildStatusEnum;
	host: string;
	trigger: BuildTriggerEnum;
	// @TODO: Remove this in the future.
	browser: PLATFORM;
	// @TODO: Should this be JSON. Contains fields l
	meta: string;
	user_id: number;
	project_id: number;
	check_run_id?: string;
	config: IBuildConfig;
}

export type ICreateBuildRequestPayload = KeysToCamelCase<
	Omit<IBuildTable, "id" | "meta" | "latest_report_id" | "config" | "status"> & {
		config?: IBuildConfig;
		status?: BuildStatusEnum;
	}
>;
