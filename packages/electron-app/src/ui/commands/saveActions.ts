import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { recordStep, setSelectedElement, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { AnyAction, Store } from "redux";
import { sendSnackBarEvent } from "../components/toast";
import { registerActionAsSavedStep } from "./perform";

function saveAutoAction(action: iAction, store: Store<unknown, AnyAction>) {
	switch (action.type) {
		default:
			registerActionAsSavedStep(action);
			break;
	}
}

export { saveAutoAction };
