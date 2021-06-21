import { TestInstanceStatus } from "@interfaces/TestInstanceStatus";

export interface JobInfo {
	job: {
		id: number;
		project_id: number;
		pr_id?: string;
		commit_id?: string;
		repo_name?: string;
		branch_name?: string;
		commit_name?: string;
		status: "CREATED" | "QUEUED" | "RUNNING" | "FINISHED" | "TIMEOUT" | "ABORTED";
		conclusion: "PASSED" | "FAILED" | "MANUAL_REVIEW_REQUIRED";
		host?: string;
		trigger: "MANUAL" | "CLI" | "CRON";
		meta?: string;
		created_at: string;
		updated_at: string;
		check_run_id?: string;
		platform: "CHROME" | "FIREFOX" | "SAFARI" | "ALL";
		installation_id?: string;
		user_id: number;
	};
	referenceJob: {
		id: number;
		project_id: number;
		pr_id?: string;
		commit_id?: string;
		repo_name?: string;
		branch_name?: string;
		commit_name?: string;
		status: "CREATED" | "QUEUED" | "RUNNING" | "FINISHED" | "TIMEOUT" | "ABORTED";
		conclusion: "PASSED" | "FAILED" | "MANUAL_REVIEW_REQUIRED";
		host?: string;
		trigger: "MANUAL" | "CLI" | "CRON";
		meta?: string;
		created_at: string;
		updated_at: string;
		check_run_id?: string;
		platform: "CHROME" | "FIREFOX" | "SAFARI" | "ALL";
		installation_id?: string;
		user_id: number;
	};
	instances: {
		[instance_id: number]: {
			id: number;
			job_id: number;
			test_id: number;
			test_name: string;
			events: string;
			status: TestInstanceStatus;
			code: string;
			platform: "QUEUED" | "RUNNING" | "FINISHED" | "TIMEOUT" | "ABORTED";
			host?: string;
			created_at: string;
			updated_at: string;
			recorded_video_uri?: string;
			images: {
				id: number;
				url: string;
				name: string;
				created_at: string;
			}[];
		};
	};
	results: {
		[instance_id: number]: {
			instance_id: number;
			reference_instance_id: number;
			status: "RUNNING_CHECKS" | "FINISHED_RUNNING_CHECKS" | "ERROR_RUNNING_CHECKS" | "TIMEOUT";
			conclusion: "PASSED" | "FAILED" | "MANUAL_REVIEW_REQUIRED";
			results: {
				id: number;
				screenshot_id: number;
				target_screenshot_id: number;
				instance_result_set_id: number;
				diff_delta: number;
				diff_image_url?: string;
				status: "PASSED" | "FAILED" | "ERROR_CREATING_DIFF" | "MANUAL_REVIEW_REQUIRED";
				action_by?: number;
				created_at: string;
				updated_at: string;
				instance_id: number;
				target_instance_id: number;
				result_set_status: string;
				result_set_conclusion: string;
			}[];
		};
	};
	comments: {
		[instance_id: number]: {
			[screenshot_id: number]: {
				id: number;
				user_id: number;
				user_name: string;
				job_id: number;
				instance_id: number;
				screenshot_id: number;
				result_set_id: number;
				message: string;
				replied_to?: number;
				created_at: string;
				updated_at: string;
			}[];
		};
	};
}
