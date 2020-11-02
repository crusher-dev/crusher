export interface CreateTestInstanceRequest {
	jobId: number;
	testId: number;
	status: string;
	host: string;
	code: string;
	platform: string;
}
