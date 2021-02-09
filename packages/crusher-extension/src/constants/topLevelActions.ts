import { TOP_LEVEL_ACTION } from "../interfaces/topLevelAction";
import { iActionDescription } from "../interfaces/actionDescription";

const TOP_LEVEL_ACTIONS_LIST: Array<iActionDescription> = [
	{
		id: TOP_LEVEL_ACTION.TOGGLE_INSPECT_MODE,
		value: "Element",
		icon: chrome.runtime.getURL("icons/actions/inspect-mode.svg"),
		desc: "Take screenshot, add assertion",
	},
	{
		id: TOP_LEVEL_ACTION.TAKE_PAGE_SCREENSHOT,
		value: "Screenshot",
		icon: chrome.runtime.getURL("icons/actions/screenshot.svg"),
		desc: "Take page screenshot",
	},
	{
		id: TOP_LEVEL_ACTION.SHOW_SEO_MODAL,
		value: "SEO",
		icon: chrome.runtime.getURL("icons/actions/seo.svg"),
		desc: "Select Element",
	},
];

export { TOP_LEVEL_ACTIONS_LIST };
