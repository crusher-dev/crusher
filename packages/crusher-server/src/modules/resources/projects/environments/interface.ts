import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BrowserEnum } from "@modules/runner/interface";

export interface IEnvironmentTable extends BaseRowInterface {
	id: number;
	project_id: number;
	name: string;
	browser: Array<BrowserEnum>;
	user_id: number;
	vars: string;
	host?: string;
}

export type ICreateEnvironmentPayload = KeysToCamelCase<Omit<IEnvironmentTable, "id" | "updated_at" | "created_at">> & {
	vars: any;
};
export type IUpdateEnvironmentPayload = Partial<Omit<ICreateEnvironmentPayload, "userId" | "projectId">>;
