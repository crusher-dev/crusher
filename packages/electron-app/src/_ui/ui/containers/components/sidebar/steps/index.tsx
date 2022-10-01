import { ActionsInTestEnum } from "@shared/constants/recordedActions";

export const ACTION_DESCRIPTIONS = {
	[ActionsInTestEnum.CLICK]: "Click on element",
	[ActionsInTestEnum.HOVER]: "Hover on element",
	[ActionsInTestEnum.PAGE_SCREENSHOT]: "Take screenshot of page",
	[ActionsInTestEnum.ELEMENT_SCREENSHOT]: "Take screenshot of element",
	[ActionsInTestEnum.ELEMENT_FOCUS]: "Focus on element",
	[ActionsInTestEnum.BLACKOUT]: "Blackout element",
	[ActionsInTestEnum.PRESS]: "Press on element",
	[ActionsInTestEnum.ADD_INPUT]: "Add input to element",
	[ActionsInTestEnum.SET_DEVICE]: "Set device",
	[ActionsInTestEnum.RUN_AFTER_TEST]: "Run after test",
	[ActionsInTestEnum.RUN_TEMPLATE]: "Run template",
	[ActionsInTestEnum.NAVIGATE_URL]: "Navigate to URL",
	[ActionsInTestEnum.VALIDATE_SEO]: "Validate SEO",
	[ActionsInTestEnum.WAIT_FOR_NAVIGATION]: "Wait for navigation",
	[ActionsInTestEnum.PAGE_SCROLL]: "Scroll page",
	[ActionsInTestEnum.ELEMENT_SCROLL]: "Scroll element",
	[ActionsInTestEnum.WAIT]: "Wait",
	[ActionsInTestEnum.ASSERT_ELEMENT]: "Assert element",
	[ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT]: "Custom element script",
	[ActionsInTestEnum.CUSTOM_CODE]: "Custom code",
	[ActionsInTestEnum.RELOAD_PAGE]: "Reload page",
	[ActionsInTestEnum.BACK_PAGE]: "Go back page",
	[ActionsInTestEnum.ASSERT_ELEMENT_VISIBILITY]: "Assert element visibility",
};


