import React, { RefObject } from "react";
import { TOP_LEVEL_ACTIONS_LIST } from "../../../constants/topLevelActions";
import { List } from "../../components/app/list";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";
import { recordAction } from "../../../redux/actions/actions";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { executeScriptInFrame, turnOffInspectModeInFrame, turnOnInspectModeInFrame } from "../../../messageListener";
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
			case TOP_LEVEL_ACTION.SCROLL_AND_TAKE_SCREENSHOT:
				executeScriptInFrame(`async function validate(element){
					const saveAction = (actionType, selectors, value) => {
						window.electron.host.postMessage({
							type: "RECORD_ACTION",
							meta: {
								type: actionType,
								payload: {
									selectors: selectors,
									meta: value ? {
										value
									} : undefined
								},
								url: window.location.href,
							}
						});
					}
					saveAction("PAGE_SCREENSHOT", null);
					
					const interval = setInterval(() => {
						const scrollOffset = window.scrollY + window.innerHeight;
						window.scroll(0, scrollOffset);
						saveAction("PAGE_SCROLL", "body", scrollOffset);
						saveAction("PAGE_SCREENSHOT", null);
						if(document.documentElement.scrollHeight <= scrollOffset) {
							console.log('scrolled to the end'); clearInterval(interval);
						}
					}, 500);
					
					return true;
				}`, "", null)
				break;
			case TOP_LEVEL_ACTION.TAKE_PAGE_SCREENSHOT:
				store.dispatch(
					recordAction({
						type: ActionsInTestEnum.PAGE_SCREENSHOT,
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
			case TOP_LEVEL_ACTION.WAIT:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.WAIT_SECONDS));
				break;
			case TOP_LEVEL_ACTION.SHOW_SEO_MODAL:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.SEO_VALIDATION));
				break;
			case TOP_LEVEL_ACTION.CUSTOM_CODE:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.CUSTOM_CODE));
				break;
			case TOP_LEVEL_ACTION.RUN_AFTER_TEST:
				store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.RUN_AFTER_TEST));
				break;
			default:
				console.debug("Unknown Top Level Action Called");
				break;
		}
	};

	return <List heading={"Select Action"} items={items} onItemClick={handleActionSelected}></List>;
};

export { TopLevelActionsList };
