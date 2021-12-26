import React from "react";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { Conditional } from "@dyson/components/layouts";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "../../icons";
import { BrowserButton } from "../buttons/browser.button";
import { useDispatch, batch, useSelector, useStore } from "react-redux";
import { setDevice, setSiteUrl } from "electron-app/src/store/actions/recorder";
import { devices } from "../../../devices";
import { getRecorderInfo, getRecorderState, isTestVerified } from "electron-app/src/store/selectors/recorder";
import { performNavigation, performReloadPage, performSetDevice, performVerifyTest, preformGoBackPage, saveTest } from "../../commands/perform";
import { addHttpToURLIfNotThere } from "../../../utils";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";

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

const SaveVerifyButton = ({isTestVerificationComplete}) => {
	const [secondsCounter, setSecondsCounter] = React.useState(0);
	const intervalRef = React.useRef(null);
	const totalSecondsToWaitBeforeSave = 5;

	let counter =  0;
	React.useEffect(() => {
		if(isTestVerificationComplete) {
			setSecondsCounter(0);
			intervalRef.current = setInterval(() => {
				counter++;

				if(counter >= totalSecondsToWaitBeforeSave) {
					saveTestToCloud();
				}
				setSecondsCounter(counter);
			}, 1000);

			return () => {
				if(intervalRef.current)
					clearInterval(intervalRef.current);
				intervalRef.current = null;
			};
		}
	}, [isTestVerificationComplete]);

		
	const verifyTest = () => {
		performVerifyTest();
	}

	const saveTestToCloud = () => {
		if(intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		intervalRef.current = null;
		saveTest();
	}

	return (
		<Button onClick={isTestVerificationComplete ? saveTestToCloud : verifyTest} bgColor="tertiary-outline" css={saveButtonStyle} className={"ml-36"}>
			<Conditional showIf={isTestVerificationComplete}>
				<span>
					<Conditional showIf={totalSecondsToWaitBeforeSave - secondsCounter > 0}>
						<span>Saving in  {totalSecondsToWaitBeforeSave - secondsCounter}s</span>
					</Conditional>
					<Conditional showIf={totalSecondsToWaitBeforeSave - secondsCounter <= 0}>
						<span>Save test</span>
					</Conditional>
				</span>
			</Conditional>
			<Conditional showIf={!isTestVerificationComplete}>
				<span>Verify test</span>
			</Conditional>
		</Button>
	);
}


const Toolbar = (props: any) => {
    const [url, setUrl] = React.useState("" || null);
	const [selectedDevice, setSelectedDevice] = React.useState([recorderDevices[0].value]);

	const urlInputRef = React.useRef<HTMLInputElement>(null);
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const isTestVerificationComplete = useSelector(isTestVerified);

	const dispatch = useDispatch();
	const store = useStore();

	React.useEffect(() => {
		if (recorderInfo.url !== url){
			setUrl(recorderInfo.url);
		}
	}, [recorderInfo.url]);

	React.useEffect(() => {
		if(isTestVerificationComplete) {

		} else {

		}
	}, [isTestVerificationComplete]);

    const handleUrlReturn = React.useCallback(() => {
		if(urlInputRef.current?.value) {
			const device = recorderDevices.find((device) => device.value === selectedDevice[0])?.device;
			const validUrl = addHttpToURLIfNotThere(urlInputRef.current?.value);
			
			batch(() => {
				if(selectedDevice[0] !== recorderInfo.device?.id) {
					performSetDevice(device);
					dispatch(setDevice(selectedDevice[0]));
				}
				
				if(recorderInfo.url) {
					dispatch(setSiteUrl(validUrl.toString()));
					performNavigation(validUrl.toString(), store);
				} else {
					dispatch(setSiteUrl(validUrl.toString()));
				}
			})
		}
    }, [recorderInfo]);

	const handleChangeDevice = (selected) => {
		const device = recorderDevices.find((device) => device.value === selected[0])?.device;
		setSelectedDevice([selected[0]]);

		if(recorderInfo.url) {
			performSetDevice(device);
			dispatch(setDevice(selected[0]));
		}
	}

	const isRecorderInInitialState = recorderState.type === TRecorderState.BOOTING;

	const goBack = () => {
		preformGoBackPage();
	}
	const refreshPage = () => {
		performReloadPage();
	}
    
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
			
			<Conditional showIf={isRecorderInInitialState}>
				<Button className={"ml-24"} onClick={handleUrlReturn} bgColor="tertiary-outline" css={buttonStyle}>
					Start
				</Button>
			</Conditional>
			<Conditional showIf={!isRecorderInInitialState}>
				<div className={"ml-18 flex items-center"}>
					<div css={[onlineDotStyle, recorderState.type === TRecorderState.PERFORMING_ACTIONS ? css`background: yellow` : undefined]} />
					<Text css={recTextStyle} className={"ml-8"}>
						{recorderState.type !== TRecorderState.PERFORMING_ACTIONS ? "Rec." : "Waiting"}
					</Text>
				</div>

				<div className={"ml-auto flex items-center"}>
					<SettingsIcon css={css`height: 14rem; :hover { opacity: 0.9 }`} className={"ml-12"} />

					<SaveVerifyButton isTestVerificationComplete={isTestVerificationComplete} />
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