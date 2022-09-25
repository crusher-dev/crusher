import React from "react";
import { performTakePageScreenshot } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "electron-app/src/ui/components/modals";
import { ActionsList } from "./actionsList";
import { getItemsFromActionsData } from "./helper";
import { PageIcon } from "electron-app/src/_ui/icons";
import { css } from "@emotion/react";
import { sendSnackBarEvent } from "electron-app/src/ui/components/toast";

const actionsData = require("./actions.json");
interface IProps {
    className?: string;
	defaultExpanded?: boolean;
}; 

const ToastPrettyActionMap = {
	"TAKE_VIEWPORT_SCREENSHOT": "page screenshot",
};

const PageActions = ({className, defaultExpanded, ...props}: IProps) => {
    const handleCallback = React.useCallback((id) => {
		const showToast = () => {
			sendSnackBarEvent({
				type: "step_recorded",
				message: "added a click check",
				meta: {action: ToastPrettyActionMap[id]}
			});
		};
        switch (id) {
			case "TAKE_VIEWPORT_SCREENSHOT":
				performTakePageScreenshot();
				showToast();
				break;
			case "WAIT":
				emitShowModal({ type: "WAIT" });
				break;
			case "SHOW_SEO_MODAL":
				emitShowModal({ type: "SHOW_SEO_MODAL" });
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
			defaultExpanded={defaultExpanded}
            className={`${className}`}
            title={"page"}
            description={"actions for page"}
            items={items}
			icon={<PageIcon css={pageIconCss}/>}
            callback={handleCallback}
        />
    )
};

const pageIconCss = css`
	width: 10.5rem;
	height: 10.5rem;
	path { fill: rgba(255, 255, 255, 0.8); }
`;

export { PageActions };