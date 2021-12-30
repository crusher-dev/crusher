import { resolveToBackendPath } from "@shared/utils/url";
import { getStore } from "../redux/store";
import { openLinkInNewTab } from "./dom";
import { resolveToFrontend } from "./helpers";
import { AdvancedURL } from "./url";

export const saveTest = () => {
	const store = getStore();
	const steps = store.getState().actions.list;
	const lastActionTime = store.getState().actions.last_action;

	if (!lastActionTime) {
		return;
	}
	console.log(AdvancedURL.getBackendURL());
	fetch(resolveToBackendPath("tests/actions/save.temp"), {
		method: "POST",
		headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json" },
		body: JSON.stringify({
			events: steps.map((step) => {
				return { ...step, screenshot: null };
			}),
		}),
	})
		.then((res) => res.text())
		.then(async (res) => {
			const result = JSON.parse(res);

			if (await (window as any).electron.isTestVerified()) {
				const urlToOpen = resolveToFrontend(`/?temp_test_id=${result.insertId}#crusherExternalLink`);
				openLinkInNewTab(urlToOpen);
			} else {
				(window as any).electron.verifyTest(result.insertId);
			}

			// @Note: window.open() instead of navigation though hyperlinks
			// hangs the electron app for some reason.
		});
};
