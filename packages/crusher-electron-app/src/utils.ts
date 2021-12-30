import { iAction } from "../../crusher-shared/types/action";
import * as path from "path";
import axios from "axios";
import { resolveToBackendPath, resolveToFrontEndPath } from "../../crusher-shared/utils/url";
import { ActionsInTestEnum } from "../../crusher-shared/constants/recordedActions";
import { shell } from "electron";

const { getMainActions, getBrowserActions } = require("../../../output/crusher-runner-utils/");

export function getAppIconPath() {
	switch (process.platform) {
		case "win32":
			return path.join(__dirname, "icons/app.ico");
		default:
			return path.join(__dirname, "icons/app.png");
	}
}

export async function getReplayableTestActions(testId: number, isMainTest = true): Promise<iAction[]> {
	const out = [];
	const testInfo = await axios.get(resolveToBackendPath(`/tests/${testId}`));
	const browserActions: iAction[] = getBrowserActions(testInfo.data.events);
	if (isMainTest) {
		out.push(...browserActions);
	}
	const runAfterTest = browserActions.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
	if (runAfterTest) out.push(...(await getReplayableTestActions(runAfterTest.payload.meta.value, false)));

	const mainActions: iAction[] = getMainActions(testInfo.data.events);
	out.push(...mainActions);

	return out;
}

export function saveTest(events: any[]) {
	axios
		.post(
			resolveToBackendPath("tests/actions/save.temp"),
			{
				events: events,
			},
			{
				headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" },
			},
		)
		.then((result) => {
			shell.openExternal(resolveToFrontEndPath(`/?temp_test_id=${result.data.insertId}`));

			// @Note: window.open() instead of navigation though hyperlinks
			// hangs the electron app for some reason.
		});
}
