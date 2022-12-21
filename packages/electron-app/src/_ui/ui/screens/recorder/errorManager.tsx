import React from "react";
import { useEffect } from "react";
import { ipcRenderer } from "electron";
import { ToastProvider, ToastViewport } from "../../components/toasts";
import { useStore } from "react-redux";
import { getStore } from "electron-app/src/store/configureStore";
import { getAllSteps, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { getLogs } from "electron-app/src/store/selectors/logger";
import { ActionDescriptor } from "runner-utils/src";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";
import { iAction } from "@shared/types/action";
import { getErrorMessage } from "./sidebar/stepsPanel/helper";
import { emitShowModal } from "../../containers/components/modals";
import { EDIT_MODE_MAP } from "./sidebar/stepsPanel/stepEditor";
import { Page } from "playwright";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { retryStep } from "./sidebar/stepsPanel/failedCard";
import { TestErrorContext } from "@dyson/components/sharedComponets/toasts";
import { useState } from "react";

interface ICrusherRecorderSDK {
    getStep: () => iAction;    
    updateStep: (step: iAction) => void;
    retryStep: () => void;

    openModal: (modalType: string, modalProps?: any) => void;
    getPlaywrightPage: () => Page;
};

const getStep = (stepIndex) => {
    const store = getStore();
    const steps = getAllSteps(store.getState() as any);

    return steps[stepIndex];
};

const getLogsBetWeenTimeInterval = (startTime, endTime) => {
    const store = getStore();
    const logs = getLogs(store.getState() as any);

    const parentLogs = logs.get("_").filter((log) => {
        return log.time >= startTime && log.time <= endTime;
    });
    
    const allLogs = parentLogs.reduce((acc, log) => {
        const stepLogs = logs.get(log.id) || [];
        return [...acc, ...stepLogs];
    }, []);

    return allLogs;
};

interface IError {
    message: string;
    actionType: ActionsInTestEnum;
    id: number;
    logs: any[];
}
export const RecorderErrorManager = () => {
    const store = useStore();
    const [error, setError] = useState(null);

    const actionDescriber = React.useMemo(() => {
		const actionDescriber = new ActionDescriptor();
        actionDescriber.initActionHandlers();

		return actionDescriber;
	}, []);

    useEffect(() => {
        const handleStepError = (event, payload) => {
            const { stepIndex, error, startTime, endTime } = payload;
            const step: iAction & {errorType: any} = getStep(stepIndex);
            const stepLogs = getLogsBetWeenTimeInterval(startTime, endTime);

			setError({
				message: getErrorMessage(step),
                actionType: step.type,
                id: stepIndex,
                logs: stepLogs,

                startTime: startTime,
                endTime: endTime,
			});

        };
        ipcRenderer.on("recorder-step-error", handleStepError);
        return () => {
            ipcRenderer.removeListener("recorder-step-error", handleStepError);
        };
    }, []);

    
    const Component  = actionDescriber && error ? actionDescriber.getAction(error.actionType)["ui"]["recorder"].default : null;


    const crusherRecorderSDK: ICrusherRecorderSDK = {
        getStep: () => {
            const steps = getAllSteps(store.getState() as any);
            return steps[error.id] as any;
        },
        updateStep: (step) => {
            store.dispatch(updateRecordedStep(step, error.id));

            const savedSteps = getSavedSteps(store.getState() as any);
            console.log("JSON", JSON.stringify(savedSteps), step);
            // Wait for main process store to be updated
            
            return true;
        },

        openModal: (modalType, modalProps = {}) => {
            emitShowModal({
                type: modalType,
                ...modalProps,
            });
        },

        retryStep: () => {
            return retryStep(error.id);
        },

        getPlaywrightPage: () => {
            const state = store.getState() as any;
            return state.recorder.page;
        }

    }

        
    const handleResolveError = (isResolved: boolean) => {
        setError(null);
    };

    return  (
        <TestErrorContext.Provider value={{ sdk: crusherRecorderSDK, stepId: error?.id, resolveError: handleResolveError, error: error }}>
            <ToastProvider swipeDirection="right"> 
                {Component && <Component />}
                <ToastViewport  />
            </ToastProvider>
        </TestErrorContext.Provider>
    );
}