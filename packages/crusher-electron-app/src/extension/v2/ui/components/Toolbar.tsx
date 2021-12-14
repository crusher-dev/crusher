import React from "react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { css } from "@emotion/react";
import { NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "crusher-electron-app/src/extension/assets/icons";
import { Conditional } from "@dyson/components/layouts";

const DeviceItem = ({label}) => {
	return (
		<div css={{padding: "7rem 8rem", width: "100%", cursor: "default"}}>{label}</div>
	)
};

const devices = [
	{ value: "desktop", component: <DeviceItem label={"Desktop" } />, label: "Desktop" },
	{ value: "mobile", label: "Mobile", component: <DeviceItem label={"Mobile" } /> },
];


const Toolbar = (): JSX.Element => {
	const [start, setStart] = React.useState(false);
	const [selectedDevice, setSelectedDevice] = React.useState(["desktop"]);

	const handleChangeDevice = (selected) => {
		setSelectedDevice(selected);
	};

	return (
		<div css={containerStyle}>
			<NavigateBackIcon onClick={() => 0} disabled={!start} />
			<NavigateRefreshIcon onClick={() => 0} disabled={!start} />
			<Input
				placeholder="Enter URL to test"
				CSS={inputStyle}
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
