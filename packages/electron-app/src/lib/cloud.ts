import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iAction } from "@shared/types/action";
import axios from "axios";
import { shell } from "electron";
import { getBrowserActions, getMainActions } from "runner-utils/src/utils/helper";
import { getStore } from "../store/configureStore";
import { getCurrentSelectedProjct } from "../store/selectors/app";
import { createAuthorizedRequestFunc, resolveToBackend, resolveToFrontend } from "../utils/url";

class CloudCrusher {
	public static getTest: (testId: string) => Promise<iAction[]> = createAuthorizedRequestFunc((authorizationOptions, testId) => {
		return axios.get<{ events: iAction[] }>(resolveToBackend(`/tests/${testId}`), authorizationOptions).then((res) => res.data.events);
	});

	public static createProject: (projectName: string) => Promise<any> = createAuthorizedRequestFunc((authorizationOptions, projectName) => {
		return axios
			.post(
				resolveToBackend("/projects/actions/create"),
				{
					name: projectName,
				},
				authorizationOptions,
			)
			.then((res) => res.data);
	});

	public static updateProjectEmoji: (projectId: number, emoji: string) => Promise<any> = createAuthorizedRequestFunc(
		(authorizationOptions, projectId, emoji) => {
			return axios.post(resolveToBackend(`/projects/${projectId}/actions/update.emoji`), { emoji: emoji }, authorizationOptions);
		},
	);

	public static updateTestEmoji: (testId: number, emoji: string) => Promise<any> = createAuthorizedRequestFunc((authorizationOptions, testId, emoji) => {
		return axios.post(resolveToBackend(`/tests/${testId}/actions/update.emoji`), { emoji: emoji }, authorizationOptions);
	});

	public static updateTestName: (testId: string, newName: string) => Promise<any> = createAuthorizedRequestFunc((authorizationOptions, testId, newName) => {
		return axios
			.post(
				resolveToBackend(`/tests/${testId}/actions/edit`),
				{
					name: newName,
				},
				authorizationOptions,
			)
			.then((res) => res.data);
	});

	public static runTests: (testIds: string[], proxyConfig: any | null) => Promise<any> = createAuthorizedRequestFunc(
		(authorizationOptions, testIds, proxyConfig) => {
			const store = getStore();
			const selectedProject = getCurrentSelectedProjct(store.getState() as any);
			if (!selectedProject) throw new Error("No project selected!");

			return axios
				.post(
					resolveToBackend(`/projects/${selectedProject}/tests/actions/run`),
					{
						testIds: Array.isArray(testIds) ? testIds.join(",") : testIds,
						proxyUrlsMap: getProxyFromTunnelData(proxyConfig),
					},
					authorizationOptions,
				)
				.then((res) => res.data);
		},
	);

	public static saveLocalBuildReport: (tests: { steps: any[]; testId: number; testName: string; status: "PASSED" | "FAILED" }[]) => Promise<any> =
		createAuthorizedRequestFunc((authorizationOptions, tests) => {
			const store = getStore();
			const selectedProject = getCurrentSelectedProjct(store.getState() as any);
			if (!selectedProject) throw new Error("No project selected!");
			return axios
				.post(
					resolveToBackend(`/projects/${selectedProject}/builds/actions/create.local`),
					{
						tests: tests,
					},
					authorizationOptions,
				)
				.then((res) => res.data);
		});

	public static runDraftTest: (testId: string, proxyConfig: any | null) => Promise<any> = createAuthorizedRequestFunc(
		(authorizationOptions, testId, proxyConfig) => {
			const store = getStore();
			const selectedProject = getCurrentSelectedProjct(store.getState() as any);
			if (!selectedProject) throw new Error("No project selected!");

			return axios
				.post(
					resolveToBackend(`/projects/${selectedProject}/tests/actions/runDraftTest`),
					{
						testId: testId,
						proxyUrlsMap: getProxyFromTunnelData(proxyConfig),
					},
					authorizationOptions,
				)
				.then((res) => res.data);
		},
	);

	public static getBuildReport: (buildId: string) => Promise<any> = createAuthorizedRequestFunc((authorizationOptions, buildId) => {
		return axios.get(resolveToBackend(`/builds/${buildId}/report`), authorizationOptions).then((res) => res.data);
	});

	public static deleteTest: (testId: string) => Promise<any> = createAuthorizedRequestFunc((authorizationOptions, testId) => {
		return axios.post(resolveToBackend(`/tests/${testId}/actions/delete`), {}, authorizationOptions).then((res) => res.data);
	});

	public static saveTest: (testPayload: { events: iAction[]; name: string }, shouldAutorun: boolean) => Promise<any> = createAuthorizedRequestFunc(
		async (authorizationOptions, testPayload) => {
			const tempTest = await axios
				.post(
					resolveToBackend("/tests/actions/save.temp"),
					{
						events: testPayload.events,
					},
					authorizationOptions,
				)
				.then((res) => res.data);

			const frontendSaveTestUrl = new URL(resolveToFrontend(`/?temp_test_id=${tempTest.insertId}&temp_test_type=save`));
			if (testPayload.name) frontendSaveTestUrl.searchParams.set("temp_test_name", testPayload.name);
			return shell.openExternal(frontendSaveTestUrl.toString());
		},
	);

	public static saveTestDirectly: (testPayload: { events: iAction[]; name: string }, shouldAutorun: boolean, proxyConfig: any | null) => Promise<any> =
		createAuthorizedRequestFunc(async (authorizationOptions, testPayload, shouldAutorun = true, proxyConfig = null) => {
			const store = getStore();
			const selectedProject = getCurrentSelectedProjct(store.getState() as any);
			if (!selectedProject) throw new Error("No project selected!");

			return axios
				.post(
					resolveToBackend(`/projects/${selectedProject}/tests/actions/create`),
					{
						events: testPayload.events,
						shouldNotRunTests: !shouldAutorun,
						proxyUrlsMap: getProxyFromTunnelData(proxyConfig),
						name: testPayload.name || new Date().toDateString().substr(4, 6) + " " + new Date().toLocaleTimeString().substr(0, 10),
					},
					authorizationOptions,
				)
				.then((res) => res.data);
		});

	public static updateTest: (testId: string, testPayload: { events: iAction[] }) => Promise<any> = createAuthorizedRequestFunc(
		async (authorizationOptions, testId, testPayload) => {
			const tempTest = await axios
				.post(
					resolveToBackend("/tests/actions/save.temp"),
					{
						events: testPayload.events,
					},
					authorizationOptions,
				)
				.then((res) => res.data);

			return shell.openExternal(resolveToFrontend(`/?temp_test_id=${tempTest.insertId}&temp_test_type=update&update_test_id=${testId}`));
		},
	);

	public static updateTestDirectly: (testId: string, testPayload: { events: iAction[] }) => Promise<any> = createAuthorizedRequestFunc(
		(authorizationOptions, testId, testPayload) => {
			return axios
				.post(
					resolveToBackend(`/tests/${testId}/actions/update.steps`),
					{
						events: testPayload.events,
					},
					authorizationOptions,
				)
				.then((res) => res.data);
		},
	);

	public static async getReplayableTestActions(actions: iAction[], isMainTest: boolean): Promise<iAction[]> {
		const out = [];
		const browserActions: iAction[] = getBrowserActions(actions);
		if (isMainTest) {
			out.push(...browserActions);
		}
		const runAfterTest = browserActions.find((action) => action.type === ActionsInTestEnum.RUN_AFTER_TEST);
		if (runAfterTest) out.push(...(await this.getReplayableTestActions(await this.getTest(runAfterTest.payload.meta.value), false)));

		const mainActions: iAction[] = getMainActions(actions);
		if (!isMainTest) {
			mainActions.map((action) => {
				return action;
			});
		}
		out.push(...mainActions);

		return out;
	}
}

const getProxyFromTunnelData = (proxyUrlsMap: any | null) => {
	const proxyUrlsMapsRaw = proxyUrlsMap && Object.keys(proxyUrlsMap).length ? proxyUrlsMap : undefined;
	let proxyUrlsMapa = undefined;
	if (proxyUrlsMapsRaw) {
		proxyUrlsMapa = {};
		for (const key of Object.keys(proxyUrlsMap)) {
			proxyUrlsMapa[key] = { ...proxyUrlsMap[key], tunnel: proxyUrlsMap[key].tunnel.replace("https://", "http://") };
		}
	}

	return proxyUrlsMapa;
};

export { CloudCrusher };
