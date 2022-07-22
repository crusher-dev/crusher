import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum IntegrationServiceEnum {
	SLACK = "SLACK",
	VERCEL = "VERCEL",
}

export interface IIntegrationsTable extends BaseRowInterface {
	id: number;
	project_id: number;
	integration_name: IntegrationServiceEnum;
	meta: any;
}

export interface IGitIntegrations extends BaseRowInterface {
	id: number;
	project_id: number;
	repo_id: string;
	repo_name: string;
	repo_link: string;
	installation_id: string;
}

export type ICreateIntegrationPayload = KeysToCamelCase<Omit<IIntegrationsTable, "id">>;
