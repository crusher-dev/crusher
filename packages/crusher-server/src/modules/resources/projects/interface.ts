import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
export interface IProjectTable extends BaseRowInterface {
	id: number;
	name: string;
	team_id: number;
	meta?: string;
	baseline_job_id: number;
}

// Create Project Payload, everything except id
export type ICreateProjectPayload = KeysToCamelCase<Omit<IProjectTable, "id" | "baseline_job_id">>;

export interface IProjectEnvironmentTable extends BaseRowInterface {
	id: number;
	url: string;
	host_name: string;
	project_id: number;
	user_id: number;
}

export type ICreateProjectEnvironmentPayload = KeysToCamelCase<Omit<IProjectEnvironmentTable, "id">>;
