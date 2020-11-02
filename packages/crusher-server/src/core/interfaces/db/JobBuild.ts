import { JobStatus } from '../JobStatus';
import { JobConclusion } from '../JobConclusion';
import { JobTrigger } from '../JobTrigger';
import { Platform } from '../Platform';
import { BaseRowInterface } from './BaseRowInterface';

export interface JobBuild extends BaseRowInterface {
	id?: number;
	project_id?: number;
	pr_id?: number;
	commit_id?: string;
	repo_name?: string;
	branch_name?: string;
	commit_name?: string;
	status: JobStatus;
	conclusion?: JobConclusion;
	host?: string;
	trigger: JobTrigger;
	meta?: string; // Contains stringify array for tests in the job .
	check_run_id?: string;
	platform?: Platform;
	installation_id?: string;
	user_id?: number;
}
