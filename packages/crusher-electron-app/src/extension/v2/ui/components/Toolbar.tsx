import React from "react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { css } from "@emotion/react";
import { NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "crusher-electron-app/src/extension/assets/icons";
import { Conditional } from "@dyson/components/layouts";

const devices = [
	{ value: "Desktop", label: "Desktop" },
	{ value: "Mobile", label: "Mobile" },
	{ value: "Tablet", label: "Tablet" },
];
const Toolbar = (): JSX.Element => {
	const [start, setStart] = React.useState(false);
	return (
		<div css={containerStyle}>
			<NavigateBackIcon onClick={() => 0} disabled={!start} />
			<NavigateRefreshIcon onClick={() => 0} disabled={!start} />
			<Input
				placeholder="Enter URL to test"
				CSS={inputStyle}
				rightIcon={
					<div css={dropDownContainer}>
						<SelectBox CSS={dropdownCSS} selected={["Desktop"]} values={devices} />
					</div>
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
	* {
		margin: 0rem 10rem;
	}
`;
const inputStyle = css`
	width: 340rem;
	height: 34rem;
	font-family: Gilroy;
	font-size: 14.6rem;
	border: 1px solid #9462ff;
	outline-color: #9462ff;
	box-sizing: border-box;
	border-radius: 4rem;
	color: rgba(255, 255, 255, 0.93);
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

const dropdownCSS = css`
	width: 90rem;
	border-left: 1px solid rgba(255, 255, 255, 0.13);
	font-size: 13rem;
	* {
		cursor: default;
	}
	.selectBox__input {
		display: none;
	}
	.select-dropDownContainer {
		left: 6rem;
	}
	.dropdown-box {
		margin: unset;
	}
	.dropdown-label {
		padding: 6rem 4rem !important;
		text-align: center;
		:hover {
			font-weight: 600;
			background: unset !important;
		}
	}
	.selectBox {
		transform: translate(-10rem);
		background: transparent;
		border: none;
		:hover {
			background: transparent;
			border: none;
		}
	}
`;
const dropDownContainer = css`
	box-sizing: border-box;
	width: 80rem;
	position: relative;
`;
export default Toolbar;
