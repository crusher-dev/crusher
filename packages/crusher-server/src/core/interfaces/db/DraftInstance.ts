import { InstanceStatus } from '../InstanceStatus';
import { Platform } from '../Platform';
import { BaseRowInterface } from './BaseRowInterface';

export interface DraftInstance extends BaseRowInterface {
	id?: number;
	draft_id: number;
	status: InstanceStatus;
	code: string;
	platform: Platform;
}
