import React, { RefObject, useMemo, useState } from "react";
import { Device } from "../../components/app/device";
import { SETTINGS_ACTIONS } from "../../../constants/actionTypes";
import { BrowserToolbar } from "./browserToolbar";
import { AdvancedURL } from "../../../utils/url";
import { ACTION_FORM_TYPE } from "../../../constants";
import { useSelector } from "react-redux";
import { getInspectModeState } from "../../../redux/selectors/recorder";

interface iBrowserWindowProps {
	isDisabled?: boolean;
	saveTestCallback: () => void;
	deviceIframeRef: RefObject<HTMLIFrameElement>;
}

const BrowserWindow = (props: iBrowserWindowProps) => {
	const { deviceIframeRef, saveTestCallback } = props;
	const isInspectModeOn = useSelector(getInspectModeState);

	const [url, setUrl] = useState(
		AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href),
	);

	const selectedDevice = AdvancedURL.getDeviceFromCrusherExtensionUrl(
		window.location.href,
	);

	function handleKeyPress(event: KeyboardEvent) {
		const cn = deviceIframeRef?.current?.contentWindow;

		if (event.key === "q") {
			cn?.postMessage(
				{
					type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
					formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
					value: true,
				},
				"*",
			);
		}
	}

	useMemo(() => {
		document.body.addEventListener("keypress", handleKeyPress, true);
	}, []);

	const goBack = () => {
		const cn = deviceIframeRef?.current?.contentWindow;

		cn?.postMessage(
			{ type: SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL, value: true },
			"*",
		);
	};

	const goForward = () => {
		const cn = deviceIframeRef?.current?.contentWindow;

		cn?.postMessage(
			{ type: SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL, value: true },
			"*",
		);
	};

	const refreshPage = () => {
		const cn = deviceIframeRef?.current?.contentWindow;

		cn?.postMessage({ type: SETTINGS_ACTIONS.REFRESH_PAGE, value: true }, "*");
	};

	const loadNewPage = (newUrl: string) => {
		setUrl(newUrl);
	};

	return (
		<div style={mainContainerStyle}>
			<div style={browserStyle}>
				<BrowserToolbar
					isInspectModeOn={isInspectModeOn}
					initialUrl={url}
					goBack={goBack}
					goForward={goForward}
					refreshPage={refreshPage}
					saveTest={saveTestCallback}
					loadNewPage={loadNewPage}
				/>
				<Device url={url} device={selectedDevice} forwardRef={deviceIframeRef} />
			</div>
		</div>
	);
};

const mainContainerStyle = {
	flex: 1,
	width: "70%",
	maxHeight: "100vh",
	overflow: "auto",
};

const browserStyle = {
	background: "#010101",
	minHeight: "100vh",
	overflow: "hidden",
};

export { BrowserWindow };
