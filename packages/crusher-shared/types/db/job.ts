import { BaseRowInterface } from "./baseRow";
import { JOB_STATUS } from "../jobStatus";
import { JOB_TRIGGER } from "../jobTrigger";
import { PLATFORM } from "../platform";

export interface iJob extends BaseRowInterface {
	id: number;
	project_id: number;
	pr_id?: string;
	commit_id?: string;
	repo_name?: string;
	branch_name?: string;
	commit_name?: string;
	status: JOB_STATUS;
	host: string;
	trigger: JOB_TRIGGER;
	meta?: string;
	platform: PLATFORM;
	user_id?: number;
	// Github Check Run Id
	check_run_id?: string;
	// Github installation id
	installation_id?: string;
}
