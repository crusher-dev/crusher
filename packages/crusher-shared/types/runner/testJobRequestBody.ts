import { iAction } from '../action';

export interface iTestJobRequestBody {
	id?: number;
	testType: 'DRAFT' | 'SAVED';
	name?: string;
	events: Array<iAction>;
}
