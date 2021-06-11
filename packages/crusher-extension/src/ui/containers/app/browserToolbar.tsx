import React, { ChangeEvent, useCallback, useState } from "react";
import { NavigateBackIcon, NavigateForwardIcon, NavigateRefreshIcon, SaveIcon } from "../../../assets/icons";
import { FLEX_DIRECTION } from "../../../interfaces/css";
import { AddressBar } from "../../components/app/addressBar";
import { addHttpToURLIfNotThere } from "../../../../../crusher-shared/utils/url";
import { Button } from "../../components/app/button";
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

	return (
		<div style={browserToolbarStyle}>
			<div className="h-20 flex items-center ml-5 mr-2" id="top-bar">
				<div className="h-10 w-full flex">
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
					<div className="flex justify-evenly">
						<div className="mx-24" id={"select-device-input"}>
							<SelectDeviceInput selectedDevice={selectedDevice} selectDevice={handleDeviceChange} />
						</div>

						<Button id={"saveTest"} title={"Save test"} icon={SaveIcon} onClick={saveTest} />
					</div>
					{/* <a href={"javascript:;"} style={helpStyle} onClick={showHowToUseModal}>
					Help
				</a> */}
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
	marginLeft: "0.8rem",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
};

export { BrowserToolbar };
