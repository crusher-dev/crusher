import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum IntegrationServiceEnum {
	SLACK = "SLACK",
}

export interface IUserIntegrationsTable extends BaseRowInterface {
	id: number;
	user_id: number;
	integration_name: IntegrationServiceEnum;
	label?: string;
	access_token?: string;
	webhook_url?: string;
	meta: string;
}

export type ICreateUserIntegrationPayload = KeysToCamelCase<Omit<IUserIntegrationsTable, "id">>;
