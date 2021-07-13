import React, { RefObject, useEffect, useMemo, useState } from "react";
import { Device } from "../../components/app/device";
import { SETTINGS_ACTIONS } from "../../../constants/actionTypes";
import { BrowserToolbar } from "./browserToolbar";
import { AdvancedURL } from "../../../utils/url";
import { ACTION_FORM_TYPE } from "../../../constants";
import { useSelector } from "react-redux";
import { getActionsRecordingState, getInspectModeState } from "../../../redux/selectors/recorder";
import { getStore } from "../../../redux/store";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { recordAction } from "../../../redux/actions/actions";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { COLOR_CONSTANTS } from "../../colorConstants";
import { WebviewTag } from "electron";

interface iBrowserWindowProps {
	isDisabled?: boolean;
	saveTestCallback: () => void;
	deviceIframeRef: RefObject<any>;
}

const BrowserWindow = (props: iBrowserWindowProps) => {
	const { deviceIframeRef, saveTestCallback } = props;
	const isInspectModeOn = useSelector(getInspectModeState);
	const actionsRecordingState = useSelector(getActionsRecordingState);
	const isElementRecordingStateOn = actionsRecordingState.type === ACTIONS_RECORDING_STATE.ELEMENT;

	const [url, setUrl] = useState(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href) as string);

	const selectedDevice = AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href);

	useEffect(() => {
		if (deviceIframeRef.current) {
			setTimeout(() => {
				(window as any).electron.initWebView(2);
			}, 500);
			// console.log((deviceIframeRef.current as WebviewTag).getWebContentsId);
		}
	}, [deviceIframeRef.current]);
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "q") {
			(window as any).electron.webview.postMessage({
				type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
				formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
				value: true,
			});
		}
	}

	useMemo(() => {
		document.body.addEventListener("keypress", handleKeyPress, true);
	}, []);

	const goBack = () => {
		(window as any).electron.webview.postMessage({ type: SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL, value: true });
	};

	const goForward = () => {
		(window as any).electron.webview.postMessage({ type: SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL, value: true });
	};

	const refreshPage = () => {
		(window as any).electron.webview.postMessage({ type: SETTINGS_ACTIONS.REFRESH_PAGE, value: true });
	};

	const loadNewPage = (newUrl: string) => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ACTIONS_IN_TEST.NAVIGATE_URL,
				payload: {
					selectors: [],
					meta: {
						value: newUrl,
					},
				},
			}),
		);
		setUrl(newUrl);
	};

	return (
		<div style={{ ...browserStyle, ...mainContainerStyle }}>
			<BrowserToolbar
				isInspectModeOn={isInspectModeOn}
				initialUrl={url}
				goBack={goBack}
				goForward={goForward}
				refreshPage={refreshPage}
				saveTest={saveTestCallback}
				loadNewPage={loadNewPage}
			/>
			{/*<ActionRecordedIndicator />*/}

			<Device url={url} device={selectedDevice} isDisabled={isElementRecordingStateOn} forwardRef={deviceIframeRef} />
		</div>
	);
};

const mainContainerStyle = {
	flex: 1,
	maxHeight: "100vh",
};

const browserStyle = {
	background: COLOR_CONSTANTS.PRIMARY,
	minHeight: "100vh",
	overflow: "hidden",
};

export { BrowserWindow };
