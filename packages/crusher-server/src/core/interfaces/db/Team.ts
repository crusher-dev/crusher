import { BaseRowInterface } from "./BaseRowInterface";
import { TierPlan } from "../TierPlan";

export interface Team extends BaseRowInterface {
	id: number;
	name: string;
	team_email?: string;
	tier: TierPlan;
}
