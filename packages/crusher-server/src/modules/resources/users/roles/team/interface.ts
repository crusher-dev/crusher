import { BaseRowInterface } from "@crusher-shared/types/db/baseRow";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum UserTeamRoleEnum {
	MEMBER = "MEMBER",
	ADMIN = "ADMIN",
}

export interface IUserTeamRoleTable extends BaseRowInterface {
	user_id: number;
	team_id: number;
	role: UserTeamRoleEnum;
}

export type ICreateUserTeamRole = KeysToCamelCase<IUserTeamRoleTable> & { role?: UserTeamRoleEnum };
