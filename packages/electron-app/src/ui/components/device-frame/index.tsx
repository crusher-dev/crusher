import React from "react";
import { css } from "@emotion/react";
import { getRecorderCrashState, getRecorderInfo, getRecorderState, isInspectElementSelectorModeOn, isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import * as url from "url";
import { IpcMessageEvent } from "electron";
import { performQuitAndRestore, turnOffElementSelectorInspectMode, turnOffInspectMode, turnOnInspectMode } from "../../commands/perform";
import { recordStep, setSelectedElement } from "electron-app/src/store/actions/recorder";
import { saveAutoAction } from "../../commands/saveActions";
import { TRecorderMessagesType } from "../../../lib/recorder/host-proxy";
import { TRecorderCrashState, TRecorderState } from "electron-app/src/store/reducers/recorder";
import { InfoOverLay } from "../overlays/infoOverlay";
import { MiniCrossIcon, StopIcon } from "../../icons";
import { Button } from "@dyson/components/atoms";

const CrashScreen = (props: any) => {
	const store = useStore();
	
	return (
		<div
		css={css`
			width: 100%;
			height: 100%;
			background: transparent;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 999;
			background: rgba(0, 0, 0, 0.96);
			color: #fff;
			font-size: 14rem;
			display: flex;
			color: rgba(255, 255, 255, 0.57)
			font-family: Gilroy;
		`}
	>
		<div css={css`display: flex; flex-direction: column; justify-content: center; padding: 0rem 54rem;`}>
			<StopIcon css={css`width: 24rem; height: 24rem;`}/>
			<div className={"mt-18"} css={css`font-family: Cera Pro; color: rgba(255, 255, 255, 0.83); font-size: 18rem; font-weight: bold;`}>Aw, Snap!</div>
			<div className="mt-10">Something went wrong while displaying this page</div>
			<div className="mt-16">ERROR_CODE: RESPONSE_504_ERROR</div>

			<div className="mt-44" css={css`display: flex; align-items: center;`}>
				<Button onClick={()=>{}} bgColor="tertiary-outline" css={buttonStyle}>
					Retry step
				</Button>
				<div onClick={ performQuitAndRestore.bind(this, store) } css={css`:hover { opacity: 0.7; }`} className="ml-18">
					Quit & Restore Session
				</div>
			</div>
		</div>
	</div>
	);
};

const PageLoadFailedScreen = (props: any) => {
	const store = useStore();
	
	return (
		<div
		css={css`
			width: 100%;
			height: 100%;
			background: transparent;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 999;
			background: rgba(0, 0, 0, 0.96);
			color: #fff;
			font-size: 14rem;
			display: flex;
			color: rgba(255, 255, 255, 0.57)
			font-family: Gilroy;
		`}
	>
		<div css={css`display: flex; flex-direction: column; justify-content: center; padding: 0rem 54rem;`}>
			<StopIcon css={css`width: 24rem; height: 24rem;`}/>
			<div className={"mt-18"} css={css`font-family: Cera Pro; color: rgba(255, 255, 255, 0.83); font-size: 18rem; font-weight: bold;`}>This site can't be reached!</div>
			<div className="mt-10">Something went wrong while loading the url</div>
			<div className="mt-16">ERROR_CODE: URL_NOT_REACHABLE</div>

			<div className="mt-44" css={css`display: flex; align-items: center;`}>
				<Button onClick={()=>{}} bgColor="tertiary-outline" css={buttonStyle}>
					Retry step
				</Button>
				<div onClick={ performQuitAndRestore.bind(this, store) } css={css`:hover { opacity: 0.7; }`} className="ml-18">
					Quit & Restore Session
				</div>
			</div>
		</div>
	</div>
	);
};

const StatusBar = (props: any) => {
	const [clicked, setClicked] = React.useState(false);

	const LogItem = (props: any) => {
		return (
			<div css={css`padding-top: 16rem; display: flex;`}>
			<div>
				<span css={css`font-size: 14rem; color: #9FC370; font-family: Gilroy;`}>info</span>
				<span css={css`font-size: 14rem; color: #717171; font-family: Gilroy;`} className={"ml-20"}>Loading env to work with different stuff</span>
			</div>
			<div css={css`margin-left: auto;`}>
				<span css={css`color: #525252; font-size: 12.5rem; font-family: Gilroy;`}>0.5 sec</span>
			</div>
		</div>
		)
	};

	return (
	<>
		<div id={`logsTab`} className={`${clicked ? "expandBar" : ""}`} css={statusBarContainerStyle}>
			<div css={css`display: flex; align-items: center; height: 100%; max-height: 32rem; 	padding: 0rem 14rem;     border-bottom: 1px solid #2c2c2c;`}>
				<div onClick={setClicked.bind(this, !clicked)} css={statusBarTabStyle}>Logs <span className="ml-4" css={logsCountStyle}>12</span></div>

				<Conditional showIf={!clicked}>
					<div css={logTextStyle} className={"ml-20"}>Peforming: Navigating to https://google.com</div>
				</Conditional>

				<Conditional showIf={clicked}>
					<div css={css`margin-left: auto;`}>
						<div onClick={setClicked.bind(this, !clicked)} css={css`padding: 4rem 5rem; :hover { svg{ opacity: 0.7; } background: rgba(0, 0, 0, 0.2); opacity: 0.8; }`}>
							<MiniCrossIcon css={css`width: 10rem; height: 10rem; opacity: 0.44; `}/>
						</div>
					</div>
				</Conditional>
			</div>

			<Conditional showIf={clicked}>
				<div css={css`color: #fff; font-size: 14rem; padding: 0rem 14rem; padding-bottom: 8rem; height: 100%; overflow-y: auto;`} className={"custom-scroll"}>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
					<LogItem/>
				</div>
			</Conditional>
		</div>

		<style>{`
			.expandBar {
				max-height: 312rem;
			}
		`}
		</style>
	</>
	)
};

const logTextStyle = css`
	color: #717171;
	font-size: 13.5rem;
	font-family: Gilroy;
`;
const logsCountStyle = css`
	background: rgba(196, 196, 196, 0.1);
	border-radius: 6rem;
	font-size: 12rem;
	font-family: Cera Pro;
	color: rgba(255,255,255,0.7);
	padding: 4rem;
`;

const statusBarTabStyle = css`
	font-size: 14rem;
	font-family: Cera Pro;
	color: #8568D5;

	:hover {
		opacity: 0.8;
	}
`;
const statusBarContainerStyle = css`
	background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #0F1010;
	border: 1px solid #272D2D;
	width: 100%;
    max-height: 32rem;
	height: 100%;
	position: absolute;
	bottom: 0rem;
	transition: max-height 0.1s;  
`;

const DeviceFrame = (props: any) => {
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const recorderCrashState = useSelector(getRecorderCrashState);
	const ref = React.useRef<HTMLWebViewElement>(null);
	const store = useStore();

	const getPreloadScriptPath = () => {
		return url.resolve(window.location.href, "./webview-preload.js");
	};

	React.useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener("ipc-message", (event: IpcMessageEvent) => {
				const recorderState = getRecorderState(store.getState());
				const { channel, args } = event;
				if (channel === "recorder-message" && args[0].type === TRecorderMessagesType["Commands.turnOnElementMode"]) {
					const isInspectMode = isInspectModeOn(store.getState() as any);
					const isInspectElementSelectorMode = isInspectElementSelectorModeOn(store.getState() as any);

					if (isInspectMode) {
						turnOffInspectMode();
						const { selectedElementInfo } = args[0].payload;
						store.dispatch(setSelectedElement(selectedElementInfo));
					} else if (isInspectElementSelectorMode) {
						turnOffElementSelectorInspectMode();
						const { selectedElementInfo } = args[0].payload;
						window.postMessage(JSON.stringify({ type: "selected-element-for-selectors", selectedElementInfo }));
					}
				}
				if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) return;

				if (channel === "recorder-message") {
					console.log("Event of message recieved", event);
					const { type, payload } = args[0];
					switch (type) {
						case TRecorderMessagesType["Commands.recordAction"]:
							saveAutoAction(payload.action, store);
							break;
						case TRecorderMessagesType["Commands.turnOnInspectMode"]:
							turnOnInspectMode();
							break;
						case TRecorderMessagesType["Commands.turnOffInspectMode"]:
							turnOffInspectMode();
							break;
					}
				}
			});
		}
	}, [ref.current]);

	return (
		<div css={css`position: relative; overflow: hidden;`}>
			<div css={containerStyle}>
				<Conditional showIf={!!recorderInfo.device}>
					<div style={{ width: `${recorderInfo.device?.width}rem`, height: `${recorderInfo.device?.height}rem`, maxWidth: "100%", maxHeight: "100%", position: "relative" }}>
						<webview
							ref={ref}
							css={webviewStyle}
							id="device_browser"
							preload={getPreloadScriptPath()}
							title={"crusher-webview"}
							src={"about:blank"}
							partition={"crusherwebview"}
							webpreferences="nativeWindowOpen=yes"
							allowpopups
							nodeintegration={true}
						/>
						
						<Conditional showIf={recorderCrashState && recorderCrashState.type === TRecorderCrashState.CRASHED}>
							<CrashScreen />
						</Conditional>
						<Conditional showIf={recorderCrashState && recorderCrashState.type === TRecorderCrashState.PAGE_LOAD_FAILED}>
							<PageLoadFailedScreen />
						</Conditional>
						<Conditional showIf={[TRecorderState.PERFORMING_ACTIONS, TRecorderState.PERFORMING_RECORDER_ACTIONS].includes(recorderState.type)}>
							<div
								css={css`
									width: 100%;
									height: 100%;
									background: transparent;
									position: absolute;
									left: 0;
									top: 0;
									z-index: 999;
								`}
							></div>
						</Conditional>
					</div>
				</Conditional>
				<InfoOverLay />
			</div>
			<StatusBar />
		</div>
	);
};


const buttonStyle = css`
	font-size: 14rem;
	box-sizing: border-box;
	border-radius: 6rem;
	width: 112rem;
	height: 30rem;
`;


const runningStatusStyle = css`
	position: fixed;
	width: 100%;
	display: flex;
	text-align: center;
	justify-content: center;
	bottom: 0%;
	height: 29rem;
	align-items: center;
	color: rgba(255, 255, 255, 0.6);
	font-family: Gilroy;
	color: #fff;
	font-size: 14rem;
	background: #141212;
`;

const webviewStyle = css`
	border: none;
	display: inline-flex;
	max-width: 100%;
	width: 100%;
	height: 100%;
	background: #fff;
`;
const containerStyle = css`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	flex: 1;
`;

export { DeviceFrame };
