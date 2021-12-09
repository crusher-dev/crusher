import React from "react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { css } from "@emotion/react";
import { NavigateBackIcon, NavigateRefreshIcon } from "crusher-electron-app/src/extension/assets/icons";

const Toolbar = (): JSX.Element => {
	return (
		<div css={containerStyle}>
			<NavigateBackIcon onClick={() => {}} />
			<NavigateRefreshIcon onClick={() => {}} />
			<Input placeholder="Enter URL to test" CSS={inputStyle} />
			<Button bgColor="tertiary-outline" CSS={buttonStyle}>
				Start
			</Button>
		</div>
	);
};

const containerStyle = css`
	display: flex;
	align-items: center;
	padding: 8rem;
	* {
		padding: 0rem 12rem;
	}
`;
const inputStyle = css`
	width: 340px;
	height: 34px;
	left: 121px;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14.6px;
	line-height: 17px;
	border: 1px solid #9462ff;
	outline-color: #9462ff;
	box-sizing: border-box;
	border-radius: 4px;
	color: rgba(255, 255, 255, 0.93);
`;
const buttonStyle = css`
	font-size: 14rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4px;
	width: 93px;
	height: 34px;
`;
export default Toolbar;
