import React from "react";
import { enableJavascriptInDebugger, peformTakeElementScreenshot, performAssertElementVisibility, performClick, performHover, performTakePageScreenshot, turnOnInspectMode } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "electron-app/src/ui/components/modals";
import { ActionsList } from "./actionsList";
import { getItemsFromActionsData } from "./helper";
import { useStore } from "react-redux";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import { ElementIcon } from "electron-app/src/_ui/icons";
import { css } from "@emotion/react";

const actionsData = require("./actions.json");
interface IProps {
    className?: string;
	defaultExpanded?: boolean;
}; 

const ElementActions = ({className, defaultExpanded, ...props}: IProps) => {
    const store = useStore();
    const handleCallback = React.useCallback(async (id) => {
		turnOnInspectMode({action: id});

        switch (id) {
			case "CLICK":
				window["elementActionsCallback"] = async () => {
					const selectedElement = getSelectedElement(store.getState());

					await enableJavascriptInDebugger();
					performClick(selectedElement);
					store.dispatch(setSelectedElement(null));
				};

				break;
			case "HOVER":
				window["elementActionsCallback"] = async () => {
					const selectedElement = getSelectedElement(store.getState());

					await enableJavascriptInDebugger();
					performHover(selectedElement, store);
					store.dispatch(setSelectedElement(null));
				};

				break;
			case "SCREENSHOT":
				window["elementActionsCallback"] = async () => {
					const selectedElement = getSelectedElement(store.getState());

					await enableJavascriptInDebugger();
					peformTakeElementScreenshot(selectedElement, store);
					store.dispatch(setSelectedElement(null));
				};

				break;
			case "SHOW_ASSERT_MODAL":
				window["elementActionsCallback"] = async () => {
					emitShowModal({ type: "SHOW_ASSERT_MODAL" });
				};
				break;
			case "SHOW_CUSTOM_SCRIPT_MODAL":
				window["elementActionsCallback"] = async () => {
					emitShowModal({ type: "SHOW_ASSERT_MODAL" });
				};
				break;
			case "ASSERT_VISIBILITY":
				window["elementActionsCallback"] = async () => {
					const selectedElement = getSelectedElement(store.getState());

					await enableJavascriptInDebugger();
					performAssertElementVisibility(selectedElement, store);
					store.dispatch(setSelectedElement(null));
				};

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
			icon={<ElementIcon css={elementIconCss}/>}
            items={items}
			defaultExpanded={defaultExpanded}
            callback={handleCallback}
        />
    )
};

const elementIconCss = css`
	width: 10.5rem;
	height: 12.5rem;
	path { fill: rgba(255, 255, 255, 0.8); }
`;

export { ElementActions };