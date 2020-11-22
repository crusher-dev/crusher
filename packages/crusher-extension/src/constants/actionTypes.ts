export enum SETTINGS_ACTIONS {
	INSPECT_MODE_ON = 'INSPECT_MODE_ON',
	INSPECT_MODE_OFF = 'INSPECT_MODE_OFF',
	SHOW_SEO_MODAL = 'SHOW_SEO_MODAL',

	SHOW_ASSERT_ELEMENT_MODAL = 'SHOW_ASSERT_ELEMENT_MODAL',
	START_RECORDING_NETWORK_REQUESTS = 'START_RECORDING_NETWORK_REQUESTS',
	START_CAPTURING_CONSOLE = 'START_CAPTURING_CONSOLE',
	TAKE_ELEMENT_SCREENSHOT = 'TAKE_ELEMENT_SCREENSHOT',
	TAKE_PAGE_SCREENSHOT = 'TAKE_PAGE_SCREENSHOT',
	ADD_SANITY_CHECKS = 'ADD_SANITY_CHECKS',

	CLICK_ON_ELEMENT = 'CLICK_ON_ELEMENT',
	HOVER_ON_ELEMENT = 'HOVER_ON_ELEMENT',
	BLACKOUT_ON_ELEMENT = 'BLACKOUT_ON_ELEMENT',

	GO_BACK_TO_PREVIOUS_URL = 'GO_BACK_TO_PREVIOUS_URL',
	GO_FORWARD_TO_NEXT_URL = 'GO_FORWARD_TO_NEXT_URL',
	REFRESH_PAGE = 'REFRESH_PAGE',

	START_RECORDING = 'START_RECORDING',
	TURN_OFF_RECORDING = 'TURN_OFF_RECORDING',

	SHOW_ELEMENT_FORM_IN_SIDEBAR = 'SHOW_ELEMENT_FORM_IN_SIDEBAR',

	START_AUTO_RECORDING = 'START_AUTO_RECORDING',
	TURN_OFF_AUTO_RECORDING = 'TURN_OFF_AUTO_RECORDING',
}

export enum NAVIGATOR_ACTIONS {
	FETCH_USER_AGENT = 'FETCH_USER_AGENT',
	FETCH_USER_AGENT_RESPONSE = 'FETCH_USER_AGENT_RESPONSE',
}

export enum META_ACTIONS {
	FETCH_RECORDING_STATUS = 'FETCH_RECORDING_STATUS',
	FETCH_RECORDING_STATUS_RESPONSE = 'FETCH_RECORDING_STATUS_RESPONSE',

	FETCH_SEO_META = 'FETCH_SEO_META',
	FETCH_SEO_META_RESPONSE = 'FETCH_SEO_META_RESPONSE',

	STARTED_RECORDING_TESTS = 'STARTED_RECORDING_TESTS',

	FETCH_USER_AGENT = 'FETCH_USER_AGENT',
	FETCH_USER_AGENT_RESPONSE = 'FETCH_USER_AGENT_RESPONSE',
}

export const STATE = {
	SEO: 'SEO',
};
