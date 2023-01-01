import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export interface IDraftTestsTable extends BaseRowInterface {
	id: number;
	name: string;
	events: string;
	user_id: number;
	project_id: number;
}


export type ICreateDraftTestsPayload = KeysToCamelCase<Omit<IDraftTestsTable, "id" | "updated_at" | "created_at">> & {
	events: any;
};
export type IUpdateDraftTestsPayload = Partial<Omit<ICreateDraftTestsPayload, "user_id" | "project_id">>;