import { iAction } from "../../crusher-shared/types/action";
import { WebContents } from "electron";
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

export async function saveTest(events: Array<any>) {
	fetch(resolveToBackendPath("tests/actions/save.temp"), {
		method: "POST",
		headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" },
		body: JSON.stringify({
			events: events
		}),
	})
		.then((res) => res.text())
		.then(async (res) => {
			const result = JSON.parse(res);
			shell.openExternal(resolveToFrontEndPath(`/?temp_test_id=${result.insertId}`));

			// @Note: window.open() instead of navigation though hyperlinks
			// hangs the electron app for some reason.
		});
}