import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { JobInfo } from "@interfaces/JobInfo";

export class JobReportService {
	static getJobReportFull(reportId: number, headers = null): Promise<JobInfo> {
		return backendRequest(`/v2/job/report/full/${reportId}`, {
			method: RequestMethod.GET,
			headers: headers,
		});
	}
}
