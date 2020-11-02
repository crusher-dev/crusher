import { BaseRowInterface } from './BaseRowInterface';

export interface User extends BaseRowInterface {
	id: number;
	team_id?: number;
	first_name: string;
	last_name: string;
	email: string;
	password?: string;
	verified: boolean;
}
