import { iAction } from "../../crusher-shared/types/action";
import { WebContents } from "electron";
import * as path from "path";
import axios from "axios";
import { resolveToBackendPath } from "../../crusher-shared/utils/url";
import { ActionsInTestEnum } from "../../crusher-shared/constants/recordedActions";

const { getMainActions, getBrowserActions } = require("../../../output/crusher-runner-utils/");

export function getAppIconPath() {
	switch (process.platform) {
		case "win32":
			return path.join(__dirname, "icons/app.ico");
		default:
			return path.join(__dirname, "icons/app.png");
	}
}

export async function getReplayableTestActions(testId: number, isMainTest = true): Promise<Array<iAction>> {
	const out = [];
	const testInfo = await axios.get(resolveToBackendPath(`/tests/${testId}`));
	const browserActions: Array<iAction> = getBrowserActions(testInfo.data.events);
	if (isMainTest) {
		out.push(...browserActions);
	}
	const runAfterTest = browserActions.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
	if (runAfterTest) out.push(...(await getReplayableTestActions(runAfterTest.payload.meta.value, false)));

	const mainActions: Array<iAction> = getMainActions(testInfo.data.events);
	if (!isMainTest) {
		mainActions.map((action) => {
			return action;
		});
	}
	out.push(...mainActions);

	return out;
}
