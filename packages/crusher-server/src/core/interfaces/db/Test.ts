import { TestFramework } from '../TestFramework';
import { BaseRowInterface } from './BaseRowInterface';

export interface Test extends BaseRowInterface {
	id: number;
	name: string;
	code: string;
	events: string;
	framework: TestFramework;
	project_id: number;
}
