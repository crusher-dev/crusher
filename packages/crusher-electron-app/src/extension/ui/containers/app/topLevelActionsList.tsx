import React, { RefObject } from "react";
import { TOP_LEVEL_ACTIONS_LIST } from "../../../constants/topLevelActions";
import { List } from "../../components/app/list";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";
import { recordAction } from "../../../redux/actions/actions";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { turnOffInspectModeInFrame, turnOnInspectModeInFrame } from "../../../messageListener";
import { getStore } from "../../../redux/store";
import { useSelector } from "react-redux";
import { getInspectModeState } from "../../../redux/selectors/recorder";
import { updateActionsModalState } from "../../../redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "../../../interfaces/actionsModalState";

interface iTopLevelActionListProps {
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}

const TopLevelActionsList = (props: iTopLevelActionListProps) => {
	const isInspectModeOn = useSelector(getInspectModeState);

	const items = TOP_LEVEL_ACTIONS_LIST.map((action) => {
		return {
			id: action.id,
			icon: action.icon,
			title: action.title,
			desc: action.desc,
		};
	});

	const handleActionSelected = (id: TOP_LEVEL_ACTION) => {
		const store = getStore();

		switch (id) {
			case TOP_LEVEL_ACTION.TAKE_PAGE_SCREENSHOT:
				store.dispatch(
					recordAction({
						type: ACTIONS_IN_TEST.PAGE_SCREENSHOT,
						payload: {},
						//@TODO: Get the url of the target site here (Maybe some hack with atom or CEF)
						url: "",
					}),
				);
				break;
			case TOP_LEVEL_ACTION.TOGGLE_INSPECT_MODE:
				if (isInspectModeOn) {
					(window as any).electron.turnOffInspectMode();
					turnOffInspectModeInFrame(props.deviceIframeRef);
				} else {
					(window as any).electron.turnOnInspectMode();
					turnOnInspectModeInFrame(props.deviceIframeRef);
				}
				break;
			case TOP_LEVEL_ACTION.SHOW_SEO_MODAL:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.SEO_VALIDATION));
				break;
			default:
				console.debug("Unknown Top Level Action Called");
				break;
		}
	};

	return <List heading={"Select Action"} items={items} onItemClick={handleActionSelected}></List>;
};

export { TopLevelActionsList };
