import { css, Global } from "@emotion/react";
import { ipcRenderer } from "electron";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { Store } from "redux";
import { setSessionInfoMeta } from "../../../../store/actions/app";
import { resetRecorder, setIsWebViewInitialized, setRecorderContext } from "../../../../store/actions/recorder";
import { TRecorderState, TRecorderVariant } from "../../../../store/reducers/recorder";
import { getAppSessionMeta } from "../../../../store/selectors/app";
import { getAllSteps, getCurrentDraftTest, getIsStatusBarVisible, getRecorderContext, getRecorderState } from "../../../../store/selectors/recorder";
import { IDeepLinkAction } from "../../../../types";
import {
	goFullScreen,
	performGetRecorderTestLogs,
	performReplayTest,
	performReplayTestUrlAction,
	performSaveLocalBuild,
	performSteps,
	resetStorage,
} from "../../../../ipc/perform";
import DeviceFrame from "../../containers/components/device-frame";
import { InfoOverLay } from "../../containers/components/overlays/infoOverlay";
import { Sidebar } from "./sidebar";
import { StatusBar } from "../../containers/components/status-bar";
import { sendSnackBarEvent } from "../../containers/components/toast";
import Toolbar from "../../containers/components/toolbar";
import historyInstance from "../../../utils/history";
import { useBuildNotifications } from "../../../hooks/tests";
import { addBuildNotification, clearCurrentLocalBuild, updateCurrentLocalBuild } from "../../../../store/actions/builds";
import { useAtom } from "jotai";
import { isStepHoverAtom } from "../../../store/jotai/testsPage";
import { CloudCrusher } from "../../../../lib/cloud";
import { clearAllToasts, clearToast, showToast } from "../../components/toasts";
import { getStore } from "../../../../store/configureStore";
import { getCurrentLocalBuild } from "../../../../store/selectors/builds";
import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";
import axios from "axios";
import { getAllDrafts, getDraft, updateDraftTest } from "../../../../api/tests/draft.tests";
import { useSearchParams } from "react-router-dom";
import { ShepherdTour, ShepherdTourContext } from 'react-shepherd'
import { motion } from "framer-motion"
import onboardingSteps from "./onboarding/steps";

const tourOptions = {
	defaultStepOptions: {
		cancelIcon: {
			enabled: true
		}
	},
	useModalOverlay: true
};

const handleCompletion = async (store: Store, action: IDeepLinkAction, addNotification, hasCompletedSuccesfully: boolean) => {
	// @TODO: Change `redirectAfterSuccess` to `isLocalBuild`
	const localBuild = getCurrentLocalBuild(store.getState());
	if (action.args.redirectAfterSuccess && window["testsToRun"]) {
		window["testsToRun"].list = window["testsToRun"].list.filter((testId) => testId !== action.args.testId);
		const logs = await performGetRecorderTestLogs();
		window["localRunCache"][action.args.testId] = {
			steps: logs,
			id: action.args.testId,
			status: hasCompletedSuccesfully ? "FINISHED" : "FAILED",
		};

		if (window["testsToRun"].list.length) {
			clearAllToasts();
			historyInstance.push("/recorder", {});
			goFullScreen();
			store.dispatch(setSessionInfoMeta({}));

			const progress = new Map(localBuild.progress);
			progress.set(action.args.testId, hasCompletedSuccesfully)
			store.dispatch(
				updateCurrentLocalBuild({
					queuedTests: window["testsToRun"].list,
					progress: progress,
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

			clearAllToasts();
			historyInstance.push("/", {});

			goFullScreen(false);
			store.dispatch(clearCurrentLocalBuild());
			sendSnackBarEvent({ type: "test_report", message: null, meta: { totalCount: totalTestsInBuild, buildReportStatus: localBuild.buildReportStatus } });
		}
	} else {
		if (hasCompletedSuccesfully) {
			showToast({
				type: "ready-for-edit",
				isUnique: true,
				message: "All steps completed, you can edit now",
			});
		}
	}
};

const handleUrlAction = (store: Store, addNotification, event: Electron.IpcRendererEvent, { action }: { action: IDeepLinkAction }) => {

	const runTest = (host: string | null = null) => {
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
		performReplayTest(action.args.testId, host).then((hasCompletedSuccesfully: boolean) => {
			handleCompletion(store, action, addNotification, hasCompletedSuccesfully);
		}).catch((err) => {
			console.error(err);
			handleCompletion(store, action, addNotification, false);
		})
	};

	switch (action.commandName) {
		case "run-local-build":
			// const { buildId } = action.args;
			// const buildReport = CloudCrusher.getBuildReport(buildId)
			break;
		case "run-test-from-build":
			const { testId, buildId } = action.args;
			store.dispatch(
				setRecorderContext({
					variant: TRecorderVariant.EDIT_TEST,
					origin: "deeplink",
					testId: testId,
					buildId: buildId,
				})
			);
			CloudCrusher.getBuildReport(buildId).then((buildReport) => {
				runTest(buildReport.host);
			});
			break;
		case "continue-draft-test":
			const { draftId } = action.args;
			axios(getDraft(draftId)).then((res) => {
				const { name, events } = res.data;

				store.dispatch(setRecorderContext({
					variant: TRecorderVariant.CREATE_TEST,
					origin: "app",
					startedAt: Date.now(),
					testName: name,
					draftId: draftId
				}));

				const eventsJSON = JSON.parse(events);
				performSteps(eventsJSON);
			}).catch((err) => {
				console.error("Error while fetching draft", err);
			})
			break;
		case "replay-test":
			const localBuild = getCurrentLocalBuild(store.getState());
			runTest(localBuild?.host);
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
	const [searchParams, setSearchParams] = useSearchParams();
	const store = useStore();
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);
	const recorderState = useSelector(getRecorderState);


	const handleDraftInterval = async () => {
		// Auto save
		const allSteps = getAllSteps(store.getState() as any);
		const recorderState = getRecorderState(store.getState() as any);
		const recorderContext = getRecorderContext(store.getState() as any);

		if (allSteps.length && recorderContext.draftId) {
			console.log("Auto saving now...");
			await axios(updateDraftTest({ events: allSteps as any }, recorderContext.draftId!));
			console.log("Auto saved");
		}
	};


	React.useEffect(() => {
		document.querySelector("html").style = "";
	}, []);

	React.useEffect(() => {
		const draftInterval = setInterval(handleDraftInterval, 10000);

		ipcRenderer.on("webview-initialized", () => {
			store.dispatch(setIsWebViewInitialized(true));
		});

		ipcRenderer.on("go-to-dashboard", () => {
			clearAllToasts();
			window.location.href = window.location.href.split("#")[0];
			goFullScreen(false);
		});
		const listener = handleUrlAction.bind(this, store, addNotification);
		ipcRenderer.on("url-action", listener);

		return () => {
			clearInterval(draftInterval);
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
		<ShepherdTour steps={onboardingSteps} tourOptions={tourOptions}>
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}>
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
				{/* <InfoOverLay /> */}
			</motion.div>
		</ShepherdTour>
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
		width: 100%;
		overflow-x: hidden;
		background: linear-gradient(
			90deg
			,#050505 15px,transparent 1%) 50%,linear-gradient(#050505 15px,transparent 1%) 50%,hsla(0,0%,100%,.16);
				background-size: 16px 16px;
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
		width: 8rem;
	}

	.custom-scroll::-webkit-scrollbar-track {
		background-color: #0a0b0e;
		box-shadow: none;
	}
	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #1b1f23;
		border-radius: 12rem;
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
	
	.shepherd-button{background:#3288e6;border:0;border-radius:3px;color:hsla(0,0%,100%,.75);cursor:pointer;margin-right:8rem;padding:8rem 24rem;transition:all .05s ease}.shepherd-button:not(:disabled):hover{background:#196fcc;color:hsla(0,0%,100%,.75)}.shepherd-button.shepherd-button-secondary{background:#f1f2f3;color:rgba(0,0,0,.75)}.shepherd-button.shepherd-button-secondary:not(:disabled):hover{background:#d6d9db;color:rgba(0,0,0,.75)}.shepherd-button:disabled{cursor:not-allowed}
	.shepherd-footer{border-bottom-left-radius:5px;border-bottom-right-radius:5px;display:flex;justify-content:flex-end;padding:12rem 12rem}.shepherd-footer .shepherd-button:last-child{margin-right:0}
	.shepherd-cancel-icon{background:transparent;border:none;color:hsla(0,0%,50%,.75);cursor:pointer;font-size:2em;font-weight:400;margin:0;padding:0;transition:color .5s ease}.shepherd-cancel-icon:hover{color:rgba(0,0,0,.75)}.shepherd-has-title .shepherd-content .shepherd-cancel-icon{color:hsla(0,0%,50%,.75)}.shepherd-has-title .shepherd-content .shepherd-cancel-icon:hover{color:rgba(0,0,0,.75)}
	.shepherd-title{color:rgba(0,0,0,.75);display:flex;flex:1 0 auto;font-size:16rem;font-weight:400;margin:0;padding:0}
	.shepherd-header{align-items:center;border-top-left-radius:5px;border-top-right-radius:5px;display:flex;justify-content:flex-end;line-height:2em;padding:12rem 12rem 0}.shepherd-has-title .shepherd-content .shepherd-header{background:#e6e6e6;padding:1em}
	.shepherd-text{color:rgba(0,0,0,.75);font-size:16rem;line-height:1.3em;padding:.75em}.shepherd-text p{margin-top:0}.shepherd-text p:last-child{margin-bottom:0}
	.shepherd-content{border-radius:5px;outline:none;padding:0}
	.shepherd-element{background:#fff;border-radius:5px;box-shadow:0 1px 4px rgba(0,0,0,.2);max-width:400px;opacity:0;outline:none;transition:opacity .3s,visibility .3s;visibility:hidden;width:100%;z-index:9999}.shepherd-enabled.shepherd-element{opacity:1;visibility:visible}.shepherd-element[data-popper-reference-hidden]:not(.shepherd-centered){opacity:0;pointer-events:none;visibility:hidden}.shepherd-element,.shepherd-element *,.shepherd-element :after,.shepherd-element :before{box-sizing:border-box}.shepherd-arrow,.shepherd-arrow:before{height:16px;position:absolute;width:16px;z-index:-1}.shepherd-arrow:before{background:#fff;content:"";transform:rotate(45deg)}.shepherd-element[data-popper-placement^=top]>.shepherd-arrow{bottom:-8px}.shepherd-element[data-popper-placement^=bottom]>.shepherd-arrow{top:-8px}.shepherd-element[data-popper-placement^=left]>.shepherd-arrow{right:-8px}.shepherd-element[data-popper-placement^=right]>.shepherd-arrow{left:-8px}.shepherd-element.shepherd-centered>.shepherd-arrow{opacity:0}.shepherd-element.shepherd-has-title[data-popper-placement^=bottom]>.shepherd-arrow:before{background-color:#e6e6e6}.shepherd-target-click-disabled.shepherd-enabled.shepherd-target,.shepherd-target-click-disabled.shepherd-enabled.shepherd-target *{pointer-events:none}
	.shepherd-modal-overlay-container{height:0;left:0;opacity:0;overflow:hidden;pointer-events:none;position:fixed;top:0;transition:all .3s ease-out,height 0ms .3s,opacity .3s 0ms;width:100vw;z-index:9997}.shepherd-modal-overlay-container.shepherd-modal-is-visible{height:100vh;opacity:.5;transform:translateZ(0);transition:all .3s ease-out,height 0s 0s,opacity .3s 0s}.shepherd-modal-overlay-container.shepherd-modal-is-visible path{pointer-events:all}

	.shepherd-element{
		border-radius: 18px 18px 18px 8px !important;

	}

	.shepherd-has-title .shepherd-content .shepherd-cancel-icon {
		margin-top: -14px !important;
	}

	.shepherd-footer{
		padding: 12rem 20rem !important;
		display: flex; 
		gap:12px;
	}
	.shepherd-footer button:not(:last-of-type) {
		border-right: solid 0px #2d2d2d !important;
	}
	.shepherd-logo {
		height: auto;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		width: 217px;
	  }
	  
	  
	  .shepherd-logo .open-eye {
		opacity: 1;
		visibility: visible;
	  }
	  
	  .shepherd-logo .lines,
	  .shepherd-logo .wink {
		opacity: 0;
		visibility: hidden;
	  }
	  
	  .shepherd-logo:hover .lines,
	  .shepherd-logo:hover .wink {
		opacity: 1;
		visibility: visible;
	  }
	  
	  .shepherd-logo:hover .open-eye {
		opacity: 0;
		visibility: hidden;
	  }
	  
	  
	  
	  .shepherd-button {
		background: #9f38de;

		border: 2px solid #54107d;
		border-radius: 8px;
		color: #fff;
		display: flex;
		flex-grow: 1;
		font-family: "GT Pressura", sans-serif;
		font-size: 13rem;
		justify-content: center;
		margin: 0;
		padding: 10rem 12rem;
		text-align: center;
		text-transform: uppercase;
	  }
	  
	  .shepherd-button:hover {
		background: #2d2d2d;
		color: #ffffff;
	  }
	  
	  .shepherd-button.shepherd-button-secondary {
		background: #0b0b0b;
		border: 2px solid #0b0b0b;
		color: grey;
	  }
	  
	  .shepherd-button.shepherd-button-secondary:hover {
		background: #0b0b0b;
		color: white;
	  }
	  
	  .shepherd-enabled.shepherd-element {
		opacity: 1;
		visibility: visible;
		border-radius: 0px;
		overflow: hidden;
	  }
	  
	  .shepherd-cancel-icon {
		font-family: "GT Pressura", sans-serif;
	  }
	  
	  .shepherd-element {
		border: solid 4px #2d2d2d;
	  }
	  
	  .shepherd-element,
	  .shepherd-header,
	  .shepherd-footer {
		border-radius: 0;
	  }
	  
	  .shepherd-element .shepherd-arrow {
		border-width: 0;
		height: auto;
		width: auto;
	  }
	  
	  .shepherd-arrow::before {
		display: none;
	  }
	  
	  .shepherd-element .shepherd-arrow:after {
		content: url('../assets/img/arrow.svg');
		display: inline-block;
	  }
	  
	  .shepherd-element[data-popper-placement^='top'] .shepherd-arrow,
	  .shepherd-element.shepherd-pinned-top .shepherd-arrow {
		bottom: -35px;
	  }
	  
	  .shepherd-element[data-popper-placement^='top'] .shepherd-arrow:after,
	  .shepherd-element.shepherd-pinned-top .shepherd-arrow:after {
		transform: rotate(270deg);
	  }
	  
	  .shepherd-element[data-popper-placement^='bottom'] .shepherd-arrow {
		top: -35px;
	  }
	  
	  .shepherd-element[data-popper-placement^='bottom'] .shepherd-arrow:after {
		transform: rotate(90deg);
	  }
	  
	  .shepherd-element[data-popper-placement^='left'] .shepherd-arrow,
	  .shepherd-element.shepherd-pinned-left .shepherd-arrow {
		right: -35px;
	  }
	  
	  .shepherd-element[data-popper-placement^='left'] .shepherd-arrow:after,
	  .shepherd-element.shepherd-pinned-left .shepherd-arrow:after {
		transform: rotate(180deg);
	  }
	  
	  .shepherd-element[data-popper-placement^='right'] .shepherd-arrow,
	  .shepherd-element.shepherd-pinned-right .shepherd-arrow {
		left: -35px;
	  }
	  
	  .shepherd-footer {
		padding: 0;
	  }
	  
	  .shepherd-footer button:not(:last-of-type) {
		border-right: solid 4px #2d2d2d;
	  }
	  
	  .shepherd-has-title .shepherd-content .shepherd-cancel-icon {
		margin-top: -7px;
	  }
	  
	  .shepherd-has-title .shepherd-content .shepherd-header {
		background: transparent;
		font-family: "Cera Pro", sans-serif;
		font-weight: 900;
		padding-bottom: 0;
		padding-left: 20rem;
		padding-top: 16rem;
	  }
	  
	  .shepherd-has-title .shepherd-content .shepherd-header .shepherd-title {
		font-size: 16rem;
		font-weight: 700;
	  }
	  
	  .shepherd-text {
		font-size: 14rem !important;
		line-height: 1.8;
		padding: 12rem 20rem !important;
	  }
	  
	  .shepherd-text a,
	  .shepherd-text a:visited,
	  .shepherd-text a:active {
		border-bottom: 1px dotted;
		border-bottom-color: rgba(0, 0, 0, 0.75);
		color: rgba(0, 0, 0, 0.75);
		text-decoration: none;
	  }
	  
	  .shepherd-text a:hover,
	  .shepherd-text a:visited:hover,
	  .shepherd-text a:active:hover {
		border-bottom-style: solid;
	  }
	  
	  
	  
	  .shepherd-button:not(:disabled):hover {
		background: #9f38de;
		color: #fff;
	  }
	  
	  p {
		font-family: 'Gilroy';
		font-size: 15px;
	  }
	  
	  .shepherd-text {
		font-size: 12rem;
		padding: 18rem 16rem;
	  }

	  #highlight-current{
		border: 2px solid #fd6cff !important;
		opacity: 1;
		background: #444244 !important;
	  }

	.shepherd-modal-overlay-container.shepherd-modal-is-visible {
		opacity: .8 !important;
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
