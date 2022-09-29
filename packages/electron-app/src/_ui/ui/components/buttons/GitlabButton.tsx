import React from "react";
import { Button } from "@dyson/components/atoms";
import { GithubIcon } from "electron-app/src/_ui/old_icons";
import { css } from "@emotion/react";

const GitlabButton = (props) => {
	return (
		<Button
			onClick={(e) => e.preventDefault()}
			bgColor="tertiary-outline"
			css={buttonCss}
			{...props}
		>
			<GithubIcon
				css={iconCss}
			/>
			<span css={textCss}>Gitlab</span>
		</Button>
	);
};


const buttonCss = css`
	box-sizing: content-box;
	height: 40rem;
	width: 112rem;
	display: flex;
	align-items: center;
	background: linear-gradient(0deg, #0b0b0d, #0b0b0d), linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
	border: 0.5rem solid rgba(70, 76, 87, 0.45);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	:hover {
		background: linear-gradient(0deg, #0b0b0d, #0b0b0d), linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
		border: 0.5px solid rgba(70, 76, 87, 0.45);
		opacity: 0.8;
	}
`;

const iconCss = css`width: 18rem`;

const textCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 700;
	font-size: 14rem;
	text-align: center;
	letter-spacing: -0.0032em;

	color: #ffffff;
	margin-left: auto;
	margin-right: 12rem;
`;

export { GitlabButton };
