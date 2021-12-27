import { TOP_LEVEL_ACTION } from "../interfaces/topLevelAction";
import { iActionDescription } from "../interfaces/actionDescription";

const TOP_LEVEL_ACTIONS_LIST: Array<iActionDescription> = [
	{
		id: TOP_LEVEL_ACTION.TAKE_PAGE_SCREENSHOT,
		title: "Take viewport screenshot",
		icon: chrome.runtime.getURL("icons/actions/screenshot.svg"),
		desc: "Take screenshot of page",
	},
	{
		id: TOP_LEVEL_ACTION.WAIT,
		title: "Wait for seconds",
		icon: chrome.runtime.getURL("icons/actions/seo.svg"),
		desc: "Wait for few seconds",
	},
	{
		id: TOP_LEVEL_ACTION.SHOW_SEO_MODAL,
		title: "Add SEO checks",
		icon: chrome.runtime.getURL("icons/actions/seo.svg"),
		desc: "Add seo assertions",
	},
	{
		id: TOP_LEVEL_ACTION.CUSTOM_CODE,
		title: "Custom Code",
		icon: chrome.runtime.getURL("icons/actions/seo.svg"),
		desc: "Add custom code",
	},
	{
		id: TOP_LEVEL_ACTION.RUN_AFTER_TEST,
		title: "Run after test",
		icon: chrome.runtime.getURL("icons/actions/seo.svg"),
		desc: "Run after this test",
	},
	// {
	// 	id: TOP_LEVEL_ACTION.SCROLL_AND_TAKE_SCREENSHOT,
	// 	title: "Scroll and take screenshot",
	// 	icon: chrome.runtime.getURL("icons/actions/seo.svg"),
	// 	desc: "",
	// },
	// {
	// 	id: TOP_LEVEL_ACTION.VERIFY_LINK,
	// 	title: "Verify links",
	// 	icon: chrome.runtime.getURL("icons/actions/seo.svg"),
	// 	desc: "",
	// }
];

export { TOP_LEVEL_ACTIONS_LIST };
