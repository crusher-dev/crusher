import { User } from '../db/user';

export interface iUserInfoResponse extends User{
	name: string;
	user_meta: any;
}

