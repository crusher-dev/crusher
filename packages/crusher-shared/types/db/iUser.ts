import { BaseRowInterface } from "./baseRow";

export interface iUser extends BaseRowInterface {
	id: number;
	team_id?: number;
	first_name: string;
	last_name: string;
	email: string;
	password?: string;
	verified: boolean;
	stripe_customer_id?: string;
	on_hold?: boolean;
	stripe_subscription_id?: string;
	is_oss: boolean;
}
