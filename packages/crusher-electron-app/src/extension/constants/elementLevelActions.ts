import { ELEMENT_LEVEL_ACTION } from "../interfaces/elementLevelAction";
import { iActionDescription } from "../interfaces/actionDescription";

const ELEMENT_LEVEL_ACTIONS_LIST: iActionDescription[] = [
	{
		id: ELEMENT_LEVEL_ACTION.CLICK,
		title: "Click",
		icon: chrome.runtime.getURL("icons/actions/click.svg"),
		desc: "Click on the element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.HOVER,
		title: "Hover",
		icon: chrome.runtime.getURL("icons/actions/hover.svg"),
		desc: "Add a hover action to element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.SCREENSHOT,
		title: "Screenshot",
		icon: chrome.runtime.getURL("icons/actions/screenshot.svg"),
		desc: "Take screenshot of element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.SHOW_ASSERT_MODAL,
		title: "Add Checks",
		icon: chrome.runtime.getURL("icons/actions/assert-modal.svg"),
		desc: "Setup Assertion for Element",
	},
	{
		id: ELEMENT_LEVEL_ACTION.CUSTOM_SCRIPT,
		title: "Code",
		icon: chrome.runtime.getURL("icons/actions/custom-script.svg"),
		desc: "Write script for assertion",
	},
];

export { ELEMENT_LEVEL_ACTIONS_LIST };
