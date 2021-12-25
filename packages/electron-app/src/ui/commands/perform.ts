import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { iDevice } from "@shared/types/extension/device";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { ipcRenderer } from "electron";
import { recordStep, updateRecorderState } from "electron-app/src/store/actions/recorder";
import { iElementInfo, TRecorderState } from "electron-app/src/store/reducers/recorder";
import { AnyAction, Store } from "redux";

const performAction = async (action: iAction, shouldNotSave: boolean = false) => {
   ipcRenderer.invoke("perform-action", { action, shouldNotSave });
};

const performSetDevice = async (device: iDevice) => {
    await performAction({
        type: ActionsInTestEnum.SET_DEVICE,
        payload: {
            meta: {
                device: device.id,
                userAgent: device.userAgent,
            },
        },
    });
}

const performNavigation = async (url: string, store: Store<unknown, AnyAction>) => {
    store.dispatch(updateRecorderState(TRecorderState.NAVIGATING, { url } ));

    await performAction({
        type: ActionsInTestEnum.NAVIGATE_URL,
        payload: {
            selectors: [],
            meta: {
                value: url,
            }
        }
    });
};

const performTakePageScreenshot = async () => { 
    await performAction({
        type: ActionsInTestEnum.PAGE_SCREENSHOT,
        payload: { },
    });
}

const recordHoverDependencies =  (selectedElement: iElementInfo, store: Store<unknown, AnyAction>) => {
    for(let depedentHover of selectedElement.dependentHovers) {
        store.dispatch(recordStep({
            type: ActionsInTestEnum.HOVER,
            payload: {
                selectors: depedentHover.selectors,
            }
        }));
    }
};


const peformTakeElementScreenshot = async (selectedElement: iElementInfo, store: Store<unknown, AnyAction>) => { 
    recordHoverDependencies(selectedElement, store);

    await performAction({
        type: ActionsInTestEnum.ELEMENT_SCREENSHOT,
        payload: {
            selectors: selectedElement.selectors,
        },
    });
}

const performClick = async (selectedElement: iElementInfo) => {
    await performAction({
        type: ActionsInTestEnum.CLICK,
        payload: {
            selectors: selectedElement.selectors,
        }
    }, true);
};

const performHover = async (selectedElement: iElementInfo, store: Store<unknown, AnyAction>) => {
    recordHoverDependencies(selectedElement, store);

    await performAction({
        type: ActionsInTestEnum.HOVER,
        payload: {
            selectors: selectedElement.selectors,
        }
    });
};

const turnOnInspectMode = () => {
    ipcRenderer.invoke("turn-on-recorder-inspect-mode");
}

const turnOffInspectMode = () => {
    ipcRenderer.invoke("turn-off-recorder-inspect-mode");
}

export { performAction, performSetDevice, performNavigation, performTakePageScreenshot, turnOnInspectMode, turnOffInspectMode, performClick, performHover, peformTakeElementScreenshot };