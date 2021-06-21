import { SET_MONITORING_LIST, SET_PROJECT_HOSTS } from "@redux/actions/monitoring";
import IAction from "@interfaces/redux/action";
import { iHostListResponse } from "@crusher-shared/types/response/hostListResponse";
import { iMonitoringListResponse } from "@crusher-shared/types/response/monitoringListResponse";

export interface iSettingsState {
	hosts: iHostListResponse[];
	monitoringList: iMonitoringListResponse[];
}

const initialState: iSettingsState = {
	hosts: [],
	monitoringList: [],
};

const monitoring = (state: iSettingsState = initialState, action: IAction<any>) => {
	const { type, payload } = action;

	switch (type) {
		case SET_PROJECT_HOSTS:
			return {
				...state,
				hosts: payload.hosts,
			};
		case SET_MONITORING_LIST:
			return {
				...state,
				monitoringList: payload.list,
			};
		default:
			return state;
	}
};

export default monitoring;
