import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { recordStep, setSelectedElement, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { AnyAction, Store } from "redux";
import { registerActionAsSavedStep } from "./perform";

function getLastRecordedStep(store: Store<unknown, AnyAction>) {
    const steps = getSavedSteps(store.getState() as any);
    return { step: steps[steps.length - 1], index: steps.length - 1 };
};

function handleWaitForNavigation(action: iAction, store: Store<unknown, AnyAction>) {
    registerActionAsSavedStep(action);
}

function handleInputElement(action: iAction, store: Store<unknown, AnyAction>) {
    // @TODO: Look into previous implementation for select and other input elements
    const lastRecordedStep = getLastRecordedStep(store);
    if(lastRecordedStep.step.type === ActionsInTestEnum.ADD_INPUT && lastRecordedStep.step.uniqueId === action.uniqueId) {
        store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
    } else {
        store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
    }
}

function handlePageElementScroll(action: iAction, store: Store<unknown, AnyAction>) {
    const lastRecordedStep = getLastRecordedStep(store);
    if ([ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL].includes(lastRecordedStep.step.type) && action.uniqueId === lastRecordedStep.step.uniqueId) {
        action.payload.meta.value = [...lastRecordedStep.step.payload.meta.value, action.payload.meta.value];
        store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
    } else {
        action.payload.meta.value = [action.payload.meta.value];
        store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
    }
}

function saveAutoAction(action: iAction, store: Store<unknown, AnyAction>) {
    switch(action.type) {
        case ActionsInTestEnum.WAIT_FOR_NAVIGATION:
            handleWaitForNavigation(action, store);
            break;
        case ActionsInTestEnum.ADD_INPUT:
            handleInputElement(action, store);
            break;
        case ActionsInTestEnum.PAGE_SCROLL:
            case ActionsInTestEnum.ELEMENT_SCROLL:
                handlePageElementScroll(action, store);
                break;
        default:
            store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
            break;
    }
}

export { saveAutoAction };