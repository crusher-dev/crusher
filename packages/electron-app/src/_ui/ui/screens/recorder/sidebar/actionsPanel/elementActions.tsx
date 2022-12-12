import React from "react";
import { turnOnInspectMode } from "electron-app/src/ipc/perform";
import { ActionsList } from "./actionsList";
import { ElementsHelper, getItemsFromActionsData } from "./helper";
import { useSelector } from "react-redux";
import { getSelectedElement } from "electron-app/src/store/selectors/recorder";
import { ElementIcon } from "electron-app/src/_ui/constants/icons";
import { css } from "@emotion/react";

const actionsData = require("./actions.json");
interface IProps {
	className?: string;
	defaultExpanded?: boolean;
	filteredList: any;
}

const ElementActions = ({ className, filteredList, defaultExpanded }: IProps) => {
	const selectedElement = useSelector(getSelectedElement);

	const handleCallback = React.useCallback(
		(id) => {
			if (!selectedElement) {
				turnOnInspectMode({ action: id });
			}
			switch (id) {
				case "CLICK":
					if (selectedElement) {
						ElementsHelper.click();
					} else {
						window["elementActionsCallback"] = ElementsHelper.click;
					}
					break;
				case "HOVER":
					if (selectedElement) {
						ElementsHelper.hover();
					} else {
						window["elementActionsCallback"] = ElementsHelper.hover;
					}

					break;
				case "SCREENSHOT":
					if (selectedElement) {
						ElementsHelper.screenshot();
					} else {
						window["elementActionsCallback"] = ElementsHelper.screenshot;
					}

					break;
				case "SHOW_ASSERT_MODAL":
					if (selectedElement) {
						ElementsHelper.showAssertModal();
					} else {
						window["elementActionsCallback"] = ElementsHelper.showAssertModal;
					}
					break;
				case "ASSERT_VISIBILITY":
					if (selectedElement) {
						ElementsHelper.assertVisible();
					} else {
						window["elementActionsCallback"] = ElementsHelper.assertVisible;
					}
					break;
			}
		},
		[selectedElement],
	);

	const items = React.useMemo(() => {
		if (filteredList) {
			// Empty filtered list
			if (Object.keys(filteredList).length === 0) return null;
			return filteredList["ELEMENT"];
		} else {
			return actionsData["ELEMENT"];
		}
	}, [filteredList]);

	if (!items) return null;

	return (
		<ActionsList
			id={"element_action"}
			className={String(className)}
			title={"element"}
			description={"checks over element"}
			icon={<ElementIcon css={elementIconCss} />}
			items={getItemsFromActionsData(items)}
			defaultExpanded={defaultExpanded}
			callback={handleCallback}
		/>
	);
};

const elementIconCss = css`
	width: 10.5rem;
	height: 12.5rem;
	path {
		fill: rgba(255, 255, 255, 0.8);
	}
`;

export { ElementActions };
