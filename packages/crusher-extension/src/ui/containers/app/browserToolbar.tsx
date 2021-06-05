import React, { ChangeEvent, useCallback, useState } from "react";
import { NavigateBackIcon, NavigateForwardIcon, NavigateRefreshIcon, RecordLabelIcon } from "../../../assets/icons";
import { FLEX_DIRECTION } from "../../../interfaces/css";
import { AddressBar } from "../../components/app/addressBar";
import { addHttpToURLIfNotThere } from "../../../../../crusher-shared/utils/url";
import { Button } from "../../components/app/button";
import { getStore } from "../../../redux/store";
import { updateActionsModalState, updateAutoRecorderSetting } from "../../../redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "../../../interfaces/actionsModalState";
import { SelectDeviceInput } from "../popup/selectDeviceInput";
import { AdvancedURL } from "../../../utils/url";
import { generateCrusherExtensionUrl } from "../../../../../crusher-shared/utils/extension";
import { OnboardingManager } from "./onboardingManager";
import { Conditional } from "../../components/conditional";
import { useSelector } from "react-redux";
import { getAutoRecorderState } from "../../../redux/selectors/recorder";

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
	const { initialUrl, goBack, goForward, refreshPage, saveTest, loadNewPage } = props;

	// const showOnboarding = localStorage.getItem("isOnboardingComplete") !== "true";
	const showOnboarding = false;
	const [url, setUrl] = useState(initialUrl || "http://google.com");
	const [selectedDevice] = useState(AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href).id);

	const handleAddressBarUrlChange = (event: ChangeEvent) => {
		setUrl((event.target as any).value);
	};

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.keyCode === 13) {
				event.preventDefault();
				const newUrl = addHttpToURLIfNotThere((event.target as any).value as string);
				setUrl(newUrl);
				loadNewPage(newUrl);
			}
		},
		[url],
	);

	const handleDeviceChange = (deviceId: string) => {
		const targetUrl = AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href);
		window.location.href = generateCrusherExtensionUrl("/", targetUrl!, deviceId, { isDeviceChanged: true });
	};

	const showHowToUseModal = () => {
		const store = getStore();
		store.dispatch(updateActionsModalState(ACTIONS_MODAL_STATE.HOW_TO_USE_VIDEO));
	};

	const handleAutoDetectModeToggle = (event: ChangeEvent<HTMLInputElement>) => {
		const store = getStore();
		store.dispatch(updateAutoRecorderSetting(event.target.checked));
	};

	const isAutoHoverOn = useSelector(getAutoRecorderState);

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
				<AddressBar value={url} onKeyDown={handleKeyDown} onChange={handleAddressBarUrlChange} />
				<div style={authDetectModeToggleContainerStyle}>
					<div style={autoDetectModeToggleHeadingStyle}>Auto Detect:</div>
					<label className="switch">
						<input type="checkbox" defaultChecked={isAutoHoverOn} onChange={handleAutoDetectModeToggle} />
						<span className="slider round"></span>
					</label>
				</div>
				<div style={deviceOptionInputContainerStyle} id={"select-device-input"}>
					<SelectDeviceInput selectedDevice={selectedDevice} selectDevice={handleDeviceChange} />
				</div>
				<Button id={"saveTest"} title={"Save test"} icon={RecordLabelIcon} onClick={saveTest} />
				<a href={"javascript:;"} style={helpStyle} onClick={showHowToUseModal}>
					Help
				</a>
			</div>

			<style>{`
				.switch {
					position: relative;
					display: inline-block;
					width: 3rem;
					height: 1rem;
				}

				.switch input { 
					opacity: 0;
					width: 0;
					height: 0;
				}

				.slider {
					position: absolute;
					cursor: pointer;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: #ccc;
					-webkit-transition: .4s;
					transition: .4s;
				}
				
				.slider:before {
					position: absolute;
					content: "";
					height: 0.725rem;
					width: 0.725rem;
					left: 4px;
					bottom: 2.75px;
					background-color: white;
					-webkit-transition: .4s;
					transition: .4s;
				}
				
				input:checked + .slider {
					background-color: #2196F3;
				}
				
				input:focus + .slider {
					box-shadow: 0 0 1px #2196F3;
				}
				
				input:checked + .slider:before {
					transform: translateX(1.875rem);
				}
				
				/* Rounded sliders */
				.slider.round {
					border-radius: 34px;
				}
				
				.slider.round:before {
					border-radius: 50%;
				}
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

const autoDetectModeToggleHeadingStyle = {
	color: "#fff",
	marginRight: "1rem",
	fontSize: "0.9rem",
};

const authDetectModeToggleContainerStyle = {
	display: "flex",
	alignItems: "center",
	marginLeft: "auto",
	color: "#fff",
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
