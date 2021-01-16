import { iHostListResponse } from "@crusher-shared/types/response/hostListResponse";
import { iMonitoringListResponse } from "@crusher-shared/types/response/monitoringListResponse";

export const getProjectHosts = (state: any): Array<iHostListResponse> =>
	state.monitoring.hosts;

export const getProjectMonitoringList = (
	state: any,
): Array<iMonitoringListResponse> => state.monitoring.monitoringList;
