import { css, Global } from "@emotion/react";
import { ipcRenderer } from "electron";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { Store } from "redux";
import { setSessionInfoMeta } from "../store/actions/app";
import { resetRecorder, setIsWebViewInitialized } from "../store/actions/recorder";
import { TRecorderState } from "../store/reducers/recorder";
import { getAppSessionMeta } from "../store/selectors/app";
import { getIsStatusBarVisible, getRecorderState } from "../store/selectors/recorder";
import { IDeepLinkAction } from "../types";
import {
	goFullScreen,
	performGetRecorderTestLogs,
	performReplayTest,
	performReplayTestUrlAction,
	performSaveLocalBuild,
	performSteps,
	resetStorage,
} from "./commands/perform";
import DeviceFrame from "./ui/containers/components/device-frame";
import { InfoOverLay } from "./ui/containers/components/overlays/infoOverlay";
import { Sidebar } from "./ui/screens/recorder/sidebar";
import { StatusBar } from "./ui/containers/components/status-bar";
import { sendSnackBarEvent } from "./ui/containers/components/toast";
import Toolbar from "./ui/containers/components/toolbar";
import historyInstance from "./utils/history";
import { useBuildNotifications } from "./hooks/tests";
import { addBuildNotification, clearCurrentLocalBuild, updateCurrentLocalBuild } from "../store/actions/builds";
import { useAtom } from "jotai";
import { isStepHoverAtom } from "./store/jotai/testsPage";
import { CloudCrusher } from "../lib/cloud";

const handleCompletion = async (store: Store, action: IDeepLinkAction, addNotification) => {
	// @TODO: Change `redirectAfterSuccess` to `isLocalBuild`
	console.log("Action args", action, window["testsToRun"]);
	if (action.args.redirectAfterSuccess && window["testsToRun"]) {
		window["testsToRun"].list = window["testsToRun"].list.filter((testId) => testId !== action.args.testId);
		const logs = await performGetRecorderTestLogs();
		const recorderState = getRecorderState(store.getState());
		window["localRunCache"][action.args.testId] = {
			steps: logs,
			id: action.args.testId,
			status: recorderState.type !== TRecorderState.ACTION_REQUIRED ? "FINISHED" : "FAILED",
		};

		if (window["testsToRun"].list.length) {
			historyInstance.push("/recorder", {});
			goFullScreen();
			store.dispatch(setSessionInfoMeta({}));
			store.dispatch(
				updateCurrentLocalBuild({
					queuedTests: window["testsToRun"].list,
				} as any),
			);
			performReplayTestUrlAction(window["testsToRun"].list[0], true, action.args.selectedTests || []);
		} else {
			// Time to redirect to dashboard
			const totalTestsInBuild = window["testsToRun"].count;
			window["testsToRun"] = undefined;
			const localBuild = await performSaveLocalBuild(Object.values(window["localRunCache"]));
			window["localRunCache"] = undefined;
			// steps: Array<any>; id: number; name: string; status: "FINISHED" | "FAILED"
			window["localBuildReportId"] = localBuild.build.id;
			addNotification({ id: localBuild.build.id });
			store.dispatch(
				addBuildNotification({
					id: localBuild.build.id,
					status: localBuild.buildReportStatus,
					meta: { build: localBuild },
					time: Date.now(),
				}),
			);

			historyInstance.push("/", {});

			goFullScreen(false);
			store.dispatch(clearCurrentLocalBuild());
			sendSnackBarEvent({ type: "test_report", message: null, meta: { totalCount: totalTestsInBuild, buildReportStatus: localBuild.buildReportStatus } });
		}
	}
};

const handleUrlAction = (store: Store, addNotification, event: Electron.IpcRendererEvent, { action }: { action: IDeepLinkAction }) => {
	switch (action.commandName) {
		case "run-local-build":
			// const { buildId } = action.args;
			// const buildReport = CloudCrusher.getBuildReport(buildId)
			break;
		case "replay-test":
			const sessionInfoMeta = getAppSessionMeta(store.getState() as any);
			const { selectedTests } = action.args;

			console.log("Selected tests are", selectedTests);
			const currentTest = selectedTests?.length ? selectedTests.find((test) => test.id === action.args.testId) : null;
			store.dispatch(
				setSessionInfoMeta({
					...sessionInfoMeta,
					editing: {
						testId: action.args.testId,
					},
					selectedTest: currentTest,
				}),
			);
			performReplayTest(action.args.testId).finally(handleCompletion.bind(this, store, action, addNotification));
			break;
		case "restore":
			if (window.localStorage.getItem("saved-steps")) {
				const savedSteps = JSON.parse(window.localStorage.getItem("saved-steps"));
				window.localStorage.removeItem("saved-steps");
				performSteps(savedSteps);
			}
			break;
		default:
			console.error("Invalid URL action: ", action);
	}
};

const App = () => {
	const { addNotification } = useBuildNotifications();
	const store = useStore();
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);
	const recorderState = useSelector(getRecorderState);

	React.useEffect(() => {
		document.querySelector("html").style = "";
	}, []);

	React.useEffect(() => {
		ipcRenderer.on("webview-initialized", () => {
			store.dispatch(setIsWebViewInitialized(true));
		});

		ipcRenderer.on("go-to-dashboard", () => {
			historyInstance.push("/", {});
			goFullScreen(false);
		});
		const listener = handleUrlAction.bind(this, store, addNotification);
		ipcRenderer.on("url-action",listener);

		return () => {
			ipcRenderer.removeListener("url-action", listener);
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

	const dragableStyle = React.useMemo(() => dragableCss(), []);
	const contentStyle = React.useMemo(() => contentCss(), []);
	const toolbarStyle = React.useMemo(() => {
		toolbarCss(recorderState.type === TRecorderState.CUSTOM_CODE_ON);
	}, [recorderState]);

	return (
		// <Wrapper figmaUrl={"https://www.figma.com/proto/MsJZCnY5NvrDF4kL1oczZq/Crusher-%7C-Aug?node-id=2305%3A6559&scaling=min-zoom&page-id=2305%3A5930"}>
		// </Wrapper>
		<div>
			<div css={dragableStyle} className={"drag"}></div>
			<div css={contentStyle}>
				<Sidebar css={sidebarCss} />
				<div css={bodyCss} className="relative">
					<StepHoverOverlay />
					<Toolbar css={toolbarStyle} />
					<DeviceFrame css={deviceFrameContainerCss} />
					{isStatusBarVisible ? <StatusBar /> : ""}
				</div>
			</div>
			<Global styles={globalCss} />
			<InfoOverLay />
		</div>
	);
};

const StepHoverOverlay = () => {
	const [isStepHovered] = useAtom(isStepHoverAtom);
	const [show, setShow] = React.useState(false);
	React.useEffect(() => {
		let interval;
		interval = setTimeout(() => {
				setShow(isStepHovered);
		}, 25);

		return () => {
			interval && clearInterval(interval);
		}
	}, [isStepHovered]);
	if (!show) {
		return null
	}
	return (<div css={overLayCSS}></div>)
}

const overLayCSS = css`
	position: absolute;
	top: 0;
	width: 100%;
	min-height: 100vh;
	background: rgba(0, 0, 0, 0.75);
	z-index: 22;
    backdrop-filter: blur(3px);
`

const dragableCss = () => {
	return css`
		min-height: 32px;
		width: 100%;
		background: #111213;
		border-bottom: 1px solid #2c2c2c;
		justify-content: center;
		align-items: center;
		display: ${process.platform === "darwin" ? "flex" : "none"};
	`;
};
const contentCss = () => {
	return css`
		display: flex;
		background: #020202;
		width: 100%;
		overflow-x: hidden;
		color: white;
		height: ${process.platform === "darwin" ? `calc(100vh - 32px)` : "100vh"};
	`;
};
const globalCss = css`
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
	[data-radix-popper-content-wrapper] {
		z-index: 1001 !important;

		[role="menu"] {
			min-width: 180rem !important;
			[role="menuitem"] {
				font-size: 12rem !important;
			}
		}
	}
`;
const sidebarCss = css`
	width: 332rem;
`;
const bodyCss = css`
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 201;
	overflow: hidden;
`;
const toolbarCss = (isCUstomCodeOn: boolean) => {
	return css`
		background-color: #09090a;
		padding: 5rem;
		min-height: 61rem;
		z-index: ${isCUstomCodeOn ? "-1" : "1"};
	`;
};
const deviceFrameContainerCss = css`
	flex: 1;
	overflow: auto;
`;
export { App };
