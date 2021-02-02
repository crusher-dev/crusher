import { ELEMENT_LEVEL_ACTION } from "../interfaces/elementLevelAction";
import { iActionDescription } from "../interfaces/actionDescription";

const ELEMENT_LEVEL_ACTIONS_LIST: Array<iActionDescription> = [
	{
		id: ELEMENT_LEVEL_ACTION.CLICK,
		value: "Click",
		icon: chrome.runtime.getURL("icons/action.svg"),
		desc: "Click on the element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.HOVER,
		value: "Hover",
		icon: chrome.runtime.getURL("icons/action.svg"),
		desc: "Add a hover action to element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.SCREENSHOT,
		value: "Screenshot",
		icon: chrome.runtime.getURL("icons/action.svg"),
		desc: "Take screenshot of element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.BLACKOUT,
		value: "Blackout",
		icon: chrome.runtime.getURL("icons/action.svg"),
		desc: "Blackout element in test results",
	},
	{
		id: ELEMENT_LEVEL_ACTION.SHOW_ASSERT_MODAL,
		value: "Assert",
		icon: chrome.runtime.getURL("icons/action.svg"),
		desc: "Setup Assertion for Element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.CUSTOM_SCRIPT,
		value: "Custom Script",
		icon: chrome.runtime.getURL("icons/action.svg"),
		desc: "",
	},
];

export { ELEMENT_LEVEL_ACTIONS_LIST };
