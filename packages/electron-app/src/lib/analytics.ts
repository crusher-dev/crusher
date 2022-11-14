import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";
import { Analytics } from "@shared/modules/analytics/AnalyticsManager";
import { app } from "electron";
import { getUserAccountInfo } from "../store/selectors/app";
import { getStore } from "../store/configureStore";
import { iAction } from "@shared/types/action";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { logToAxiom } from "@shared/modules/logger";

export const trackEvent = (event: DesktopAppEventsEnum,  properties: any = {}) => {
	const store = getStore();
	const userInfo = getUserAccountInfo(store.getState() as any);
	
	const recorderVersion = app.getVersion();

	return Analytics.track({
		event: event,
		userId: userInfo?.id,
		properties: {
			recorderVersion,
			...properties,
		}
	});
}

export const trackAppStartedEvent = (properties: any = {}) => {
	return trackEvent(DesktopAppEventsEnum.APP_STARTED, {
		args: process.argv,
		...properties,
	});
}

export const trackStepSaved = (step: iAction, properties: any = {}) => {
	return trackEvent(DesktopAppEventsEnum.SAVE_STEP, {
		step: {
			type: step.type,
			name: step.name,
			status: step.status
		},
		...properties,
	});
}