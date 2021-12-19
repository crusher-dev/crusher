import React, { useCallback } from "react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { css } from "@emotion/react";
import { NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "crusher-electron-app/src/extension/assets/icons";
import { Conditional } from "@dyson/components/layouts";
import { addHttpToURLIfNotThere } from "@shared/utils/url";
import { validURL } from "crusher-electron-app/src/extension/utils/helpers";
import { getStore } from "crusher-electron-app/src/extension/redux/store";
import { recordAction } from "crusher-electron-app/src/extension/redux/actions/actions";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { AdvancedURL } from "crusher-electron-app/src/extension/utils/url";
import { SETTINGS_ACTIONS } from "crusher-electron-app/src/extension/constants/actionTypes";
import { generateCrusherExtensionUrl } from "@shared/utils/extension";
import devicesList from "@shared/constants/devices";
import userAgentsList from "@shared/constants/userAgents";

const DeviceItem = ({label}) => {
	return (
		<div css={{padding: "7rem 8rem", width: "100%", cursor: "default"}}>{label}</div>
	)
};

const devices = [
	{ value: "GoogleChromeMediumScreen", component: <DeviceItem label={"Desktop" } />, label: "Desktop" },
	{ value: "Pixel33XL", label: "Mobile", component: <DeviceItem label={"Mobile" } /> },
];


const Toolbar = ({CSS, initialSelectedDevice, initialUrl}): JSX.Element => {
	const [start, setStart] = React.useState(true);
	const [url, setUrl] = React.useState(initialUrl || null);

	const [selectedDevice, setSelectedDevice] = React.useState([!!initialSelectedDevice ? initialSelectedDevice : "GoogleChromeMediumScreen"]);

	const handleChangeDevice = async (selected) => {
		const targetUrl = AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href);
		if(initialUrl) {
			const device = devicesList.find((device) => device.id === selected[0]);
			const userAgent = userAgentsList.find((userAgent) => userAgent.name === device.userAgent);

			const isUserAgentReset = await (window as any).electron.setUserAgent(userAgent.value);

			if (isUserAgentReset) {
				window.location.href = generateCrusherExtensionUrl("/", targetUrl!, device.id, { isDeviceChanged: true });
			}
		}

		setSelectedDevice(selected);
	};

	const loadNewPage = (newUrl: string) => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ActionsInTestEnum.NAVIGATE_URL,
				payload: {
					selectors: [],
					meta: {
						value: newUrl,
					},
				},
			}),
		);
		setUrl(newUrl);

		(window as any).electron.navigatePage(newUrl);
	}

	const handleUrlReturn = useCallback((_newUrl: string) => {
		const newUrl = addHttpToURLIfNotThere(_newUrl);
		setUrl(newUrl);
		if (!validURL(newUrl)) alert("URL is not valid!");
		else {
			if(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href)) {
				loadNewPage(newUrl);
			} else {
				const currentURL =  new URL(window.location.href);
				currentURL.searchParams.append("url", newUrl);
				currentURL.searchParams.append("device", selectedDevice[0]);
				window.location.href = currentURL.toString();
			}
		}
	}, [selectedDevice]);

	const goBack = () => {
		(window as any).electron.webview.postMessage({ type: SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL, value: true });
	};

	const refreshPage = () => {
		(window as any).electron.webview.postMessage({ type: SETTINGS_ACTIONS.REFRESH_PAGE, value: true });
	};
	
	return (
		<div css={[containerStyle, CSS]}>
			<NavigateBackIcon onClick={goBack} disabled={!start} />
			<NavigateRefreshIcon onClick={refreshPage} disabled={!start} />
			<Input
				placeholder="Enter URL to test"
				CSS={inputStyle}
				onReturn={handleUrlReturn}
				initialValue={url}
				rightIcon={
						<SelectBox selected={selectedDevice} callback={handleChangeDevice} CSS={css`.selectBox { padding: 14rem; height: 30rem; } .selectBox__value { margin-right: 10rem; font-size: 13rem; } width: 102rem;`} values={devices} />
				}
			/>
			
			<Conditional showIf={!start}>
				<Button onClick={() => setStart(true)} bgColor="tertiary-outline" CSS={buttonStyle}>
					Start
				</Button>
			</Conditional>
			<Conditional showIf={start}>
				<div css={onlineDotStyle} />
				<Text CSS={recTextStyle}>Rec.</Text>
				<SettingsIcon />
				<Button onClick={() => setStart(false)} bgColor="tertiary-outline" CSS={saveButtonStyle}>
					Save test
				</Button>
			</Conditional>
		</div>
	);
};

const containerStyle = css`
	display: flex;
	align-items: center;
	padding: 8rem;
	& > * {
		margin: 0rem 10rem;
	}
`;
const inputStyle = css`
	height: 34rem;
	& > input {
		width: 340rem;
		font-family: Gilroy;
		font-size: 14.6rem;
		/* border: 1px solid #9462ff; */
		outline-color: #9462ff;
		outline-width: 1px;
		box-sizing: border-box;
		border-radius: 4rem;
		color: rgba(255, 255, 255, 0.93);
		height: 100%;
	}
	svg {
		margin-left: auto;
	}
	.dropdown-box {
		overflow: hidden;
	}
	.input__rightIconContainer {
		right: 1rem;
		z-index: 9999;
	}
`;
const buttonStyle = css`
	font-size: 14rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4rem;
	width: 93rem;
	height: 34rem;
`;

const saveButtonStyle = css`
	width: 113rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;

	color: #ffffff;
`;
const recTextStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 13rem;
	flex-grow: 1;
`;
const onlineDotStyle = css`
	display: block;
	width: 8rem;
	height: 8rem;
	background: #a8e061;
	border-radius: 50rem;
	margin: 0rem;
`;

const dropDownContainer = css`
	box-sizing: border-box;
	width: 80rem;
	position: relative;
`;
export default Toolbar;
