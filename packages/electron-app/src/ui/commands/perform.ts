import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { iDevice } from "@shared/types/extension/device";
import { ipcRenderer } from "electron";
import { updateRecorderState } from "electron-app/src/store/actions/recorder";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { AnyAction, Store } from "redux";

const performAction = async (action: iAction) => {
   ipcRenderer.invoke("perform-action", { action });
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

export { performAction, performSetDevice, performNavigation };