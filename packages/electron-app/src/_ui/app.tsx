import { css, Global } from "@emotion/react";
import { StepType, TourProvider, useTour } from "@reactour/tour";
import { ipcRenderer } from "electron";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Store } from "redux";
import { setSessionInfoMeta } from "../store/actions/app";
import { resetRecorder, setIsWebViewInitialized } from "../store/actions/recorder";
import { TRecorderState } from "../store/reducers/recorder";
import { getAppSessionMeta } from "../store/selectors/app";
import { getIsStatusBarVisible, getRecorderInfo, getRecorderState, getSavedSteps } from "../store/selectors/recorder";
import { IDeepLinkAction } from "../types";
import { goFullScreen, performGetRecorderTestLogs, performReplayTest, performReplayTestUrlAction, performSaveLocalBuild, performSteps, resetStorage } from "../ui/commands/perform";
import DeviceFrame from "../ui/components/device-frame";
import { InfoOverLay } from "../ui/components/overlays/infoOverlay";
import Sidebar from "../ui/components/sidebar";
import { StatusBar } from "../ui/components/status-bar";
import { sendSnackBarEvent } from "../ui/components/toast";
import Toolbar from "../ui/components/toolbar";
import historyInstance from "./utils/history";
import Wrapper from "figma-design-scaler/dist/dist/main";

const handleCompletion = async (store: Store, action: IDeepLinkAction) => {

    // @TODO: Change `redirectAfterSuccess` to `isLocalBuild`
    console.log("Action args", action, window["testsToRun"]);
    if(action.args.redirectAfterSuccess && window["testsToRun"]) {
        window["testsToRun"].list = window["testsToRun"].list.filter(testId => testId !== action.args.testId);
        const logs = await performGetRecorderTestLogs();
        const recorderState = getRecorderState(store.getState());
        window["localRunCache"][action.args.testId] = { steps: logs, id: action.args.testId, status: recorderState.type !== TRecorderState.ACTION_REQUIRED? "FINISHED" : "FAILED"};

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


const MoreStepsOnboarding = () => {
	const store = useStore();
	const [startingOffset, setStartingOffset] = React.useState(getSavedSteps(store.getState() as any).length);
	const savedSteps = useSelector(getSavedSteps);


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
const steps: Array<StepType> = [
	{
		selector: "#target-site-input",
		content: <OnboardingItem title={"Enter URL of website you want to test"} description={""} />,
	},
	{
		selector: "#select-element-action",
		content: <OnboardingItem title={"Turn on element mode"} description={"Select an element to record actions on it"} />,
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
		selector: "#current-modal",
		content: <OnboardingItem title={"Select a element action"} description={"You can click, hover, take screenshot or add assertions"} />,
        resizeObservables: ["#current-modal"],
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

function doArrow(position, verticalAlign, horizontalAlign) {
    const opositeSide = {
        top: "bottom",
        bottom: "top",
        right: "left",
        left: "right",
    };
    const popoverPadding = 10;

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
        <Wrapper figmaUrl={"https://www.figma.com/proto/MsJZCnY5NvrDF4kL1oczZq/Crusher-%7C-Aug?page-id=988%3A3439&node-id=988%3A3817&viewport=524%2C381%2C0.47&scaling=scale-down-width"}>
			<div>
				<div css={dragableStyle} className={"drag"}></div>
				<div css={contentStyle}>
				<Sidebar css={sidebarCss} />
					<div css={bodyCss}>
							<Toolbar css={toolbarStyle} />
							<DeviceFrame css={deviceFrameContainerCss} />
							{isStatusBarVisible ? <StatusBar /> : ""}
					</div>
				</div>

				<Global styles={globalCss}/>
				<InfoOverLay />
			</div>
        </Wrapper>
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
	width: 334rem;
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
        background-color: #09090A;
        padding: 5rem;
        min-height: 61rem;
        z-index: ${isCUstomCodeOn ? "-1" : "1"};
    `;
}
const deviceFrameContainerCss = css`
	flex: 1;
	overflow: auto;
`;
export { App };

