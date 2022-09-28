import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { getStore } from "electron-app/src/store/configureStore";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import { enableJavascriptInDebugger, peformTakeElementScreenshot, performAssertElementVisibility, performClick, performHover } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "electron-app/src/ui/components/modals";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";

const getItemsFromActionsData = (data: {[key: string]: string}) => {
    return Object.keys(data).map((key) => {
        return {
            id: key,
            content: data[key],
        };
    });
};

const ToastPrettyActionMap = {
	"CLICK": "click",
	"HOVER": "hover",
	"SCREENSHOT": "element screenshot",
	"ASSERT_VISIBLE": "assert visible",
};

class ElementsHelper {
    static showToast(id) {
		sendSnackBarEvent({
			type: "step_recorded",
			message: "added a click check",
			meta: {action: ToastPrettyActionMap[id]}
		});
    }

    static async click() {
        const store = getStore();
    
        const selectedElement = getSelectedElement(store.getState() as any);

        await enableJavascriptInDebugger();
        performClick(selectedElement);
        store.dispatch(setSelectedElement(null));
        this.showToast("CLICK");
    }

    static async hover() {
        const store = getStore();
        const selectedElement = getSelectedElement(store.getState() as any);

        await enableJavascriptInDebugger();
        performHover(selectedElement, store);
        store.dispatch(setSelectedElement(null));
        this.showToast("HOVER");
    }

    static async screenshot() {
        const store = getStore();
        const selectedElement = getSelectedElement(store.getState() as any);

        await enableJavascriptInDebugger();
        peformTakeElementScreenshot(selectedElement, store);
        store.dispatch(setSelectedElement(null));
        this.showToast("SCREENSHOT");
    }

    static showAssertModal() { 
        emitShowModal({ type: "SHOW_ASSERT_MODAL" });
    }

    static async assertVisible() {
        const store = getStore();
        const selectedElement = getSelectedElement(store.getState() as any);

        await enableJavascriptInDebugger();
        performAssertElementVisibility(selectedElement, store);
        store.dispatch(setSelectedElement(null));
        this.showToast("ASSERT_VISIBLE");
    }
}
export { getItemsFromActionsData, ElementsHelper };