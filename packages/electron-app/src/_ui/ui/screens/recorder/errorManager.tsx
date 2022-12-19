import React from "react";
import { useEffect } from "react";
import { css } from "@emotion/react";
import { ipcRenderer } from "electron";
import { showToast, toastEmitter, ToastProvider, ToastViewport } from "../../components/toasts";
import { useStore } from "react-redux";
import { getStore } from "electron-app/src/store/configureStore";
import { getAllSteps } from "electron-app/src/store/selectors/recorder";
import { getLogs } from "electron-app/src/store/selectors/logger";
import { ActionDescriptor } from "runner-utils/src";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";
import { iAction } from "@shared/types/action";
import { getErrorMessage } from "./sidebar/stepsPanel/helper";
import { emitShowModal } from "../../containers/components/modals";
import { EDIT_MODE_MAP } from "./sidebar/stepsPanel/stepEditor";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { Page } from "playwright";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { setSteps, updateRecordedStep, updateRecorderState } from "electron-app/src/store/actions/recorder";
import { retryStep } from "./sidebar/stepsPanel/failedCard";

interface ICrusherRecorderSDK {

    getStep: (stepIndex: number) => iAction;
    getAllSteps: () => iAction[];
    
    updateStep: (stepIndex: number, step: iAction) => void;
    setSteps: (steps: iAction[]) => void;

    updateRecorderState: (state: TRecorderState, payload?: any) => void;
    openModal: (modalType: string, modalProps?: any) => void;

    retryStep: (stepIndex: number) => void;

    getPlaywrightPage: () => Page;
};


const crusherRecorderSDK: ICrusherRecorderSDK = {
    getStep: (stepIndex) => {
        const store = getStore();
        const steps = getAllSteps(store.getState() as any);

        return steps[stepIndex] as any;
    },
    getAllSteps: () => {
        const store = getStore();
        const steps = getAllSteps(store.getState() as any);

        return steps as any;
    },
    updateStep: (stepIndex, step) => {
        const store = getStore();
        store.dispatch(updateRecordedStep(step, stepIndex));
        return true
    },
    setSteps: (steps) => {
        const store = getStore();
        
        store.dispatch(setSteps(steps));
    },

    updateRecorderState: (state, payload = {}) => {
        const store = getStore();
        store.dispatch(updateRecorderState(state, payload));
    },

    openModal: (modalType, modalProps = {}) => {
        emitShowModal({
            type: modalType,
            ...modalProps,
        });
    },

    retryStep: (stepIndex) => {
        return retryStep(stepIndex);
    },

    getPlaywrightPage: () => {
        const store = getStore();
        const state = store.getState() as any;
        const { page } = state.recorder;

        return page;
    }

}

const getStep = (stepIndex) => {
    const store = getStore();
    const steps = getAllSteps(store.getState() as any);

    return steps[stepIndex];
};

const getLogsBetWeenTimeInterval = (startTime, endTime) => {
    const store = getStore();
    const logs = getLogs(store.getState() as any);

    const parentLogs = logs.get("_").filter((log) => {
        return log.timestamp >= startTime && log.timestamp <= endTime;
    });
    
    const allLogs = parentLogs.reduce((acc, log) => {
        const stepLogs = logs.get(log.id) || [];
        return [...acc, ...stepLogs];
    }, []);

    return allLogs;
};

export const RecorderErrorManager = () => {
    const store = useStore();
    const [error, setError] = React.useState(null);

    const actionDescriber = React.useMemo(() => {
		const actionDescriber = new ActionDescriptor();
        actionDescriber.initActionHandlers();

		return actionDescriber;
	}, []);

    useEffect(() => {
        const handleStepError = (event, payload) => {
            const { stepIndex, error, starTime, endTime } = payload;
            const step: iAction & {errorType: any} = getStep(stepIndex);
            const logs = getLogsBetWeenTimeInterval(starTime, endTime);

			const isElementFailure = step.type.startsWith("ELEMENT_") && [StepErrorTypeEnum.ELEMENT_NOT_FOUND, StepErrorTypeEnum.ELEMENT_NOT_STABLE, StepErrorTypeEnum.ELEMENT_NOT_VISIBLE, StepErrorTypeEnum.TIMEOUT].includes(step.errorType);

			// console.log("Last Failed Step", step);
			setError({
				message: getErrorMessage(step),
				type: "step-failed",
                id: stepIndex,
				isUnique: true,
				meta: {
					errorType: step.errorType,
					stepId: stepIndex,
					callback: isElementFailure ? () => {
						console.log("CLICKED, YES");
					} : () => {
						emitShowModal({
							type: EDIT_MODE_MAP[step.type],
							stepIndex: stepIndex,
						});
					}
				},
			});

        };
        ipcRenderer.on("recorder-step-error", handleStepError);
        return () => {
            ipcRenderer.removeListener("recorder-step-error", handleStepError);
        };
    }, []);
    
    const handleResolve = (isResolved: boolean) => {
        if(isResolved) {
            setError(null);
        }
    };
    
    const Component  = actionDescriber && error ? actionDescriber.getAction(ActionsInTestEnum.ADD_INPUT)["ui"]["recorder"].default : null;
    return  (
        <ToastProvider swipeDirection="right"> 
            {Component && <Component resolveCallback={handleResolve} id={error.id} sdk={crusherRecorderSDK} />}
            <ToastViewport  />
        </ToastProvider>
    );
}