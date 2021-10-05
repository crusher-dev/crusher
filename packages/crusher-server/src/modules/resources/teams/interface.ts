import { KeysToCamelCase } from "@modules/common/typescript/interface";

export enum PlanTierEnum {
	STARTER = "STARTER",
	PRO = "PRO",
	FREE = "FREE",
}

export interface ITeamsTable {
	id: number;
	name: string;
	team_email: string;
	tier: PlanTierEnum;
	stripe_customer_id?: string;
	meta?: string;
	uuid: string;
}

export type ICreateTeamPayload = KeysToCamelCase<Omit<ITeamsTable, "id" | "tier"> & { tier?: PlanTierEnum }>;
