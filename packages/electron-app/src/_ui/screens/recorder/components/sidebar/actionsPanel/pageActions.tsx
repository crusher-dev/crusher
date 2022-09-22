import React from "react";
import { performTakePageScreenshot } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "electron-app/src/ui/components/modals";
import { ActionsList } from "./actionsList";
import { getItemsFromActionsData } from "./helper";

const actionsData = require("./actions.json");
interface IProps {
    className?: string;
}; 

const PageActions = ({className, ...props}: IProps) => {
    const handleCallback = React.useCallback((id) => {
        switch (id) {
			case "TAKE_VIEWPORT_SCREENSHOT":
				performTakePageScreenshot();
				break;
			case "WAIT":
				emitShowModal({ type: "WAIT" });
				break;
			case "SHOW_SEO_MODAL":
				emitShowModal({ type: "SHOW_SEO_MODAL" });
				break;
			case "CUSTOM_CODE":
				emitShowModal({ type: "CUSTOM_CODE" });
				break;
			case "RUN_AFTER_TEST":
				emitShowModal({ type: "RUN_AFTER_TEST" });
				break;
			default:
				break;
		}
    }, []);

    const items = React.useMemo(() => {
        return getItemsFromActionsData(actionsData["PAGE"])
    }, []);

    return (
        <ActionsList
            className={`${className}`}
            title={"page"}
            description={"actions for page"}
            items={items}
            callback={handleCallback}
        />
    )
};

export { PageActions };