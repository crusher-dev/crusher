import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { JobInfo } from "@interfaces/JobInfo";
import { saveTestInstanceLogs } from "@redux/actions/testInstance";
import { store } from "@redux/store";

export class TestInstanceService {
	static fetchLogsForTestInstance(instanceId: number, headers = null): Promise<JobInfo> {
		return backendRequest(`/v2/test_instance/logs/${instanceId}`, {
			method: RequestMethod.GET,
			headers: headers,
		}).then((logs) => {
			return store.dispatch(saveTestInstanceLogs(logs, instanceId));
		});
	}
}
