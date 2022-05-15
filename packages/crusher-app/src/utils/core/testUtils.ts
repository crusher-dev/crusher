import { getBuildsList, getRunTestApi } from "@constants/api";
import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { mutate } from "swr";
import { BaseRouter } from "next/dist/shared/lib/router/router";
import { sendSnackBarEvent } from "@utils/common/notify";
import { backendRequest } from "@utils/common/backendRequest";
import { RequestMethod } from "../../types/RequestOptions";

const runTests = (projectId: number, folder: string | null = null) => {
	return backendRequest(getRunTestApi(projectId), {
		method: RequestMethod.POST,
		payload: {
			folder,
		}
	});
};

export function handleTestRun(selectedProjectId: number | null, query: any, filters: Record<string, any>, router: BaseRouter, updateMetaData: Function) {
	(async () => {
		try {
			await runTests(selectedProjectId, filters.folder ? filters.folder : null);
			sendSnackBarEvent({ type: "normal", message: "We're running test." });
			const buildAPI = getBuildsList(selectedProjectId, query.trigger, filters);

			updateMetaData({
				type: "user",
				key: USER_META_KEYS.TEST_CREATED,
				value: true,
			});

			updateMetaData({
				type: "project",
				key: PROJECT_META_KEYS.TEST_CREATED,
				value: true,
			});

			await mutate(buildAPI);
			// @ts-ignore
			await router.push("/app/builds");
		} catch (e) {
			if (e.toString() === "Error: No tests available to run") {
				sendSnackBarEvent({ type: "error", message: "You don't have any test to run" });
			}
		}
	})();
}
