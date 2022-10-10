import { useCallback } from "react";
import { deleteRecordedSteps, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { useStore, useSelector } from "react-redux";
import {merge} from "lodash";

export const useSteps = () => {
    const store = useStore();
    const savedSteps = useSelector(getSavedSteps);

    const getStep = useCallback((stepId) => {
        return savedSteps[stepId];
    },[savedSteps]);

    const deleteStep = useCallback((index: number) => {
        store.dispatch(deleteRecordedSteps([index]));
    }, []);
    
    const updateStep = useCallback((stepIndex: number, payload: any) => {
        const step  = savedSteps[stepIndex];
        store.dispatch(updateRecordedStep(merge(step, payload), stepIndex));
    }, [savedSteps]);

    return { getStep, savedSteps, deleteStep, updateStep };
}

export const useStep = (stepId: number) => {
    const { deleteStep, updateStep, getStep } = useSteps();
    const step = getStep(stepId);

    const removeStep = useCallback(() => {
        deleteStep(stepId);
    }, [deleteStep]);

    const _updateStep = useCallback((payload: any) => {
        updateStep(stepId, payload);
    }, [updateStep]);

    return { step, deleteStep: removeStep, updateStep: _updateStep };
};