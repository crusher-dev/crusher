import { ELEMENT_LEVEL_ACTION } from "../interfaces/elementLevelAction";
import { iActionDescription } from "../interfaces/actionDescription";

const ELEMENT_LEVEL_ACTIONS_LIST: Array<iActionDescription> = [
	{
		id: ELEMENT_LEVEL_ACTION.CLICK,
		value: "Click",
		icon: chrome.runtime.getURL("icons/actions/click.svg"),
		desc: "Click on the element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.HOVER,
		value: "Hover",
		icon: chrome.runtime.getURL("icons/actions/hover.svg"),
		desc: "Add a hover action to element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.SCREENSHOT,
		value: "Screenshot",
		icon: chrome.runtime.getURL("icons/actions/screenshot.svg"),
		desc: "Take screenshot of element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.BLACKOUT,
		value: "Blackout",
		icon: chrome.runtime.getURL("icons/actions/blackout.svg"),
		desc: "Blackout element in test results",
	},
	{
		id: ELEMENT_LEVEL_ACTION.SHOW_ASSERT_MODAL,
		value: "Assert",
		icon: chrome.runtime.getURL("icons/actions/assert-modal.svg"),
		desc: "Setup Assertion for Element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.CUSTOM_SCRIPT,
		value: "Custom Script",
		icon: chrome.runtime.getURL("icons/actions/custom-script.svg"),
		desc: "",
	},
];

export { ELEMENT_LEVEL_ACTIONS_LIST };
