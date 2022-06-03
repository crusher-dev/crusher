import { app, BrowserWindow, ipcMain, session, shell, webContents, webFrame, webFrameMain } from "electron";
import windowStateKeeper from "electron-window-state";
import { APP_NAME } from "../../config/about";
import { encodePathAsUrl, getAppIconPath, getUserAccountProjects, getUserAccountTests, getUserInfoFromToken, sleep } from "../utils";
import { Emitter, Disposable } from "event-kit";
import { now } from "./now";
import { AnyAction, Store } from "redux";
import { Recorder } from "./recorder";
import { WebView } from "./webview";
import { iAction } from "@shared/types/action";
import { ActionsInTestEnum, ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { iDevice } from "@shared/types/extension/device";
import {
	recordStep,
	resetRecorderState,
	setDevice,
	setInspectElementSelectorMode,
	setInspectMode,
	setIsTestVerified,
	setSiteUrl,
	updateCurrentRunningStepStatus,
	updateRecordedStep,
	updateRecorderCrashState,
	updateRecorderState,
} from "../store/actions/recorder";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { getRecorderState, getSavedSteps, getTestName } from "../store/selectors/recorder";
import { CloudCrusher } from "../lib/cloud";
import { getBrowserActions, getMainActions } from "runner-utils/src";
import { iElementInfo, TRecorderState } from "../store/reducers/recorder";
import { iSeoMetaInformationMeta } from "../types";
import { getUserAgentFromName } from "@shared/constants/userAgents";
import { getAppEditingSessionMeta, getAppSessionMeta, getAppSettings, getRemainingSteps, getUserAccountInfo } from "../store/selectors/app";
import { resetAppSession, setSessionInfoMeta, setUserAccountInfo } from "../store/actions/app";
import { resolveToBackendPath, resolveToFrontEndPath } from "@shared/utils/url";
import { getGlobalAppConfig, writeGlobalAppConfig } from "../lib/global-config";
import template from "@crusher-shared/utils/templateString";
import { ILoggerReducer } from "../store/reducers/logger";
import { clearLogs, recordLog } from "../store/actions/logger";
import axios from "axios";
import { identify } from "../lib/analytics";

const debug = require("debug")("crusher:main");

export class AppWindow {
	private window: Electron.BrowserWindow;
	private splashWindow: Electron.BrowserWindow;
	private recorder: Recorder;
	private webView: WebView;
	private emitter = new Emitter();

	private store: Store<unknown, AnyAction>;

	private _loadTime: number | null = null;
	private _rendererReadyTime: number | null = null;

	private minWidth = 1028;
	private minHeight = 570;
	private savedWindowState: any = null;

	private shouldMaximizeOnShow = true;
	private useAdvancedSelectorPicker = false;

	public getWebContents() {
		return this.window.webContents;
	}

	public constructor(store: Store<unknown, AnyAction>) {
		debug("Constructor called");
		this.savedWindowState = windowStateKeeper({
			maximize: true,
		});
		this.recorder = new Recorder(store);
		this.store = store;

		const windowOptions: Electron.BrowserWindowConstructorOptions = {
			title: APP_NAME,
			titleBarStyle: "hidden",
			trafficLightPosition: { x: 30, y: 24 },
			width: this.minWidth,
			height: this.minHeight,
			minWidth: this.minWidth,
			minHeight: this.minHeight,
			autoHideMenuBar: true,
			show: true,
			frame: process.platform === "darwin" ? false : true,
			icon: getAppIconPath(),
			// This fixes subpixel aliasing on Windows
			// See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
			backgroundColor: "#111213",
			webPreferences: {
				// Disable auxclick event
				// See https://developers.google.com/web/updates/2016/10/auxclick
				nodeIntegration: true,
				enableRemoteModule: true,
				spellcheck: true,
				worldSafeExecuteJavaScript: false,
				contextIsolation: false,
				webviewTag: true,
				nodeIntegrationInSubFrames: true,
				webSecurity: false,
				nativeWindowOpen: true,
				devTools: true,
				enablePreferredSizeMode: true,
			},
			acceptFirstMouse: true,
		};

		this.window = new BrowserWindow(windowOptions);
		this.window.setFullScreenable(false);
		this.window.setResizable(false);

		this.splashWindow = new BrowserWindow({
			title: APP_NAME,
			autoHideMenuBar: true,
			show:false,
			frame: false,
			icon: getAppIconPath(),
			// This fixes subpixel aliasing on Windows
			// See https://github.com/atom/atom/commit/683bef5b9d133cb194b476938c77cc07fd05b972
			backgroundColor: "#111213",
			hasShadow: false,
			webPreferences: {
				nativeWindowOpen: true,
				enablePreferredSizeMode: true,
			}
		});

		this.splashWindow.loadURL(encodePathAsUrl(__dirname, "static/splash.html"));
	}

	public load() {
		let startLoad = 0;

		this.window.webContents.once("did-start-loading", () => {
			this._rendererReadyTime = null;
			this._loadTime = null;

			startLoad = now();
		});

		this.window.webContents.once("did-finish-load", () => {
			if (process.env.NODE_ENV === "development") {
				// this.window.webContents.openDevTools();
			}

			process.env.CRUSHER_SCALE_FACTOR = this.window.webContents.zoomFactor + "";

			this._loadTime = now() - startLoad;

			identify(4);

			console.log("Analaytics done!");

			this.maybeEmitDidLoad();
		});

		// Disable zoom-in/zoom-out
		this.window.webContents.on("did-finish-load", () => {
		});

		this.window.webContents.on("did-fail-load", () => {
			this.window.webContents.openDevTools();
			this.window.show();
		});

		this.window.webContents.on("did-attach-webview", this.handleWebviewAttached.bind(this));

		// @TODO: Remove this asap, this is only here as a workaround to not
		// having proper events for webview scrolling
		// setInterval(async () => {
		// 	try {
		// 		const recorderInfo = getRecorderInfo(this.store.getState() as any);

		// 		if (recorderInfo && recorderInfo.device && recorderInfo.device.width) {
		// 			await this.window.webContents.executeJavaScript(
		// 				`if(document.querySelector('webview')){ document.querySelector('webview').setZoomFactor(document.querySelector('webview').offsetWidth / ${recorderInfo.device.width}); }`,
		// 			);
		// 		}
		// 		process.env.CRUSHER_SCALE_FACTOR = this.window.webContents.zoomFactor * (this.webView ? this.webView.webContents.zoomFactor : 1) + "";
		// 	} catch (err) {}
		// }, 500);

		this.window.webContents.on("will-attach-webview", (event, webContents) => {
			webContents.nodeIntegrationInSubFrames = true;
			(webContents as any).disablePopups = false;
			webContents.enablePreferredSizeMode = true;
			return webContents;
		});

		ipcMain.once("renderer-ready", (event: Electron.IpcMainEvent, readyTime: number) => {
			this._rendererReadyTime = readyTime;
			console.log("Rendering time is", this._rendererReadyTime);
			this.splashWindow.destroy();
			setTimeout(() => {
				this.window.show();
			}, 200);

			this._rendererReadyTime = readyTime;
			this.sendMessage("url-action", { action: { commandName: "restore" } });

			this.maybeEmitDidLoad();
		});

		ipcMain.handle("perform-action", async (event, payload) => {
			this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_RECORDER_ACTIONS, {}));
			try {
				await this.handlePerformAction(event, payload);
				this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
			} catch (ex) {}
		});
		ipcMain.handle("turn-on-recorder-inspect-mode", this.turnOnInspectMode.bind(this));
		ipcMain.handle("turn-on-element-selector-inspect-mode", this.turnOnElementSelectorInspectMode.bind(this));
		ipcMain.handle("turn-off-element-selector-inspect-mode", this.turnOffElementSelectorInspectMode.bind(this));
		ipcMain.handle("turn-off-recorder-inspect-mode", this.turnOffInspectMode.bind(this));
		ipcMain.handle("verify-test", this.handleVerifyTest.bind(this));
		ipcMain.handle("run-tests", this.handleCloudRunTests.bind(this));
		ipcMain.handle("replay-test", this.handleRemoteReplayTest.bind(this));
		ipcMain.handle("replay-test-url-action", this.handleRemoteReplayTestUrlAction.bind(this));
		ipcMain.handle("update-test", this.handleUpdateTest.bind(this));
		ipcMain.handle("save-test", this.handleSaveTest.bind(this));
		ipcMain.handle("save-step", this.handleSaveStep.bind(this));
		ipcMain.handle("go-back-page", this.handleGoBackPage.bind(this));
		ipcMain.handle("reload-page", this.handleReloadPage.bind(this));
		ipcMain.handle("get-page-seo-info", this.handleGetPageSeoInfo.bind(this));
		ipcMain.handle("get-element-assert-info", this.handleGetElementAssertInfo.bind(this));
		ipcMain.handle("continue-remaining-steps", this.continueRemainingSteps.bind(this));
		ipcMain.handle("reset-test", this.handleResetTest.bind(this));
		ipcMain.handle("reset-app-session", this.handleResetAppSession.bind(this));
		ipcMain.handle("focus-window", this.focusWindow.bind(this));
		ipcMain.handle("save-n-get-user-info", this.handleSaveNGetUserInfo.bind(this));
		ipcMain.handle("get-user-tests", this.handleGetUserTests.bind(this));
		ipcMain.handle("get-build-report", this.handleGetBuildReport.bind(this));
		ipcMain.handle("update-cloud-test-name", this.handleUpdateCloudTestName.bind(this));
		ipcMain.handle("jump-to-step", this.handleJumpToStep.bind(this));
		ipcMain.handle("login-with-github", this.handleLoginWithGithub.bind(this));
		ipcMain.handle("login-with-gitlab", this.handleLoginWithGitlab.bind(this));
		ipcMain.handle("go-full-screen", this.handleGoFullScreen.bind(this));
		ipcMain.handle("get-cloud-user-info", this.handleGetCloudUserInfo.bind(this));
		ipcMain.on("recorder-can-record-events", this.handleRecorderCanRecordEvents.bind(this));
		ipcMain.handle("quit-and-restore", this.handleQuitAndRestore.bind(this));
		ipcMain.handle("perform-steps", this.handlePerformSteps.bind(this));
		ipcMain.handle("enable-javascript-in-debugger", this.handleEnableJavascriptInDebugger.bind(this));
		ipcMain.handle("disable-javascript-in-debugger", this.disableJavascriptInDebugger.bind(this));
		ipcMain.handle("save-code-template", this.handleSaveCodeTemplate.bind(this));
		ipcMain.handle("get-code-templates", this.handleGetCodeTemplates.bind(this));
		ipcMain.handle("update-code-template", this.handleUpdateCodeTemplate.bind(this));
		ipcMain.handle("delete-code-template", this.handleDeleteCodeTemplate.bind(this));
		ipcMain.handle("reset-storage", this.handleResetStorage.bind(this));
		ipcMain.on("get-var-context", this.handleGetVarContext.bind(this));
		ipcMain.on("get-is-advanced-selector", this.handleGetVarContext.bind(this));

		this.window.on("focus", () => this.window.webContents.send("focus"));
		this.window.on("blur", () => this.window.webContents.send("blur"));

		/* Loads crusher app */
		this.window.webContents.setVisualZoomLevelLimits(1, 3);
		if(app.commandLine.hasSwitch("open-recorder")) {
			process.argv = process.argv.filter((a) => a !== "--open-recorder");
			const projectId = app.commandLine.getSwitchValue("projectId");

			this.window.webContents.executeJavaScript(`window.localStorage.setItem("projectId", ${projectId});`);
			this.window.loadURL(encodePathAsUrl(__dirname, "index.html") + "#/recorder");
			this.handleGoFullScreen(null, {fullScreen: true});
		} else {
			this.window.loadURL(encodePathAsUrl(__dirname, "index.html"));
		}
	}

	private async handleCloudRunTests(event: Electron.IpcMainEvent, payload: { projectId: string; testIds: Array<string> | undefined }) {
		const userAccountInfo = getUserAccountInfo(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);

		return CloudCrusher.runTests(payload.testIds, payload.projectId, userAccountInfo.token, appSettings.backendEndPoint);
	}


	private handleGetAdvancedSelector(event: Electron.IpcMainEvent, payload: any) {
		event.returnValue = this.useAdvancedSelectorPicker;
	}
	private handleGetVarContext(event: Electron.IpcMainEvent, payload: any) {
		const context = this.webView.playwrightInstance.getContext();
		event.returnValue = Object.keys(context).reduce((prev, current) => {
			// Get typescript type of current, CustomClass | string | number | boolean | undefined | null
			const type = typeof context[current];
			return { ...prev, [current]: type };
		}, {});
	}

	private async handleUpdateCodeTemplate(event: Electron.IpcMainEvent, payload: { id: number; name: string; code: string }) {
		// await this.store.dispatch(updateCodeTemplate(payload.id, payload.codeTemplate));
		// pdate.codeTemplate
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.post(
				resolveToBackendPath("teams/actions/update.codeTemplate", appSettings.backendEndPoint),
				{ id: payload.id, name: payload.name, code: payload.code },
				{
					headers: {
						Accept: "application/json, text/plain, */*",
						"Content-Type": "application/json",
						Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
					},
				},
			)
			.then((res) => {
				return res.data;
			});
	}

	private async handleDeleteCodeTemplate(event: Electron.IpcMainEvent, payload: { id: string }) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.post(
				resolveToBackendPath("teams/actions/delete.codeTemplate", appSettings.backendEndPoint),
				{ id: payload.id },
				{
					headers: {
						Accept: "application/json, text/plain, */*",
						"Content-Type": "application/json",
						Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
					},
				},
			)
			.then((res) => {
				return res.data;
			});
	}

	private async handleSaveCodeTemplate(event, payload: { createPayload: any }) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.post(resolveToBackendPath("teams/actions/save.code", appSettings.backendEndPoint), payload.createPayload, {
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
					Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
				},
			})
			.then((res) => {
				return res.data;
			});
	}

	private async handleGetCodeTemplates(event) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		if (!accountInfo || !accountInfo.token) {
			console.log("Account info is", accountInfo);
			return null;
		}
		const appSettings = getAppSettings(this.store.getState() as any);

		return axios
			.get(resolveToBackendPath("teams/actions/get.codeTemplates", appSettings.backendEndPoint), {
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
					Cookie: `isLoggedIn=true; token=${accountInfo.token}`,
				},
			})
			.then((res) => {
				return res.data;
			});
	}

	private async disableJavascriptInDebugger() {
		if (this.window) {
			return this.webView._disableExecution();
		}
	}
	private async handleEnableJavascriptInDebugger() {
		if (this.webView) {
			return this.webView._resumeExecution();
		}
	}

	private async handlePerformSteps(event, payload: { steps: any }) {
		await this.resetRecorder();
		await this.handleReplayTestSteps(payload.steps);
	}

	private async handleQuitAndRestore() {
		app.relaunch({args: [...process.argv.slice(1), "--open-recorder"]});
		app.quit();
	}

	private async handleJumpToStep(event: Electron.IpcMainEvent, payload: { stepIndex: number }) {
		const recorderSteps = getSavedSteps(this.store.getState() as any);
		await this.resetRecorder();
		const appSettings = getAppSettings(this.store.getState() as any);
		this.setRemainingSteps(recorderSteps.slice(payload.stepIndex + 1) as any);
		await this.handleReplayTestSteps(recorderSteps.slice(0, payload.stepIndex + 1) as any);
		return true;
	}

	private handleRecorderCanRecordEvents(event: Electron.IpcMainEvent) {
		const recorderState = getRecorderState(this.store.getState() as any);
		event.returnValue = recorderState.type !== TRecorderState.PERFORMING_ACTIONS;
	}

	private async handleGetUserTests(event: Electron.IpcMainEvent, payload: { projectId: string }) {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);

		const userTests = await getUserAccountTests(payload.projectId, accountInfo.token, appSettings.backendEndPoint);
		return userTests;
	}

	private async setGlobalCrusherAccountInfo(info: any) {
		const globalAppConfig = getGlobalAppConfig();
		writeGlobalAppConfig({ ...globalAppConfig, userInfo: info });
	}
	// Workaround to limitation of setting Cookie through XHR in renderer process
	private async handleSaveNGetUserInfo(event, payload: { token: string }) {
		const appSettings = getAppSettings(this.store.getState() as any);
		const userInfo = await getUserInfoFromToken(payload.token, appSettings.backendEndPoint);
		this.store.dispatch(setUserAccountInfo(userInfo));

		this.setGlobalCrusherAccountInfo(userInfo);
		return userInfo;
	}
	// Set focus to our recorder window
	private focusWindow() {
		this.window.focus();
	}

	private getLastRecordedStep(store: Store<unknown, AnyAction>, shouldNotIgnoreScroll = false) {
		const steps = getSavedSteps(store.getState() as any);
		if (shouldNotIgnoreScroll) {
			return { step: steps[steps.length - 1], index: steps.length - 1 };
		}

		for (let i = steps.length - 1; i >= 0; i--) {
			// Scrolls might happen during internal navigation, so ignore them
			if (![ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL].includes(steps[i].type)) {
				return { step: steps[i], index: i };
			}
		}

		return null;
	}

	recordLog(log: ILoggerReducer["logs"][0]) {
		this.store.dispatch(recordLog(log));
	}

	updateRecorderState(state) {
		this.store.dispatch(updateRecorderState(state, {}));
	}

	updateRecorderCrashState(stateMeta) {
		console.log("Update crash recorder");
		this.store.dispatch(updateRecorderCrashState(stateMeta));
	}

	async handleResetAppSession() {
		await this.webView.dispose();
		await this.store.dispatch(resetAppSession());
		await this.resetRecorder();
	}

	async handleResetTest(event: Electron.IpcMainEvent, payload: { device: iDevice }) {
		await this.webView.dispose();
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const navigationStep = recordedSteps.find((step) => step.type === ActionsInTestEnum.NAVIGATE_URL);
		await this.resetRecorder();

		await this.store.dispatch(setDevice(payload.device.id));
		await this.store.dispatch(setSiteUrl(template(navigationStep.payload.meta.value, { ctx: {} })));
		// Playwright context has issues when set to about:blank
	}

	handleSaveStep(event: Electron.IpcMainInvokeEvent, payload: { action: iAction }) {
		const { action } = payload;
		if(!this.webView.playwrightInstance) return;
		const elementInfo = this.webView.playwrightInstance.getElementInfoFromUniqueId(action.payload.meta?.uniqueNodeId);
		if (elementInfo && elementInfo.parentFrameSelectors) {
			action.payload.meta = {
				...(action.payload.meta || {}),
				parentFrameSelectors: elementInfo.parentFrameSelectors,
			};
		}

		if (action.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION) {
			const lastRecordedStep = this.getLastRecordedStep(this.store);
			if (!lastRecordedStep) return;
			if (lastRecordedStep.step.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION) {
				this.store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
			} else {
				if (lastRecordedStep.step.type !== ActionsInTestEnum.NAVIGATE_URL) {
					this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
				}
			}
		} else if (action.type === ActionsInTestEnum.ADD_INPUT) {
			const lastRecordedStep = this.getLastRecordedStep(this.store);
			if (
				lastRecordedStep.step.type === ActionsInTestEnum.ADD_INPUT &&
				lastRecordedStep.step.payload.meta?.uniqueNodeId === action.payload.meta?.uniqueNodeId
			) {
				this.store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
			} else {
				this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
			}
		} else if ([ActionsInTestEnum.PAGE_SCROLL, ACTIONS_IN_TEST.ELEMENT_SCROLL].includes(action.type)) {
			const lastRecordedStep = this.getLastRecordedStep(this.store, true);
			console.log(
				"Scroll values",
				action.payload.meta?.uniqueNodeId,
				lastRecordedStep.step.payload.meta?.uniqueNodeId,
				lastRecordedStep.step.type,
				action.type,
			);
			if (
				[ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL].includes(lastRecordedStep.step.type) &&
				action.payload.meta?.uniqueNodeId === lastRecordedStep.step.payload.meta?.uniqueNodeId
			) {
				action.payload.meta.value = [...lastRecordedStep.step.payload.meta.value, action.payload.meta.value];
				this.store.dispatch(updateRecordedStep(action, lastRecordedStep.index));
			} else {
				action.payload.meta.value = [action.payload.meta.value];
				this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
			}
		} else {
			if (action.type === ActionsInTestEnum.NAVIGATE_URL) {
				this.store.dispatch(recordStep(action, ActionStatusEnum.STARTED));
			} else {
				this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
			}
		}
	}

	reinstateElementSteps(uniqueElementId, elementInfo) {
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const stepsToReinstate = recordedSteps
			.map((step, index) => ({ step, index }))
			.filter((step) => {
				return step.step.payload.meta?.uniqueNodeId === uniqueElementId;
			});

		stepsToReinstate.map((a) => {
			a.step.payload.meta = {
				...(a.step.payload.meta || {}),
				parentFrameSelectors: elementInfo.parentFrameSelectors,
			};
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.store.dispatch(updateRecordedStep(a.step, a.index));
		});
	}

	async continueRemainingSteps(event: Electron.IpcMainEvent, payload: { extraSteps?: Array<iAction> | null }) {
		const { extraSteps } = payload;
		let remainingSteps = getRemainingSteps(this.store.getState() as any);
		await this.setRemainingSteps(null);

		if (extraSteps) {
			remainingSteps = remainingSteps ? [...extraSteps, ...remainingSteps] : [...extraSteps];
		}
		if (remainingSteps) {
			await this.handleReplayTestSteps(remainingSteps);
		}
		this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
	}

	async handleGetElementAssertInfo(event: Electron.IpcMainEvent, elementInfo: iElementInfo) {
		try { await this.webView._resumeExecution(); } catch (e) { console.error("Enabling exection failed", e); }
		await new Promise((resolve) => setTimeout(resolve, 500));
		const elementHandle = this.webView.playwrightInstance.getElementInfoFromUniqueId(elementInfo.uniqueElementId)?.handle;
		if (!elementHandle) {
			return null;
		}
		const attributes = await elementHandle.evaluate((element, args) => {
			const attributeNamesArr: Array<string> = (element as HTMLElement).getAttributeNames();
			return attributeNamesArr.map((attributeName) => {
				return {
					name: attributeName,
					value: (element as HTMLElement).getAttribute(attributeName),
				};
			});
		});

		const assertElementInfo = {
			innerHTML: await elementHandle.innerHTML(),
			innerText: await elementHandle.innerText(),
			attributes: attributes,
		};

		const elementTagName = await (
			await elementHandle.evaluateHandle((element: HTMLElement) => {
				return element.tagName.toUpperCase();
			}, [])
		).jsonValue();

		if (elementTagName === "INPUT") {
			const valueAttribute = attributes.find((attribute) => attribute.name.toLowerCase() === "value");
			if (valueAttribute) {
				valueAttribute.value = await elementHandle.inputValue();
			} else {
				assertElementInfo.attributes.push({
					name: "value",
					value: await elementHandle.inputValue(),
				});
			}
		}
		try { await this.webView._disableExecution(); } catch(ex) { console.error("Disabling execution failed", ex); }
		return assertElementInfo;
	}

	async handleGetPageSeoInfo(event: Electron.IpcMainEvent, url: string) {
		return {
			title: await this.webView.playwrightInstance.page.title(),
			metaTags: (await this.webView.playwrightInstance.page.evaluate(() => {
				const metaTags = document.querySelectorAll("meta");
				return Array.from(metaTags)
					.map((meta) => {
						return {
							name: meta.getAttribute("name"),
							value: meta.content,
						};
					})
					.filter((a) => !!a.name)
					.reduce((prev, current) => {
						if (current.name) {
							prev[current.name] = current;
						}
						return prev;
					}, {});
			})) as iSeoMetaInformationMeta,
		};
	}

	getRecorderState() {
		return getRecorderState(this.store.getState() as any);
	}

	async handleGoBackPage() {
		/* Todo: Add wait for this, and keep track of the back page */
		this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));
		this.webView.webContents.goBack();
		this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
	}

	async handleReloadPage() {
		this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));
		const savedSteps = getSavedSteps(this.store.getState() as any);

		this.store.dispatch(
			recordStep({
				type: ActionsInTestEnum.RELOAD_PAGE,
				payload: {},
			}),
		);

		this.webView.webContents.reload();

		await this.webView.playwrightInstance.page.waitForNavigation({ waitUntil: "networkidle" });

		/* Change this to back */
		this.store.dispatch(updateCurrentRunningStepStatus(ActionStatusEnum.COMPLETED));

		this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
	}

	async handleUpdateTest(event: Electron.IpcMainEvent) {
		const editingSessionMeta = getAppEditingSessionMeta(this.store.getState() as any);
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);

		const projectId = await this.window.webContents.executeJavaScript("window.localStorage.getItem('projectId');");
		const accountInfo = getUserAccountInfo(this.store.getState() as any);

		if(projectId && accountInfo) {
			await CloudCrusher.updateTestDirectly(recordedSteps as any, editingSessionMeta.testId, accountInfo.token, appSettings.backendEndPoint, appSettings.frontendEndPoint);
		} else {
		await CloudCrusher.updateTest(recordedSteps as any, editingSessionMeta.testId, appSettings.backendEndPoint, appSettings.frontendEndPoint);
		}

		return 1;
	}

	private async handleGetBuildReport(event: Electron.IpcMainEvent, payload: { buildId: string }) {
		console.log("Got report", payload.buildId);
		const userAccountInfo = getUserAccountInfo(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);
		const buildReport = await CloudCrusher.getBuildReport(payload.buildId, userAccountInfo.token, appSettings.backendEndPoint, appSettings.frontendEndPoint);
		console.log("Got this build report", buildReport, payload.buildId);
		return buildReport;
	}

	private async handleUpdateCloudTestName(event: Electron.IpcMainEvent, payload: { testId: string, testName: string }) {
		const userAccountInfo = getUserAccountInfo(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);
		await CloudCrusher.updateTestName(payload.testId, payload.testName, userAccountInfo.token, appSettings.backendEndPoint, appSettings.frontendEndPoint);
		return true;
	}

	async handleSaveTest() {
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);
		const testName = getTestName(this.store.getState() as any);

		const projectId = await this.window.webContents.executeJavaScript("window.localStorage.getItem('projectId');");
		let testRecord = null;
		if (app.commandLine.hasSwitch("exit-on-save")) {
			const projectId = app.commandLine.getSwitchValue("projectId");

			testRecord = await CloudCrusher.saveTestDirectly(
				recordedSteps as any,
				projectId,
				app.commandLine.getSwitchValue("token"),
				appSettings.backendEndPoint,
				appSettings.frontendEndPoint,
				testName,
			);

		} else {
			const accountInfo = getUserAccountInfo(this.store.getState() as any);

			if(projectId && accountInfo) {

				testRecord = await CloudCrusher.saveTestDirectly(
					recordedSteps as any,
					projectId,
					app.commandLine.getSwitchValue("token") || accountInfo.token,
					appSettings.backendEndPoint,
					appSettings.frontendEndPoint,
					testName,
				);
			} else {
				await CloudCrusher.saveTest(recordedSteps as any, appSettings.backendEndPoint, appSettings.frontendEndPoint, testName);
			}
		}

		return testRecord;
	}

	async handleVerifyTest(event, payload) {
		const { shouldAlsoSave } = payload;
		const recordedSteps = getSavedSteps(this.store.getState() as any);
		await this.resetRecorder(TRecorderState.PERFORMING_ACTIONS);

		await this.handleReplayTestSteps(recordedSteps as any);
		this.store.dispatch(setIsTestVerified(true));
		if (shouldAlsoSave) {
			return this.handleSaveTest();
		}
	}

	async handleRemoteReplayTest(event: Electron.IpcMainInvokeEvent, payload: { testId: number }) {
		await this.resetRecorder();
		const appSettings = getAppSettings(this.store.getState() as any);
		const testSteps = await CloudCrusher.getTest(`${payload.testId}`, appSettings.backendEndPoint);

		return this.handleReplayTestSteps(testSteps);
	}

	async handleRemoteReplayTestUrlAction(event: Electron.IpcMainInvokeEvent, payload: { testId: number, redirectAfterSuccess: boolean }) {
		this.sendMessage("url-action", { action: { commandName: "replay-test", args: {testId: payload.testId, redirectAfterSuccess: payload.redirectAfterSuccess} } });
	};

	private async handleLoginWithGithub(event: Electron.IpcMainInvokeEvent) {
		const appSettings = getAppSettings(this.store.getState() as any);
		console.log("URL is", resolveToFrontEndPath(`/`, appSettings.frontendEndPoint));

		await shell.openExternal(resolveToFrontEndPath(`/`, appSettings.frontendEndPoint));
	}
	private handleLoginWithGitlab(event: Electron.IpcMainInvokeEvent) {
		return shell.openExternal("https://youtube.com");
	}

	private handleGoFullScreen(event: Electron.IpcMainInvokeEvent, payload: { fullScreen: boolean }) {
		if (payload.fullScreen) {
			if (process.platform === "darwin") {
				this.window.setTrafficLightPosition({ x: 10, y: 8 });
			}
			this.window.setFullScreenable(true);
			this.window.setResizable(true);
			return this.window.maximize();
		} else {
			return new Promise((resolve) => {
				this.window.unmaximize();
				this.window.setFullScreen(false);
				setImmediate(async () => {
					if (process.platform === "darwin") {
						this.window.setTrafficLightPosition({ x: 30, y: 24 });
					}
					this.window.setFullScreenable(false);
					this.window.setResizable(false);
					this.window.setSize(this.minWidth, this.minHeight);

					resolve(this.window.center());
				});

			})


		}
	}

	private async handleGetCloudUserInfo() {
		const accountInfo = getUserAccountInfo(this.store.getState() as any);
		const appSettings = getAppSettings(this.store.getState() as any);

		const userInfo = await getUserAccountProjects(accountInfo.token, appSettings.backendEndPoint);
		return userInfo;
	}

	private setRemainingSteps(steps: Array<iAction>) {
		const sessionInfoMeta = getAppSessionMeta(this.store.getState() as any);
		this.store.dispatch(
			setSessionInfoMeta({
				...sessionInfoMeta,
				remainingSteps: steps,
			}),
		);
	}

	async handleReplayTestSteps(steps: Array<iAction> | null = null) {
		this.store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));
		const appSettings = getAppSettings(this.store.getState() as any);

		const browserActions = getBrowserActions(steps);
		const mainActions = getMainActions(steps);

		const reaminingSteps = [...browserActions, ...mainActions];

		try {
			for (const browserAction of browserActions) {
				reaminingSteps.shift();

				if (browserAction.type === ActionsInTestEnum.SET_DEVICE) {
					await this.store.dispatch(setDevice(browserAction.payload.meta.device.id));
					await this.handlePerformAction(null, { action: browserAction, shouldNotSave: false });
				} else {
					if (browserAction.type !== ActionsInTestEnum.RUN_AFTER_TEST) {
						// @Todo: Add support for future browser actions
						this.store.dispatch(recordStep(browserAction, ActionStatusEnum.COMPLETED));
					} else {
						await this.handleRunAfterTest(browserAction);
					}
				}
			}

			for (const savedStep of mainActions) {
				reaminingSteps.shift();

				await this.handlePerformAction(null, { action: savedStep });
			}
			this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
		} catch (ex) {
			this.store.dispatch(updateRecorderState(TRecorderState.ACTION_REQUIRED, {}));
			console.log("Remaining steps are", reaminingSteps);
			this.setRemainingSteps(reaminingSteps);
			throw ex;
		}
	}

	private turnOnInspectMode() {
		this.store.dispatch(setInspectMode(true));
		this.webView._turnOnInspectMode();
		// this.webView.webContents.focus();
	}

	private turnOnElementSelectorInspectMode() {
		this.store.dispatch(setInspectElementSelectorMode(true));
		this.useAdvancedSelectorPicker = true;

		this.webView._turnOnInspectMode();
		this.webView._resumeExecution();
		this.webView.webContents.focus();
	}

	private turnOffElementSelectorInspectMode() {
		this.store.dispatch(setInspectElementSelectorMode(false));
		this.useAdvancedSelectorPicker = false;
		this.webView._turnOffInspectMode();
		this.webView.webContents.focus();
	}

	private turnOffInspectMode() {
		this.store.dispatch(setInspectMode(false));
		this.webView._turnOffInspectMode();
		this.webView.webContents.focus();
	}

	private async clearWebViewStorage() {
		return session.fromPartition("crusherwebview").clearStorageData({
			storages: ["cookies", "localstorage", "indexdb"],
		});
	}

	private async handleResetStorage() {
		console.log("Resetting storage");
		await this.clearWebViewStorage();
	}

	private async handlePerformAction(event: Electron.IpcMainInvokeEvent, payload: { action: iAction; shouldNotSave?: boolean; isRecording?: boolean }) {
		const { action, shouldNotSave } = payload;
		console.log("Handle perform action called", payload);
		try {
			switch (action.type) {
				case ActionsInTestEnum.SET_DEVICE: {
					this.store.dispatch(setDevice(action.payload.meta.device.id));
					// Custom implementation here, because we are in the recorder
					const userAgent = action.payload.meta?.device.userAgentRaw
						? action.payload.meta?.device.userAgentRaw
						: getUserAgentFromName(action.payload.meta?.device.userAgent).value;
					if (this.webView) {
						this.webView.webContents.setUserAgent(userAgent);
					}
					app.userAgentFallback = userAgent;

					if (!shouldNotSave) {
						this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
					}
					break;
				}
				case ActionsInTestEnum.NAVIGATE_URL: {
					this.store.dispatch(setSiteUrl(template(action.payload.meta.value, { ctx: {} })));
					await this.webView.playwrightInstance.runActions([action], !!shouldNotSave);
					break;
				}
				case ActionsInTestEnum.RUN_AFTER_TEST: {
					await this.resetRecorder();
					this.store.dispatch(
						updateRecorderState(TRecorderState.PERFORMING_ACTIONS, { type: ActionsInTestEnum.RUN_AFTER_TEST, testId: action.payload.meta.value }),
					);
					await this.handleRunAfterTest(action, true);
					await this.handlePerformAction(null, {
						action: {
							type: ActionsInTestEnum.NAVIGATE_URL,
							payload: {
								selectors: [],
								meta: {
									value: this.webView.webContents.getURL(),
								},
							},
						},
						shouldNotSave: false,
					});
					this.store.dispatch(updateRecorderState(TRecorderState.RECORDING_ACTIONS, {}));
					break;
				}
				case ActionsInTestEnum.RELOAD_PAGE: {
					this.webView.webContents.reload();
					await this.webView.playwrightInstance.page.waitForNavigation({ waitUntil: "networkidle" });
					if (!shouldNotSave) {
						this.store.dispatch(recordStep(action, ActionStatusEnum.COMPLETED));
					}
					break;
				}
				default:
					console.log("Running this action", action);
					if (payload.isRecording && action.payload.meta?.uniqueNodeId) {
						const elementInfo = this.webView.playwrightInstance.getElementInfoFromUniqueId(action.payload.meta?.uniqueNodeId);
						if (elementInfo && elementInfo.parentFrameSelectors) {
							action.payload.meta = {
								...(action.payload.meta || {}),
								parentFrameSelectors: elementInfo.parentFrameSelectors,
							};
						}
					}
					await this.webView.playwrightInstance.runActions([action], !!shouldNotSave);
					break;
			}
			await sleep(1000);
		} catch (e) {
			this.store.dispatch(updateRecorderState(TRecorderState.ACTION_REQUIRED, {}));
			throw e;
		}
	}

	private async resetRecorder(state: TRecorderState = null) {
		this.store.dispatch(resetRecorderState(state));
		this.store.dispatch(clearLogs());
		if (this.webView) {
			await this.webView.webContents.loadURL("about:blank");
		}
		await this.clearWebViewStorage();
	}

	private async handleRunAfterTest(action: iAction, shouldRecordSetDevice = false) {
		const appSettings = getAppSettings(this.store.getState() as any);

		try {
			const testSteps = await CloudCrusher.getTest(action.payload.meta.value, appSettings.backendEndPoint);

			const replayableTestSteps = await CloudCrusher.getReplayableTestActions(testSteps, true, appSettings.backendEndPoint);
			const browserActions = getBrowserActions(replayableTestSteps);

			for (const browserAction of browserActions) {
				if (browserAction.type === ActionsInTestEnum.SET_DEVICE) {
					await this.handlePerformAction(null, { action: browserAction, shouldNotSave: shouldRecordSetDevice ? false : true });
				} else {
					if (browserAction.type !== ActionsInTestEnum.RUN_AFTER_TEST) {
						this.store.dispatch(recordStep(browserAction, ActionStatusEnum.COMPLETED));
					}
				}
			}

			this.store.dispatch(recordStep(action, ActionStatusEnum.STARTED));

			for (const savedStep of getMainActions(replayableTestSteps)) {
				await this.handlePerformAction(null, { action: savedStep, shouldNotSave: true });
			}

			action.status = ActionStatusEnum.COMPLETED as any;
			const savedSteps = getSavedSteps(this.store.getState() as any);
			this.store.dispatch(updateRecordedStep(action, savedSteps.length - 1));

			return testSteps;
		} catch (e) {
			action.status = ActionStatusEnum.FAILED as any;

			const savedSteps = getSavedSteps(this.store.getState() as any);
			this.store.dispatch(updateRecordedStep(action, savedSteps.length - 1));
			this.store.dispatch(updateRecorderState(TRecorderState.ACTION_REQUIRED, {}));

			throw e;
		}
	}

	async handleWebviewAttached(event, webContents) {
		this.webView = new WebView(this);
		this.webView.webContents.on("dom-ready", () => {
			if (!this.webView.webContents.debugger.isAttached()) {
				this.webView.initialize();
				console.log("Webview initialized");
			}
		});
	}

	public getRecorder() {
		return this.recorder;
	}

	public focusWebView(): Promise<void> {
		return this.window.webContents.executeJavaScript("document.querySelector('webview').focus();");
	}

	public sendMessage(channel: string, ...args: any[]): void {
		return this.window.webContents.send(channel, ...args);
	}

	/** Send the app launch timing stats to the renderer. */
	public sendLaunchTimingStats(stats: { mainReadyTime: number; loadTime: number; rendererReadyTime: number }) {
		this.window.webContents.send("launch-timing-stats", { stats });
	}

	/**
	 * Emit the `onDidLoad` event if the page has loaded and the renderer has
	 * signalled that it's ready.
	 */
	private maybeEmitDidLoad() {
		if (!this.rendererLoaded) {
			return;
		}

		this.emitter.emit("did-load", null);
	}

	private get rendererLoaded(): boolean {
		return !!this.loadTime && !!this.rendererReadyTime;
	}

	/**
	 * Get the time (in milliseconds) spent loading the page.
	 *
	 * This will be `null` until `onDidLoad` is called.
	 */
	public get loadTime(): number | null {
		return this._loadTime;
	}

	/**
	 * Get the time (in milliseconds) elapsed from the renderer being loaded to it
	 * signaling it was ready.
	 *
	 * This will be `null` until `onDidLoad` is called.
	 */
	public get rendererReadyTime(): number | null {
		return this._rendererReadyTime;
	}

	public isMinimized() {
		return this.window.isMinimized();
	}

	/** Is the window currently visible? */
	public isVisible() {
		return this.window.isVisible();
	}

	public restore() {
		this.window.restore();
	}

	public focus() {
		this.window.focus();
	}

	/** Show the window. */
	public show() {
		this.window.show();
		if (this.shouldMaximizeOnShow) {
			// Only maximize the window the first time it's shown, not every time.
			// Otherwise, it causes the problem described in desktop/desktop#11590
			this.shouldMaximizeOnShow = false;
		}
	}

	/**
	 * Register a function to call when the window is done loading. At that point
	 * the page has loaded and the renderer has signalled that it is ready.
	 */
	public onDidLoad(fn: () => void): Disposable {
		return this.emitter.on("did-load", fn);
	}

	public onClose(fn: () => void) {
		this.window.on("closed", fn);
	}

	public destroy() {
		this.window.destroy();
	}
}
