import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export interface IProjectAlertingTable extends BaseRowInterface {
	id: number;
	project_id: number;
	integration_id: number;
	user_id: number;
	config?: string;
}

export type ICreateProjectAlertingPayload = KeysToCamelCase<Omit<IProjectAlertingTable, "id" | "config">> & { config: any };
