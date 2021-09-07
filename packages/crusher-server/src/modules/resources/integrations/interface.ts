import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum IntegrationServiceEnum {
	SLACK = "SLACK",
}

export interface IIntegrationsTable extends BaseRowInterface {
	id: number;
	project_id: number;
	integration_name: IntegrationServiceEnum;
	meta: any;
}

export type ICreateIntegrationPayload = KeysToCamelCase<Omit<IIntegrationsTable, "id">>;
