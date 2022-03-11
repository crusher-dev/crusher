import React from "react";
import { css } from "@emotion/react";
import { getRecorderInfo, getRecorderState, isInspectElementSelectorModeOn, isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import * as url from "url";
import { IpcMessageEvent } from "electron";
import { performQuitAndRestore, turnOffElementSelectorInspectMode, turnOffInspectMode, turnOnInspectMode } from "../../commands/perform";
import { recordStep, setSelectedElement } from "electron-app/src/store/actions/recorder";
import { saveAutoAction } from "../../commands/saveActions";
import { TRecorderMessagesType } from "../../../lib/recorder/host-proxy";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { InfoOverLay } from "../overlays/infoOverlay";
import { StopIcon } from "../../icons";
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

const DeviceFrame = (props: any) => {
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
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
					
					<Conditional showIf={recorderState.type === TRecorderState.CRASHED}>
						<CrashScreen />
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
`;

export { DeviceFrame };
