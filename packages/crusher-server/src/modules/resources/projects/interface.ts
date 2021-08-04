import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase, KeysToSnakeCase, SnakeToCamelCase } from "@modules/common/typescript/interface";

interface IProjectTable extends BaseRowInterface {
	id: number;
	name: string;
	team_id: number;
	meta?: string;
}

// Create Project Payload, everything except id
type ICreateProjectPayload = KeysToCamelCase<Omit<IProjectTable, "id">>;

interface IProjectEnvironmentTable extends BaseRowInterface {
	id: number;
	url: string;
	host_name: string;
	project_id: number;
	user_id: number;
}

type ICreateProjectEnvironmentPayload = KeysToCamelCase<Omit<IProjectEnvironmentTable, "id">>;

export { ICreateProjectPayload, IProjectTable, IProjectRow, IProjectEnvironmentTable, ICreateProjectEnvironmentPayload };
