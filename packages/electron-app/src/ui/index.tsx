import React from "react";
import { css, Global } from "@emotion/react";
import { render } from "react-dom";
import Toolbar from "./components/toolbar";
import DeviceFrame from "./components/device-frame";
import Sidebar from "./components/sidebar";
import "../../static/assets/styles/tailwind.css";
import configureStore from "../store/configureStore";
import {Provider, useSelector, useStore} from "react-redux";
import { getInitialStateRenderer } from "electron-redux";
import { ipcRenderer } from "electron";
import {resetRecorder, setIsWebViewInitialized} from "../store/actions/recorder";
import {getIsStatusBarVisible, getRecorderInfo, getRecorderState, getSavedSteps} from "../store/selectors/recorder";
import {goFullScreen, performGetRecorderTestLogs, performReplayTest, performReplayTestUrlAction, performSaveLocalBuild, performSteps, resetStorage} from "./commands/perform";
import { iReduxState } from "../store/reducers/index";
import { IDeepLinkAction } from "../types";
import { setSessionInfoMeta, setSettngs, setShowShouldOnboardingOverlay, setUserAccountInfo } from "../store/actions/app";
import { getAppSessionMeta } from "../store/selectors/app";
import { sendSnackBarEvent, ToastSnackbar } from "./components/toast";
import { TRecorderState } from "../store/reducers/recorder";
import { webFrame } from "electron";
import { StepType, TourProvider, useTour } from "@reactour/tour";
import { getGlobalAppConfig } from "../lib/global-config";
import {Route, HashRouter, Routes, useNavigate} from "react-router-dom";
import { DashboardScreen } from "./screens/dashboard";
import { LoginScreen } from "./screens/login";
import { CreateTestScreen } from "./screens/createTest";
import { SelectProjectScreen } from "./screens/selectProject";
import { StatusBar } from "./components/status-bar";
import { UnDockCodeScreen } from "./screens/undockCode";
import { InfoOverLay } from "./components/overlays/infoOverlay";
import SettingsScreen from "./screens/settings";
import { AuthOnboardingScreen } from "./screens/authOnboarding";

webFrame.setVisualZoomLevelLimits(1, 3);

const App = () => {
	let navigate = useNavigate();

	const store = useStore();
	const recorderInfo = useSelector(getRecorderInfo);
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);
	const recorderState = useSelector(getRecorderState);

	React.useEffect(() => {
		document.querySelector("html").style = "";
		//@ts-ignore
		// document.body.querySelector("#welcome_splash").style.display = "none";
		ipcRenderer.on("webview-initialized", () => {
            store.dispatch(setIsWebViewInitialized(true));
        });

		ipcRenderer.send("renderer-ready", /* @TODO Add correct rendering time */ window["performance"].now());

		ipcRenderer.on("url-action", (event: Electron.IpcRendererEvent, { action }: { action: IDeepLinkAction }) => {
			if (action.commandName === "replay-test") {
                const sessionInfoMeta = getAppSessionMeta(store.getState() as any);
                store.dispatch(
					setSessionInfoMeta({
						...sessionInfoMeta,
						editing: {
							testId: action.args.testId,
						},
					}),
				);

                const handleCompletion = () => {
					if (action.args.redirectAfterSuccess) {
						let testsCompleted = true;
						let totalCount = 1;
						if (window["testsToRun"]) {
							totalCount = window["testsToRun"].count;
							window["testsToRun"].list = window["testsToRun"].list.filter((a) => a !== action.args.testId);
							if (!window["testsToRun"].list.length) {
								window["testsToRun"] = null;
							} else {
								testsCompleted = false;
							}
						}
						window["triggeredTest"] = { id: -1, type: "local" };

						// navigate("/");
						if (testsCompleted) {
							performGetRecorderTestLogs().then((res) => {
								performSaveLocalBuild([{
									steps: res,
									id: action.args.testId,
									name: action.args.testName || "Some random name",
									status: "FINISHED",
								}]).then((res) => {
									console.log("Saved local build", res);
									(window as any).localBuildReportId = res;
								}).catch((err) => {
									console.error("Error while saving local build", err);
								});
								console.log("Recorder Test logs", res);
								navigate("/");
								goFullScreen(false);
								sendSnackBarEvent({ type: "test_report", message: null, meta: { totalCount } });
							});

						}
						if (!testsCompleted) {
							// goFullScreen(false);

							navigate("/recorder");
							goFullScreen();
							store.dispatch(setSessionInfoMeta({}));
							performReplayTestUrlAction(window["testsToRun"].list[0], true);
						}
					}
				};
                performReplayTest(action.args.testId)
                    .then(() => {
                        handleCompletion();
                    })
                    .catch(() => {
                        if (window["testsToRun"]) {
                            handleCompletion();
                        }
                    });
            } else if (action.commandName === "restore" && window.localStorage.getItem("saved-steps")) {
                const savedSteps = JSON.parse(window.localStorage.getItem("saved-steps") || "[]");
                console.log("Saved steps are", savedSteps);
                window.localStorage.removeItem("saved-steps");
                performSteps(savedSteps);
            }
		});

		return () => {
            ipcRenderer.removeAllListeners("url-action");
            ipcRenderer.removeAllListeners("renderer-ready");
            ipcRenderer.removeAllListeners("webview-initialized");
            store.dispatch(resetRecorder());
            store.dispatch(setSessionInfoMeta({}));
            const sessionInfoMeta = getAppSessionMeta(store.getState() as any);

            setSessionInfoMeta({
				...sessionInfoMeta,
				remainingSteps: [],
			});

            resetStorage();
        };
	}, []);

	return (<>
        <div
            css={[
                css`
                    height: 32px;
                    width: 100%;
                    background: #111213;
                    border-bottom: 1px solid #2c2c2c;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `,
                process.platform !== "darwin"
                    ? css`
                            display: none;
                      `
                    : undefined,
            ]}
            className={"drag"}
        >
            <div
                css={css`
                    color: #fff;
                    font-size: 13.5px;
                    font-weight: bold;
                    display: flex;
                    flex: 1;
                    justify-content: center;
                `}
            ></div>
            <div
                css={css`
                    margin-left: auto;
                    font-size: 14px;
                    margin-right: 8px;
                `}
                className={"no-drag"}
            >
                <div
                    css={css`
                        padding: 4px;
                        :hover {
                            opacity: 0.5;
                        }
                    `}
                ></div>
            </div>
        </div>
        <div
            css={[
                containerStyle,
                process.platform !== "darwin"
                    ? css`
                            height: 100vh;
                      `
                    : undefined,
            ]}
        >
            <Global styles={globalStyles} />
            {recorderInfo.device ? <Sidebar css={sidebarStyle} /> : ""}
            <div css={bodyStyle}>
                <Toolbar
                    css={[
                        toolbarStyle,
                        isStatusBarVisible && recorderState.type === TRecorderState.CUSTOM_CODE_ON
                            ? css`
                                    z-index: -1;
                              `
                            : undefined,
                    ]}
                />
                <DeviceFrame css={deviceFrameContainerStyle} />

                {isStatusBarVisible ? <StatusBar /> : ""}
            </div>
        </div>
        <InfoOverLay />
    </>);
};

App.whyDidYouRender = true;

const containerStyle = css`
	display: flex;
	background: #020202;
	width: 100%;
	overflow-x: hidden;
	height: 100vh;
	color: white;
	height: calc(100vh - 32px);
`;
const bodyStyle = css`
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	position: relative;
	z-index: 201;
`;
const sidebarStyle = css`
	padding: 1rem;
	width: 336rem;
`;
const toolbarStyle = css`
	background-color: #111213;
	padding: 5rem;
	min-height: 60rem;
`;
const deviceFrameContainerStyle = css`
	flex: 1;
	overflow: auto;
`;
const globalStyles = css`
	body {
		margin: 0;
		padding: 0;
		min-height: "100vh";
		max-width: "100vw";
	}
	.custom-scroll::-webkit-scrollbar {
		width: 12rem;
	}

	.custom-scroll::-webkit-scrollbar-track {
		background-color: #0a0b0e;
		box-shadow: none;
	}

	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #1b1f23;
		border-radius: 100rem;
	}

	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #272b31;
		border-radius: 100rem;
	}
`;

const initialReduxState: iReduxState = getInitialStateRenderer();
initialReduxState.app.shouldShowOnboardingOverlay = !(localStorage.getItem("app.showShouldOnboardingOverlay") === "false");
if (!localStorage.getItem("app.settings")) {
	initialReduxState.app.settings.backendEndPoint = process.env.BACKEND_URL;
	initialReduxState.app.settings.frontendEndPoint = process.env.FRONTEND_URL;
}
const globalAppConfig = getGlobalAppConfig();

if (localStorage.getItem("app.settings"))
    initialReduxState.app.settings = JSON.parse(localStorage.getItem("app.settings"));

const store = configureStore(initialReduxState, "renderer");
if (globalAppConfig?.userInfo) {
	store.dispatch(setUserAccountInfo(globalAppConfig.userInfo));
}
// Weirdly main process store doesn't get updated, this will fix it
store.dispatch(setSettngs(initialReduxState.app.settings));
store.dispatch(setShowShouldOnboardingOverlay(initialReduxState.app.shouldShowOnboardingOverlay));

const MoreStepsOnboarding = () => {
	const store = useStore();
	const [startingOffset] = React.useState(getSavedSteps(store.getState() as any).length);
	const savedSteps = useSelector(getSavedSteps);
	const { setCurrentStep } = useTour();

	React.useEffect(() => {
		if (savedSteps.length - startingOffset === 5) {
			setCurrentStep(6);
		}
	}, [savedSteps]);

	return (
		<div>
			<div
				css={css`
					font-family: Cera Pro;
					font-size: 15rem;
					font-weight: 600;
				`}
			>
				We automatically detect your actions
			</div>
			<p
				className={"mt-8"}
				css={css`
					font-family: Gilroy;
					font-size: 14rem;
				`}
			>
				Let's record few more steps in our test and finally save it
			</p>
			<div
				className={"mt-4"}
				css={css`
					position: absolute;
					font-size: 12rem;
				`}
			>
				{savedSteps.length - startingOffset}/5
			</div>
		</div>
	);
};

const OnboardingItem = ({ title, description }) => {
	return (
		<div>
			<div
				css={css`
					font-family: Cera Pro;
					font-size: 15rem;
					font-weight: 600;
				`}
			>
				{title}
			</div>
			<p
				className={"mt-8"}
				css={css`
					font-family: Gilroy;
					font-size: 14rem;
				`}
			>
				{description}
			</p>
		</div>
	);
};
const steps: StepType[] = [
	{
		selector: "#target-site-input",
		content: <OnboardingItem title={"Enter URL of website you want to test"} description={"You can open crusher-recorder from apps or CLI."} />,
	},
	{
		selector: "#select-element-action",
		content: <OnboardingItem title={"Turn on element mode"} description={"Right click over the element or click here"} />,
	},
	{
		selector: "#device_browser",
		content: <OnboardingItem title={"Select an element"} description={"Move your mouse over the element and click on it"} />,
	},
	{
		selector: "#element-actions-list",
		content: <OnboardingItem title={"Select a element action"} description={"You can click, hover, take screenshot or add assertions"} />,
	},
	{
		selector: "#device_browser",
		content: <MoreStepsOnboarding />,
	},
	{
		selector: "#verify-save-test",
		content: <OnboardingItem title={"Verify and Save"} description={"Time to save your first test"} />,
	},
];

const opositeSide = {
	top: "bottom",
	bottom: "top",
	right: "left",
	left: "right",
};
const popoverPadding = 10;

function doArrow(position, verticalAlign, horizontalAlign) {
	if (!position || position === "custom") {
		return {};
	}

	const width = 16;
	const height = 12;
	const color = "#111213";
	const isVertical = position === "top" || position === "bottom";
	const spaceFromSide = popoverPadding;
	const obj = {
		[isVertical ? "borderLeft" : "borderTop"]: `${width / 2}px solid transparent`, // CSS Triangle width
		[isVertical ? "borderRight" : "borderBottom"]: `${width / 2}px solid transparent`, // CSS Triangle width
		[`border${position[0].toUpperCase()}${position.substring(1)}`]: `${height}px solid ${color}`, // CSS Triangle height
		[isVertical ? opositeSide[horizontalAlign] : verticalAlign]: height + spaceFromSide, // space from side
		[opositeSide[position]]: -height + 2,
	};

	return {
		"&::after": {
			content: "''",
			width: 0,
			height: 0,
			position: "absolute",
			...obj,
		},
	};
}

render(
	<Provider store={store}>
		<HashRouter>
			<ToastSnackbar />
			<style>
				{`
				.drag {
					-webkit-app-region: drag;
				}
				.no-drag {
					-webkit-app-region: no-drag;
				}
			`}
			</style>
			<Routes>
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/onboarding" element={<AuthOnboardingScreen />} />
				<Route path="/" element={<DashboardScreen />} />
				<Route path="/select-project" element={<SelectProjectScreen />} />
				<Route path="/create-test" element={<CreateTestScreen />} />
				<Route path="/code-editor" element={<UnDockCodeScreen />} />
				<Route path="/settings" element={<SettingsScreen />} />

				<Route
					path="/recorder"
					element={
						<TourProvider
							onClickMask={() => { }}
							disableDotsNavigation={true}
							disableKeyboardNavigation={true}
							showPrevNextButtons={false}
							disableFocusLock={true}
							showBadge={false}
							styles={{
								popover: (base, state) => ({
									...base,
									background: "linear-gradient(0deg, #111213, #111213), rgba(10, 11, 14, 0.4)",
									border: "0.5px solid rgba(255, 255, 255, 0.1)",
									borderRadius: "8rem",
									color: "#fff",
									fontSize: "14rem",
									minWidth: "400rem",
									...doArrow(state.position, state.verticalAlign, state.horizontalAlign),
								}),
							}}
							steps={steps}
						>
							<App />
						</TourProvider>
					}
				/>
			</Routes>
		</HashRouter>
	</Provider>,
	document.querySelector("#app-container"),
);
