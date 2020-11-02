import { BaseRowInterface } from './BaseRowInterface';

export interface TestInstanceScreenshot extends BaseRowInterface {
	id?: number;
	instance_id: number;
	name: string;
	url: string;
}
