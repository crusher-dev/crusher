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
			case TOP_LEVEL_ACTION.VERIFY_LINK:
				(window as any).electron.runAction([
					{
						type: ActionsInTestEnum.CUSTOM_CODE,
						screenshot: null,
						name: "Verify links",
						payload: {
							meta: {
								script: "async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n    try {\n  \tawait crusherSdk.page.exposeFunction(\"crusherVerifyLinks\", (links) => {\n\t\treturn crusherSdk.verifyLinks(links);\n  \t});\n  } catch(ex){}\n\n  const {uniqueALinks, verifiedLinks} = await crusherSdk.page.evaluate(async function() {\n\tconst aLinkNodes = document.querySelectorAll(\"a\");\n    const aLinks = Array.from(aLinkNodes).map((node) => ({\n        href: (node.href.indexOf('http://') === 0 || node.href.indexOf('https://') === 0) ? node.href : new URL(node.href, window.location.href).toString()\n    }));\n\n    const uniqueALinks = [...new Set(aLinks)];\n    const verifiedLinks = await window.crusherVerifyLinks(uniqueALinks);\n    return {uniqueALinks, verifiedLinks};\n  });\n\n console.log('FInal result before', verifiedLinks.filter(a => !a.exists));  if(verifiedLinks.filter(a => !!a.exists).length !== uniqueALinks.length) return crusherSdk.markTestFail(\"Not all links are valid\", {result: verifiedLinks});\n console.log('FInal result', verifiedLinks.filter(a => !a.exists));  return verifiedLinks;\n}",
							},
							selectors: null,
						},
					},
				]);
				break;
			case TOP_LEVEL_ACTION.SCROLL_AND_TAKE_SCREENSHOT:
				(window as any).electron.runAction([
					{
						type: ActionsInTestEnum.CUSTOM_CODE,
						screenshot: null,
						name: "Scroll and take screenshots",
						payload: {
							meta: {
								script: "async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n     const outputs = [];\n\n    try {\n          await crusherSdk.page.exposeFunction(\"takeCrusherScreenshot\", async function () {\n              const result = await crusherSdk.takePageScreenshot();\n              outputs.push(...result.outputs);\n              return true;\n          });\n    } catch(err) {}\n\n\tawait crusherSdk.page.evaluate(function () {\n\t\treturn new Promise(async (resolve, reject) => {\n await window.takeCrusherScreenshot();\n         const interval = setInterval(async () => {\n              const scrollOffset = window.scrollY + window.innerHeight;\n              window.scroll(0, scrollOffset);\n              await window.takeCrusherScreenshot();\n              if(document.documentElement.scrollHeight <= scrollOffset) {\n                  console.log('scrolled to the end'); clearInterval(interval); resolve(true);\n              }\n          }, 1500);\n        });\n\t}, []);\n\n\treturn { outputs };\n}",
							},
							selectors: null,
						},
					},
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
