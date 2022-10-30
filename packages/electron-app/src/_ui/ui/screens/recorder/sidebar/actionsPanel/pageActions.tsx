import React from "react";
import { performTakePageScreenshot } from "electron-app/src/_ui/commands/perform";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { ActionsList } from "./actionsList";
import { getItemsFromActionsData } from "./helper";
import { PageIcon } from "electron-app/src/_ui/constants/icons";
import { css } from "@emotion/react";
import { sendSnackBarEvent } from "electron-app/src/_ui/ui/containers/components/toast";

const actionsData = require("./actions.json");
interface IProps {
	className?: string;
	defaultExpanded?: boolean;
	filteredList: any;
}

const ToastPrettyActionMap = {
	TAKE_VIEWPORT_SCREENSHOT: "page screenshot",
};

const PageActions = ({ className, defaultExpanded, filteredList }: IProps) => {
	const handleCallback = React.useCallback((id) => {
		const showToast = () => {
			sendSnackBarEvent({
				type: "step_recorded",
				message: "added a click check",
				meta: { action: ToastPrettyActionMap[id] },
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
		if (filteredList) {
			// Empty filtered list
			if (Object.keys(filteredList).length === 0) return null;
			return filteredList["PAGE"];
		} else {
			return actionsData["PAGE"];
		}
	}, [filteredList]);

	if (!items) return null;

	return (
		<ActionsList
			defaultExpanded={defaultExpanded}
			className={String(className)}
			title={"page"}
			description={"action on page"}
			items={getItemsFromActionsData(items)}
			icon={<PageIcon css={pageIconCss} />}
			callback={handleCallback}
		/>
	);
};

const pageIconCss = css`
	width: 10.5rem;
	height: 10.5rem;
	path {
		fill: rgba(255, 255, 255, 0.8);
	}
`;

export { PageActions };
