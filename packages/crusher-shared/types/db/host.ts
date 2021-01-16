import { BaseRowInterface } from './baseRow';

export interface iHost extends BaseRowInterface{
	id: number;
	project_id: number;
	user_id: number;
	host_name: string;
	url: string;
};
