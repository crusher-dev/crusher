import { iAction } from "../../interfaces/actionsReducer";

export const RECORD_ACTION = "RECORD_ACTION";

export const recordAction = (action: iAction) => ({
	type: RECORD_ACTION,
	payload: { action },
});
