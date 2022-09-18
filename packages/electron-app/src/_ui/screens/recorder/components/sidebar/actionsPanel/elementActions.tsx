import React from "react";
import { enableJavascriptInDebugger, peformTakeElementScreenshot, performAssertElementVisibility, performClick, performHover, performTakePageScreenshot } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "electron-app/src/ui/components/modals";
import { ActionsList } from "./actionsList";
import { getItemsFromActionsData } from "./helper";
import { useStore } from "react-redux";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";

const actionsData = require("./actions.json");
interface IProps {
    className?: string;
}; 

const ElementActions = ({className, ...props}: IProps) => {
    const store = useStore();
    const handleCallback = React.useCallback(async (id) => {
        const selectedElement = getSelectedElement(store.getState());
        switch (id) {
			case "CLICK":
				await enableJavascriptInDebugger();
				performClick(selectedElement);
				store.dispatch(setSelectedElement(null));
				break;
			case "HOVER":
				await enableJavascriptInDebugger();
				performHover(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
			case "SCREENSHOT":
				await enableJavascriptInDebugger();
				peformTakeElementScreenshot(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
			case "SHOW_ASSERT_MODAL":
				emitShowModal({ type: "SHOW_ASSERT_MODAL" });
				break;
			case "SHOW_CUSTOM_SCRIPT_MODAL":
				emitShowModal({ type: "SHOW_ASSERT_MODAL" });
				break;
			case "ASSERT_VISIBILITY":
				await enableJavascriptInDebugger();
				performAssertElementVisibility(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
		}
    }, []);

    const items = React.useMemo(() => {
        return getItemsFromActionsData(actionsData["ELEMENT"])
    }, []);

    return (
        <ActionsList
            className={`${className}`}
            title={"element"}
            description={"actions for element"}
            items={items}
            callback={handleCallback}
        />
    )
};

export { ElementActions };