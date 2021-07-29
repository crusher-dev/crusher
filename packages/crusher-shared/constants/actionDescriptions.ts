import { ACTIONS_IN_TEST } from "./recordedActions";
interface ActionMeta {
	selector?: string;
	value?: string;
}

const ACTION_DESCRIPTIONS = {
	[ACTIONS_IN_TEST.SET_DEVICE]: (meta: ActionMeta) => {
		return `Set user agent to ${meta.value}`;
	},
	[ACTIONS_IN_TEST.NAVIGATE_URL]: (meta: ActionMeta) => {
		return `Navigated to ${meta.value}`;
	},
	[ACTIONS_IN_TEST.CLICK]: (meta: ActionMeta) => {
		return `Clicked on ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.HOVER]: (meta: ActionMeta) => {
		return `Hovered on ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.ELEMENT_SCREENSHOT]: (meta: ActionMeta) => {
		return `Took screenshot of ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.PAGE_SCREENSHOT]: () => {
		return `Took page screenshot`;
	},
	[ACTIONS_IN_TEST.SCROLL_TO_VIEW]: (meta: ActionMeta) => {
		return `Scroll until this is in view, ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.ADD_INPUT]: (meta: ActionMeta) => {
		return `Type ${meta.value} in ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.EXTRACT_INFO]: (meta: ActionMeta) => {
		return `Extract info from ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.ASSERT_ELEMENT]: (meta: ActionMeta) => {
		return `Assert element info from ${meta.selector}`;
	},
	[ACTIONS_IN_TEST.VALIDATE_SEO]: (meta: ActionMeta) => {
		return `Validating SEO info`;
	},
};

export { ACTION_DESCRIPTIONS };
