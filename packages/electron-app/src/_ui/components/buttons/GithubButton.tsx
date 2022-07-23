import React from "react";
import { Button } from "@dyson/components/atoms";
import { css } from "@emotion/react";
import { GithubIcon } from "electron-app/src/ui/icons";

const GithubButton = (props) => {
	return (
		<Button
			onClick={(e) => e.preventDefault()}
			bgColor="tertiary-outline"
			css={buttonCss}
			{...props}
		>
			<GithubIcon css={iconCss}/>
			<span css={textCss}>Github</span>
		</Button>
	);
};

const iconCss = css`
    width: 18rem;
    margin-left: 2rem;
`;

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
const buttonCss = css`
	box-sizing: content-box;

	height: 38rem;
	width: 112rem;
	display: flex;
	align-items: center;
	background: linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	border: none;
	:hover {
		background: linear-gradient(133.85deg, #905cff 25.39%, #6d55ff 74.5%, #6951ff 74.5%);
		opacity: 0.8;
		border: none;
	}
`;

export { GithubButton };