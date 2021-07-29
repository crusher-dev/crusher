export interface iMonitoringListResponse {
	id: number;
	project_id: number;
	test_interval: number;
	platform: any;
	target_host: string;
	target_host_name: string;
	last_cron_run: string;
	user_id: number;
	tags: string;
	created_at: string;
	updated_at: string;
}
