import { iAction } from "@shared/types/action";

import { AnyAction, Store } from "redux";
import { registerActionAsSavedStep } from "./perform";

function saveAutoAction(action: iAction, store: Store<unknown, AnyAction>) {
	switch (action.type) {
		default:
			registerActionAsSavedStep(action);
			break;
	}
}

export { saveAutoAction };
