import React from "react";
import { css, Global } from "@emotion/react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { getIsStatusBarVisible, getRecorderInfo, getRecorderState, isWebViewInitialized } from "../store/selectors/recorder";
import Sidebar from "../ui/components/sidebar";
import Toolbar from "../ui/components/toolbar";
import DeviceFrame from "../ui/components/device-frame";
import { TRecorderState } from "../store/reducers/recorder";
import { StatusBar } from "../ui/components/status-bar";
import { InfoOverLay } from "../ui/components/overlays/infoOverlay";
import { ipcRenderer } from "electron";
import { resetRecorder, setIsWebViewInitialized } from "../store/actions/recorder";
import { IDeepLinkAction } from "../types";
import { Store } from "redux";
import { goFullScreen, performGetRecorderTestLogs, performReplayTest, performReplayTestUrlAction, performSaveLocalBuild, performSteps, resetStorage } from "../ui/commands/perform";
import { getAppSessionMeta } from "../store/selectors/app";
import { setSessionInfoMeta } from "../store/actions/app";
import { sendSnackBarEvent } from "../ui/components/toast";
import historyInstance from "./utils/history";

const handleCompletion = async (store: Store, action: IDeepLinkAction) => {

    // @TODO: Change `redirectAfterSuccess` to `isLocalBuild`
    console.log("Action args", action, window["testsToRun"]);
    if(action.args.redirectAfterSuccess && window["testsToRun"]) {
        window["testsToRun"].list = window["testsToRun"].list.filter(testId => testId !== action.args.testId);
        const logs = await performGetRecorderTestLogs();
        const recorderState = getRecorderState(store.getState());
        window["localRunCache"][action.args.testId] = { steps: logs, id: action.args.testId, status: recorderState.type !== TRecorderState.ACTION_REQUIRED? "FINISHED" : "FAILED"}

        if(window["testsToRun"].list.length) {
            historyInstance.push("/recorder", {});
            goFullScreen();
            store.dispatch(setSessionInfoMeta({}));
            performReplayTestUrlAction(window["testsToRun"].list[0], true);
          } else {
            // Time to redirect to dashboard
            const totalTestsInBuild = window["testsToRun"].count;
            window["testsToRun"] = undefined;
            const localBuild = await performSaveLocalBuild(Object.values(window["localRunCache"]));
            console.log("local build is", localBuild);
            window["localRunCache"] = undefined;
            // steps: Array<any>; id: number; name: string; status: "FINISHED" | "FAILED"
            window["localBuildReportId"] = localBuild.build.id;

            historyInstance.push("/", {});

            goFullScreen(false);
            sendSnackBarEvent({ type: "test_report", message: null, meta: { totalCount: totalTestsInBuild, buildReportStatus: localBuild.buildReportStatus }});
        }
    }
};


const handleUrlAction = (store: Store, event: Electron.IpcRendererEvent, { action }: { action: IDeepLinkAction }) => {
    switch(action.commandName) {
        case "replay-test":
			const sessionInfoMeta = getAppSessionMeta(store.getState() as any);
			store.dispatch(
				setSessionInfoMeta({
					...sessionInfoMeta,
					editing: {
						testId: action.args.testId,
				    },
				}),
			);
            
            performReplayTest(action.args.testId).finally(handleCompletion.bind(this, store, action))
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
    let navigate = useNavigate();
    
    const store = useStore();
    const recorderInfo = useSelector(getRecorderInfo);
    const isStatusBarVisible = useSelector(getIsStatusBarVisible);
    const recorderState = useSelector(getRecorderState);

    React.useEffect(() => {
		document.querySelector("html").style = "";
    }, []);

    React.useEffect(() => {
        ipcRenderer.on("webview-initialized", async (event: Electron.IpcRendererEvent, { initializeTime }) => {
			store.dispatch(setIsWebViewInitialized(true));
		});

        ipcRenderer.on("url-action", handleUrlAction.bind(this, store));

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
			}),
			resetStorage();
        }
    }, []);

    const dragableStyle = React.useMemo(() => dragableCss(), []);
    const contentStyle = React.useMemo(() => contentCss(), []);
    const toolbarStyle = React.useMemo(() => { toolbarCss(recorderState.type === TRecorderState.CUSTOM_CODE_ON) }, [recorderState]);

    return (
        <div>
            <div css={dragableStyle} className={"drag"}></div>
            <div css={contentStyle}>
                {!!recorderInfo.device ? <Sidebar css={sidebarCss} /> : ""}
                <div css={bodyCss}>
                        <Toolbar css={toolbarStyle} />
                        <DeviceFrame css={deviceFrameContainerCss} />
                        {isStatusBarVisible ? <StatusBar /> : ""}
                </div>
            </div>

            <Global styles={globalCss}/>
            <InfoOverLay />
        </div>
    )
};

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
        height: ${process.platform ==="darwin" ? `calc(100vh - 32px)` : "100vh"};
    `;
}
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
`;
const sidebarCss = css`
	padding: 1rem;
	width: 336rem;
`;
const bodyCss = css`
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	position: relative;
	z-index: 201;
`;
const toolbarCss = (isCUstomCodeOn: boolean) => {
    return css`
        background-color: #111213;
        padding: 5rem;
        min-height: 60rem;
        z-index: ${isCUstomCodeOn ? "-1" : "1"};
    `;
}
const deviceFrameContainerCss = css`
	flex: 1;
	overflow: auto;
`;
export { App }; 
