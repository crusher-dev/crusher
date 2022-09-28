import React from "react";
import { enableJavascriptInDebugger, peformTakeElementScreenshot, performAssertElementVisibility, performClick, performHover, performTakePageScreenshot, turnOnInspectMode } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "electron-app/src/ui/components/modals";
import { ActionsList } from "./actionsList";
import { ElementsHelper, getItemsFromActionsData } from "./helper";
import { useStore } from "react-redux";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import { ElementIcon } from "electron-app/src/_ui/icons";
import { css } from "@emotion/react";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";
import { useSelector } from "react-redux";

const actionsData = require("./actions.json");
interface IProps {
    className?: string;
	defaultExpanded?: boolean;
}; 

const ToastPrettyActionMap = {
	"CLICK": "click",
	"HOVER": "hover",
	"SCREENSHOT": "element screenshot",
	"ASSERT_VISIBLE": "assert visible",
};

const ElementActions = ({className, defaultExpanded, ...props}: IProps) => {
    const store = useStore();
	const selectedElement = useSelector(getSelectedElement);

    const handleCallback = React.useCallback(async (id) => {
		if(!selectedElement) {
			turnOnInspectMode({action: id});
		}
        switch (id) {
			case "CLICK":
				if(selectedElement) {
					ElementsHelper.click();
				} else {
					window["elementActionsCallback"] = ElementsHelper.click;
				}
				break;
			case "HOVER":
				if(selectedElement) {
					ElementsHelper.hover();
				} else {
					window["elementActionsCallback"] = ElementsHelper.hover;
				}

				break;
			case "SCREENSHOT":
				if(selectedElement) {
					ElementsHelper.screenshot();
				} else {
					window["elementActionsCallback"] = ElementsHelper.screenshot;
				}

				break;
			case "SHOW_ASSERT_MODAL":
				if(selectedElement) {
					ElementsHelper.showAssertModal();
				} else {
					window["elementActionsCallback"] = ElementsHelper.showAssertModal;
				}
				break;
			case "ASSERT_VISIBILITY":
				if(selectedElement) {
					ElementsHelper.assertVisible();
				} else {
					window["elementActionsCallback"] = ElementsHelper.assertVisible;
				}
				break;
		}
    }, [selectedElement]);

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