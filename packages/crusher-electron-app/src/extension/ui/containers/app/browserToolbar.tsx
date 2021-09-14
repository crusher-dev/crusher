import React, { ChangeEvent, useCallback, useEffect, useReducer, useState } from "react";
import { HelpIcon, SettingsIcon, NavigateBackIcon, NavigateForwardIcon, NavigateRefreshIcon, SaveIcon, AppResetIcon } from "../../../assets/icons";
import { FLEX_DIRECTION } from "../../../interfaces/css";
import { AddressBar } from "../../components/app/addressBar";
import { addHttpToURLIfNotThere } from "@shared/utils/url";
import { Button } from "../../components/app/button";
import { SelectDeviceInput } from "../popup/selectDeviceInput";
import { AdvancedURL } from "../../../utils/url";
import { generateCrusherExtensionUrl } from "@shared/utils/extension";
import { OnboardingManager } from "./onboardingManager";
import { Conditional } from "../../components/conditional";
import { SettingsModal } from "./modals/settingsModal";
import { validURL } from "../../../utils/helpers";
import devices from "@shared/constants/devices";
import userAgents from "@shared/constants/userAgents";
import { getActions } from "crusher-electron-app/src/extension/redux/selectors/actions";
import { useSelector } from "react-redux";
import { ActionsInTestEnum, ACTIONS_IN_TEST } from "@shared/constants/recordedActions";

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
	const actions = useSelector(getActions);

	// const showOnboarding = localStorage.getItem("isOnboardingComplete") !== "true";
	const showOnboarding = false;
	const [url, setUrl] = useState(initialUrl || "http://google.com");
	const [selectedDevice] = useState(AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href).id);
	const [shouldShowSettingsModal, setShouldShowSettingsModal] = useState(false);
	const handleAddressBarUrlChange = (event: ChangeEvent) => {
		setUrl((event.target as any).value);
	};

	useEffect(() => {
		const navigateActions = actions.filter((action) => [ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.WAIT_FOR_NAVIGATION].includes(action.type));
		if (navigateActions && navigateActions.length) {
			const newUrl = navigateActions[navigateActions.length - 1].payload.meta.value;
			if (url !== newUrl) setUrl(newUrl);
		}
	}, [actions]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.keyCode === 13) {
				event.preventDefault();
				const newUrl = addHttpToURLIfNotThere((event.target as any).value as string);
				setUrl(newUrl);
				if (!validURL(newUrl)) alert("URL is not valid!");
				else loadNewPage(newUrl);
			}
		},
		[url],
	);

	const openSettings = () => {
		setShouldShowSettingsModal(true);
	};
	const handleCloseSettingsModalCallback = () => {
		setShouldShowSettingsModal(false);
	};

	const handleDeviceChange = (deviceId: string) => {
		const targetUrl = AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href);
		const device = devices.find((device) => device.id === deviceId);
		const userAgent = userAgents.find((userAgent) => userAgent.name === device.userAgent);

		(window as any).electron.setUserAgent(userAgent.value);
		window.location.href = generateCrusherExtensionUrl("/", targetUrl!, deviceId, { isDeviceChanged: true });
	};

	const resetApp = () => {
		(window as any).electron.restartApp();
	};

	return (
		<div style={browserToolbarStyle}>
			<div className="h-20 flex items-center ml-5 mr-2" id="top-bar">
				<div className="h-10 w-full flex">
					<div className="flex" style={{ width: "14%" }}>
						<div style={refreshIconContainerStyle} onClick={resetApp} className={"browser_icon"}>
							<AppResetIcon width={14} height={14} disabled={false} />
						</div>
						<div style={goBackIconContainerStyle} className={"browser_icon"}>
							<NavigateBackIcon onClick={goBack} disabled={false} />
						</div>
						<div style={forwardIconContainerStyle} className={"browser_icon"}>
							<NavigateForwardIcon onClick={goForward} disabled={false} />
						</div>
					</div>
					<div style={{ width: "48%" }}>
						<AddressBar value={url} onKeyDown={handleKeyDown} onChange={handleAddressBarUrlChange} />
					</div>
					<div className="flex justify-end items-center" style={{ width: "38%" }}>
						<div className="mx-12" id={"select-device-input"}>
							<SelectDeviceInput selectedDevice={selectedDevice} selectDevice={handleDeviceChange} />
						</div>
						<a target="_blank" href="https://docs.crusher.dev/docs/help#crusherExternalLink" className="mx-12 cursor-pointer" rel="noreferrer">
							<HelpIcon />
						</a>
						<div className="mx-12 cursor-pointer">
							<SettingsIcon onClick={openSettings} />
						</div>
						<Button id={"saveTest"} title={"Save test"} icon={SaveIcon} onClick={saveTest} />
					</div>
				</div>
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
			<SettingsModal isOpen={shouldShowSettingsModal} onClose={handleCloseSettingsModalCallback} />
		</div>
	);
};

const browserToolbarStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
	width: "100%",
	height: "4.75rem",
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
	marginLeft: "1.1rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
};

export { BrowserToolbar };
