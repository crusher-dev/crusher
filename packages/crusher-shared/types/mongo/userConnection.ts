import { USER_CONNECTION_TYPE } from '../userConnectionType';

export interface iUserConnection {
	id: string;
	userId: number;
	service: USER_CONNECTION_TYPE;
	meta: any;
	createdAt: number;
	updatedAt: number;
}
