import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum UserProjectRoleEnum {
	MEMBER = "MEMBER",
	ADMIN = "ADMIN",
}

export interface IUserProjectRoleTable extends BaseRowInterface {
	user_id: number;
	project_id: number;
	role: UserProjectRoleEnum;
}

export type ICreateUserProjectRole = KeysToCamelCase<IUserProjectRoleTable> & { role?: UserProjectRoleEnum };
