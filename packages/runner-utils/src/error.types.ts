import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

export enum StepErrorTypeEnum {
    ELEMENT_NOT_FOUND = "ELEMENT_NOT_FOUND",
    ELEMENT_NOT_STABLE = "ELEMENT_NOT_STABLE",
    ELEMENT_NOT_VISIBLE = "ELEMENT_NOT_VISIBLE",
    
    ASSERTIONS_FAILED = "ASSERTIONS_FAILED",
    TIMEOUT = "TimeoutError", // if not any other action can't be validated
    
    UNEXPECTED_ERROR_OCCURRED = "UNEXPECTED_ERROR_OCCURRED", // <--- See logs to understand
}
  
export interface ICrusherRecorderContext {
    getStep: (stepIndex: number) => iAction;
    getAllSteps: () => iAction[];
    
    updateStep: (stepIndex: number, step: iAction) => void;
    setSteps: (steps: iAction[]) => void;

    updateRecorderState: (state: any) => void;
    openModal: (modalType: string, modalProps?: any) => void;

    getPlaywrightPage: () => Page;
};

