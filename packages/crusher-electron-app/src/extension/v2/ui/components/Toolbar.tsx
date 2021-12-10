import React from "react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { css } from "@emotion/react";
import { NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "crusher-electron-app/src/extension/assets/icons";

const Toolbar = (): JSX.Element => {
	return (
		<div css={containerStyle}>
			<NavigateBackIcon onClick={() => 0} disabled />
			<NavigateRefreshIcon onClick={() => 0} disabled />
			<Input placeholder="Enter URL to test" CSS={inputStyle} />
			<Button bgColor="tertiary-outline" CSS={buttonStyle}>
				Start
			</Button>
			<div
				css={css`
					display: block;
					width: 8px;
					height: 8px;
					background: #a8e061;
					border-radius: 50px;
					margin: 0rem;
				`}
			/>
			<Text
				CSS={css`
					font-family: Cera Pro;
					font-style: normal;
					font-weight: normal;
					font-size: 13px;
					line-height: 13px;
					flex-grow: 1;
				`}
			>
				Rec.
			</Text>

			<SettingsIcon />
			<Button
				bgColor="tertiary-outline"
				CSS={css`
					width: 113px;
					height: 30px;
					background: linear-gradient(0deg, #9462ff, #9462ff);
					border-radius: 6px;
					font-family: Gilroy;
					font-style: normal;
					font-weight: normal;
					font-size: 14px;
					line-height: 17px;

					color: #ffffff;
				`}
			>
				Save test
			</Button>
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
