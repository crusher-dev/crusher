import React from "react";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { Conditional } from "@dyson/components/layouts";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "../../icons";
import { BrowserButton } from "../buttons/browser.button";
import { useDispatch, batch } from "react-redux";
import { setDevice, setSiteUrl } from "electron-app/src/store/actions/recorder";
import { devices } from "../../../devices";

const DeviceItem = ({label}) => {
	return (
		<div css={css`width: 100%;`}>{label}</div>
	)
};

const recorderDevices = devices.filter(device => device.visible).map((device) => ({
	device: device,
	value: device.id,
	label: device.name,
	component: <DeviceItem label={device.name} />
}));


const Toolbar = (props: any) => {
    const [url, setUrl] = React.useState("" || null);
	const [selectedDevice, setSelectedDevice] = React.useState([recorderDevices[0].value]);

	const urlInputRef = React.useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

    const handleUrlReturn = () => {
		if(urlInputRef.current?.value) {
			batch(() => {
				dispatch(setSiteUrl(urlInputRef.current.value));
				dispatch(setDevice(selectedDevice[0]));
			})
		}
    };

	const handleChangeDevice = (selected) => {
		const device = recorderDevices.find((device) => device.value === selected[0])?.device;
		setSelectedDevice([selected[0]]);
	}
	const saveTest = () => {}
	const goBack = () => {}
	const refreshPage = () => {}
    
    return (
		<div css={containerStyle}>
			{/* Go Back button */}
			<BrowserButton className={"ml-24 go-back-button"} onClick={goBack}>
				<NavigateBackIcon css={css`height: 20rem;`} disabled={false} />
			</BrowserButton>

			{/* Refresh button */}
			<BrowserButton className={"ml-12 reload-page-button"} onClick={refreshPage}>
				<NavigateRefreshIcon css={css`height: 20rem;`} disabled={false} />
			</BrowserButton>

			<Input
				placeholder="Enter URL to test"
				className={"target-site-input"}
				css={inputStyle}
				onReturn={handleUrlReturn}
				initialValue={url}
				forwardRef={urlInputRef}
				rightIcon={
						<SelectBox selected={selectedDevice} callback={handleChangeDevice} className={"target-device-dropdown"} css={css`.selectBox { padding: 14rem; height: 30rem; } .selectBox__value { margin-right: 10rem; font-size: 13rem; } width: 104rem;`} values={recorderDevices} />
				}
			/>
			
			<Conditional showIf={false}>
				<Button className={"ml-24"} onClick={() => {}} bgColor="tertiary-outline" css={buttonStyle}>
					Start
				</Button>
			</Conditional>
			<Conditional showIf={true}>
				<div className={"ml-18 flex items-center"}>
					<div css={onlineDotStyle} />
					<Text css={recTextStyle} className={"ml-8"}>Rec.</Text>
				</div>

				<div className={"ml-auto flex items-center"}>
					<SettingsIcon css={css`height: 14rem; :hover { opacity: 0.9 }`} className={"ml-12"} />

					<Button onClick={saveTest} bgColor="tertiary-outline" css={saveButtonStyle} className={"ml-36"}>
						Verify test
					</Button>
				</div>
			</Conditional>
		</div>
	);
};

const containerStyle = css`
	display: flex;
	align-items: center;
	padding: 8rem;
	background-color: #111213;
	padding: 5rem;
	min-height: 60rem;
`;
const inputStyle = css`
	height: 34rem;
	margin-left: 28rem;
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

export { Toolbar }