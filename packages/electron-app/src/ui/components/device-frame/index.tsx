import React from "react";
import { css } from "@emotion/react";
import { getRecorderInfo, getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import * as url from "url";
import { IpcMessageEvent } from "electron";
import { turnOffInspectMode, turnOnInspectMode } from "../../commands/perform";
import { recordStep, setSelectedElement } from "electron-app/src/store/actions/recorder";
import { saveAutoAction } from "../../commands/saveActions";
import { TRecorderMessagesType } from "../../../lib/recorder/host-proxy";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { InfoOverLay } from "../overlays/infoOverlay";

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
				if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) return;

				const { channel, args } = event;
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
						case TRecorderMessagesType["Commands.turnOnElementMode"]:
							turnOffInspectMode();
							const { selectedElementInfo } = payload;
							store.dispatch(setSelectedElement(selectedElementInfo));
							break;
					}
				}
			});
		}
	}, [ref.current]);

	return (
		<div css={containerStyle}>
			<Conditional showIf={!!recorderInfo.device}>
				<div style={{ width: `${recorderInfo.device?.width}rem`, height: `${recorderInfo.device?.height}rem`, maxWidth: "100%", maxHeight: "100%" }}>
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
				</div>
			</Conditional>
			<InfoOverLay />
			<Conditional showIf={recorderState.type === TRecorderState.PERFORMING_ACTIONS}>
				<div css={runningStatusStyle}>We’re running test for you. You can’t perform actions right now.</div>
			</Conditional>
		</div>
	);
};

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
