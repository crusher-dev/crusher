import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import { ipcRenderer } from "electron";
import { updateRecorderState } from "electron-app/src/store/actions/recorder";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { AnyAction, Store } from "redux";

const performAction = async (action: iAction) => {
   ipcRenderer.invoke("perform-action", { action });
};

const performSetDevice = async (device: string, store: Store<unknown, AnyAction>) => {

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

export { performAction, performNavigation };