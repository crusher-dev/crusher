import React from "react";
import { Text } from "@dyson/components/atoms/text/Text";
import { css } from "@emotion/react";
import { ActionList, ActionListItem } from "./ActionList";
import { TOP_LEVEL_ACTION } from "crusher-electron-app/src/extension/interfaces/topLevelAction";
import { performActionInFrame, turnOffInspectModeInFrame, turnOnInspectModeInFrame } from "crusher-electron-app/src/extension/messageListener";
import { TOP_LEVEL_ACTIONS_LIST } from "crusher-electron-app/src/extension/constants/topLevelActions";
import { getStore } from "crusher-electron-app/src/extension/redux/store";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { recordAction } from "crusher-electron-app/src/extension/redux/actions/actions";
import { updateActionsModalState, updateActionsRecordingState } from "crusher-electron-app/src/extension/redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "crusher-electron-app/src/extension/interfaces/actionsModalState";
import { ELEMENT_LEVEL_ACTION } from "crusher-electron-app/src/extension/interfaces/elementLevelAction";
import { recordActionWithHoverNodes } from "crusher-electron-app/src/extension/redux/utils/actions";
import { getActionsRecordingState } from "crusher-electron-app/src/extension/redux/selectors/recorder";
import { useSelector } from "react-redux";
import { ACTIONS_RECORDING_STATE } from "crusher-electron-app/src/extension/interfaces/actionsRecordingState";
import { ELEMENT_LEVEL_ACTIONS_LIST } from "crusher-electron-app/src/extension/constants/elementLevelActions";

export const TopLevelActionsList = (props) => {
	const {isInspectModeOn, deviceIframeRef} = props;

	const handleActionSelected = (id: TOP_LEVEL_ACTION) => {
		const store = getStore();

		switch (id) {
			case TOP_LEVEL_ACTION.VERIFY_LINK:
				(window as any).electron.runAction([{
					type: ActionsInTestEnum.CUSTOM_CODE,
					screenshot: null,
					name: "Verify links",
					payload: {
						meta: {
							script: "async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n    try {\n  \tawait crusherSdk.page.exposeFunction(\"crusherVerifyLinks\", (links) => {\n\t\treturn crusherSdk.verifyLinks(links);\n  \t});\n  } catch(ex){}\n\n  const {uniqueALinks, verifiedLinks} = await crusherSdk.page.evaluate(async function() {\n\tconst aLinkNodes = document.querySelectorAll(\"a\");\n    const aLinks = Array.from(aLinkNodes).map((node) => ({\n        href: (node.href.indexOf('http://') === 0 || node.href.indexOf('https://') === 0) ? node.href : new URL(node.href, window.location.href).toString()\n    }));\n\n    const uniqueALinks = [...new Set(aLinks)];\n    const verifiedLinks = await window.crusherVerifyLinks(uniqueALinks);\n    return {uniqueALinks, verifiedLinks};\n  });\n\n console.log('FInal result before', verifiedLinks.filter(a => !a.exists));  if(verifiedLinks.filter(a => !!a.exists).length !== uniqueALinks.length) return crusherSdk.markTestFail(\"Not all links are valid\", {result: verifiedLinks});\n console.log('FInal result', verifiedLinks.filter(a => !a.exists));  return verifiedLinks;\n}",
						},
						selectors: null
					}		
				}]);
				break;
			case TOP_LEVEL_ACTION.SCROLL_AND_TAKE_SCREENSHOT:
				(window as any).electron.runAction([
					{
						type: ActionsInTestEnum.CUSTOM_CODE,
						screenshot: null,
						name: "Scroll and take screenshots",
						payload: {
							meta: {
								script: "async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n     const outputs = [];\n\n    try {\n          await crusherSdk.page.exposeFunction(\"takeCrusherScreenshot\", async function () {\n              const result = await crusherSdk.takePageScreenshot();\n              outputs.push(...result.outputs);\n              return true;\n          });\n    } catch(err) {}\n\n\tawait crusherSdk.page.evaluate(function () {\n\t\treturn new Promise(async (resolve, reject) => {\n await window.takeCrusherScreenshot();\n         const interval = setInterval(async () => {\n              const scrollOffset = window.scrollY + window.innerHeight;\n              window.scroll(0, scrollOffset);\n              await window.takeCrusherScreenshot();\n              if(document.documentElement.scrollHeight <= scrollOffset) {\n                  console.log('scrolled to the end'); clearInterval(interval); resolve(true);\n              }\n          }, 1500);\n        });\n\t}, []);\n\n\treturn { outputs };\n}"
							},
							selectors: null
						}
					}
				]);
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
				alert("Show custom code");
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

	const items = TOP_LEVEL_ACTIONS_LIST.map((action) => {
		return <ActionListItem onClick={handleActionSelected.bind(this, action.id)}>{action.title}</ActionListItem>;
	});


	return 	(<ActionList title="Page List">{items}</ActionList>);
};


export const ElementActionsList = (props) => {
	const {isInspectModeOn, deviceIframeRef} = props;
	const recordingState = useSelector(getActionsRecordingState);

	const recordElementAction = (type: ActionsInTestEnum, meta: any = null, screenshot: string | null = null) => {
		recordActionWithHoverNodes({
			type: type,
			payload: {
				selectors: recordingState.elementInfo?.selectors,
				meta: meta,
			},
			screenshot: screenshot,
			//@TODO: Get the url of the target site here (Maybe some hack with atom or CEF)
			url: "",
		});
	};
	
	const handleActionSelected = (id: ELEMENT_LEVEL_ACTION) => {
		const store = getStore();

		// switch (id) {
		// 	case ELEMENT_LEVEL_ACTION.CLICK:
		// 		(window as any).electron.turnOnInspectMode();
		// 		turnOnInspectModeInFrame(props.deviceIframeRef);

		// 		// performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
		// 		break;
		// 	case ELEMENT_LEVEL_ACTION.HOVER:
		// 		(window as any).electron.turnOnInspectMode();
		// 		turnOnInspectModeInFrame(props.deviceIframeRef);

		// 		// recordElementAction(ActionsInTestEnum.HOVER, null, recordingState.elementInfo.screenshot);
		// 		// performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
		// 		break;
		// 	case ELEMENT_LEVEL_ACTION.SCREENSHOT:
		// 		recordElementAction(ActionsInTestEnum.ELEMENT_SCREENSHOT, null, recordingState.elementInfo.screenshot);
		// 		break;
		// 	case ELEMENT_LEVEL_ACTION.BLACKOUT:
		// 		recordElementAction(ActionsInTestEnum.BLACKOUT, null, recordingState.elementInfo.screenshot);
		// 		performActionInFrame(id, ACTIONS_RECORDING_STATE.ELEMENT, props.deviceIframeRef);
		// 		break;
		// 	case ELEMENT_LEVEL_ACTION.SHOW_ASSERT_MODAL:
		// 		store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.ASSERT_ELEMENT));
		// 		return;
		// 	case ELEMENT_LEVEL_ACTION.CUSTOM_SCRIPT:
		// 		store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.ELEMENT_CUSTOM_SCRIPT));
		// 		return;
		// 	default:
		// 		console.debug("Unknown Element Level Action");
		// }

		(window as any).electron.turnOnInspectMode();
		turnOnInspectModeInFrame(props.deviceIframeRef);
	};

	const items = ELEMENT_LEVEL_ACTIONS_LIST.filter((a) => (![ELEMENT_LEVEL_ACTION["CLICK"], ELEMENT_LEVEL_ACTION["HOVER"]].includes(a.id as any))).map((action) => {
		return <ActionListItem onClick={handleActionSelected.bind(this, action.id)}>{action.title}</ActionListItem>;
	});


	return 	(<ActionList>
			<div css={actionTab}>
					<Text css={css`border-right-style: solid; border-right-color: #323636; border-right-width: 1rem;`} CSS={hoverTextStyle} onClick={handleActionSelected.bind(this, ELEMENT_LEVEL_ACTION.CLICK)}>
						Click
					</Text>
					<Text CSS={hoverTextStyle} onClick={handleActionSelected.bind(this, ELEMENT_LEVEL_ACTION.HOVER)}>
						Hover
					</Text>
				</div>
		<>{items}</>
	</ActionList>);
};

export const Action = ({ setSelected }): JSX.Element => {
	return (
		<div>
			<ElementActionsList/>
			<TopLevelActionsList isInspectModeOn={false}/>
			{/* <ActionList title="Most Used">
				<ActionListItem>Click on element</ActionListItem>
				<ActionListItem>Click on element</ActionListItem>
			</ActionList> */}
		</div>
	);
};

const actionTab = css`
	display: flex;
	justify-content: stretch;
`;
const actionTabSelected = css`
	background: rgba(148, 98, 255, 0.63);
`;
const hoverTextStyle = css`
	padding: 8rem 4rem;
	font-family: Gilroy;
	font-size: 13rem;
	text-align: center;
	flex: 1;

	:hover {
		background-color: #32363678;
	}
`;
