import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export interface IUserTable extends BaseRowInterface {
	id: number;
	team_id: number;
	name: string;
	emaiL: string;
	password: string;
	verified: boolean;
	is_oss: boolean;
	meta: string | null;
}

export type ICreateUserPayload = KeysToCamelCase<Omit<IUserTable, "id" | "team_id" | "verified" | "is_oss" | "meta" | "verified">> & { meta?: string | null };
