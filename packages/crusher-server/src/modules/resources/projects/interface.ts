import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase, KeysToSnakeCase, SnakeToCamelCase } from "@modules/common/typescript/interface";

interface IProjectTable extends BaseRowInterface {
	id: number;
	name: string;
	team_id: number;
}

// Create Project Payload, everything except id
type ICreateProjectPayload = KeysToCamelCase<Exclude<IProjectTable, "id">>;

export { ICreateProjectPayload, IProjectTable, IProjectRow };
