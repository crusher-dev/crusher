import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export interface ICodeTemplateTable extends BaseRowInterface {
	id: number;
	code: string;
	name: string;
	team_id: number;
}

export type ICreateCodeTemplatePayload = KeysToCamelCase<Omit<ICodeTemplateTable, "id" | "updated_at" | "created_at">> & {
	vars: any;
};
export type IUpdateCodeTemplatePayload = Partial<Omit<ICreateCodeTemplatePayload, "teamId"> & { id: number }>;
