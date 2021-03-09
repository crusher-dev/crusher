import React, { ChangeEvent, useCallback, useState } from "react";
import {
	NavigateBackIcon,
	NavigateForwardIcon,
	NavigateRefreshIcon,
	RecordLabelIcon,
} from "../../../assets/icons";
import { FLEX_DIRECTION } from "../../../interfaces/css";
import { AddressBar } from "../../components/app/addressBar";
import { addHttpToURLIfNotThere } from "../../../../../crusher-shared/utils/url";
import { Button } from "../../components/app/button";
import { getStore } from "../../../redux/store";
import { updateActionsModalState } from "../../../redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "../../../interfaces/actionsModalState";
import { SelectDeviceInput } from "../popup/selectDeviceInput";
import { AdvancedURL } from "../../../utils/url";
import { generateCrusherExtensionUrl } from "../../../../../crusher-shared/utils/extension";
import { OnboardingManager } from "./onboardingManager";
import { Conditional } from "../../components/conditional";

interface iBrowserToolbarProps {
	initialUrl?: string;
	isInspectModeOn?: boolean;
	goBack: () => void;
	goForward: () => void;
	refreshPage: () => void;
	saveTest: () => void;
	loadNewPage: (newUrl: string) => void;
}
const BrowserToolbar = (props: iBrowserToolbarProps) => {
	const {
		initialUrl,
		goBack,
		goForward,
		refreshPage,
		saveTest,
		loadNewPage,
	} = props;

	const showOnboarding = localStorage.getItem("isOnboardingComplete") !== "true";
	const [url, setUrl] = useState(initialUrl || "http://google.com");
	const [selectedDevice] = useState(
		AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href).id,
	);

	const handleAddressBarUrlChange = (event: ChangeEvent) => {
		setUrl((event.target as any).value);
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.keyCode === 13) {
				event.preventDefault();
				const newUrl = addHttpToURLIfNotThere(
					(event.target as any).value as string,
				);
				setUrl(newUrl);
				loadNewPage(newUrl);
			}
		},
		[url],
	);

	const handleDeviceChange = (deviceId: string) => {
		const targetUrl = AdvancedURL.getUrlFromCrusherExtensionUrl(
			window.location.href,
		);
		window.location.href = generateCrusherExtensionUrl(
			"/",
			targetUrl!,
			deviceId,
			{ isDeviceChanged: true },
		);
	};

	const showHowToUseModal = () => {
		const store = getStore();
		store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.HOW_TO_USE_VIDEO));
	};

	return (
		<div style={browserToolbarStyle}>
			<div style={browserMainToolbarStyle} id="top-bar">
				<div style={goBackIconContainerStyle} className={"browser_icon"}>
					<NavigateBackIcon onClick={goBack} disabled={false} />
				</div>
				<div style={forwardIconContainerStyle} className={"browser_icon"}>
					<NavigateForwardIcon onClick={goForward} disabled={false} />
				</div>
				<div style={refreshIconContainerStyle} className={"browser_icon"}>
					<NavigateRefreshIcon onClick={refreshPage} disabled={false} />
				</div>
				<AddressBar
					value={url}
					onKeyDown={handleKeyDown}
					onChange={handleAddressBarUrlChange}
				/>
				<div style={deviceOptionInputContainerStyle} id={"select-device-input"}>
					<SelectDeviceInput
						selectedDevice={selectedDevice}
						selectDevice={handleDeviceChange}
					/>
				</div>
				<Button title={"Save test"} icon={RecordLabelIcon} onClick={saveTest} />
				<a href={"javascript:;"} style={helpStyle} onClick={showHowToUseModal}>
					Help
				</a>
			</div>

			<style>{`
				.browser_icon{
							padding: 0 0.4rem;
				}
				.browser_icon:hover{
					background: rgb(75,75,75);
				}
			`}</style>
			<Conditional If={showOnboarding}>
				<OnboardingManager />
			</Conditional>
		</div>
	);
};

const deviceOptionInputContainerStyle = {
	marginLeft: "auto",
};
const browserToolbarStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
};

const browserMainToolbarStyle = {
	background: "#14181F",
	display: "flex",
	padding: "0.73rem 2rem",
};

const goBackIconContainerStyle = {
	display: "flex",
	alignItems: "center",
	marginLeft: "1.1rem",
	cursor: "pointer",
};

const forwardIconContainerStyle = {
	marginLeft: "0.7rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
};

const refreshIconContainerStyle = {
	marginLeft: "0.8rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
};

const helpStyle = {
	display: "flex",
	alignItems: "center",
	textDecoration: "none",
	color: "#fff",
	fontSize: 15,
	marginLeft: "0.75rem",
};

export { BrowserToolbar };
