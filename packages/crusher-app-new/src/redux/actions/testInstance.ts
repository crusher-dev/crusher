export const SET_TEST_INSTANCE_LOGS = "SET_TEST_INSTANCE_LOGS";
export const CLEAR_ALL_LOGS = "CLEAR_ALL_LOGS";

export const saveTestInstanceLogs = (logs, instanceId) => ({
	type: SET_TEST_INSTANCE_LOGS,
	instanceId,
	logs,
});
