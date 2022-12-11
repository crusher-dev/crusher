import { iAction } from "@shared/types/action";

import { registerActionAsSavedStep } from "../../ipc/perform";

function saveAutoAction(action: iAction) {
	switch (action.type) {
		default:
			registerActionAsSavedStep(action);
			break;
	}
}

export { saveAutoAction };
