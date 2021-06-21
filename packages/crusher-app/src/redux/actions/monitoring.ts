import { iHostListResponse } from "@crusher-shared/types/response/hostListResponse";
import { iMonitoringListResponse } from "@crusher-shared/types/response/monitoringListResponse";

export const SET_PROJECT_HOSTS = "SET_PROJECT_HOSTS";

export const setProjectHosts = (hosts: iHostListResponse[]) => ({
	type: SET_PROJECT_HOSTS,
	payload: { hosts },
});

export const SET_MONITORING_LIST = "SET_MONITORING_LIST";

export const setMonitoringList = (list: iMonitoringListResponse[]) => ({
	type: SET_MONITORING_LIST,
	payload: { list },
});
