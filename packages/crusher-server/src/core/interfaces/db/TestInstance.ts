import { BaseRowInterface } from './BaseRowInterface';
import { InstanceStatus } from '../InstanceStatus';
import { InstanceConclusion } from '../InstanceConclusion';
import { Platform } from '../Platform';

export interface TestInstance extends BaseRowInterface {
	id: number;
	job_id: number;
	test_id: number;
	status: InstanceStatus;
	conclusion: InstanceConclusion;
	host: string;
	code: string;
	platform: Platform;
}
