import { iUser } from '../db/iUser';

export interface iUserInfoResponse extends iUser{
	name: string;
	user_meta: any;
}

