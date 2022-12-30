import { iAction } from "../action";
import { Page } from "playwright";

export interface ICrusherRecorderSDK {
    getStep: () => iAction;    
    updateStep: (step: iAction) => void;
    retryStep: () => void;

    openStepEditor: () => void;

    openModal: (modalType: string, modalProps?: any) => void;
    getPlaywrightPage: () => Page;
};
