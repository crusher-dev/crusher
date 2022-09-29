import React from "react";
import { css } from "@emotion/react";
import { GithubIcon } from "electron-app/src/app/old_icons";
import { Button } from "@dyson/components/atoms";

const NormalButton = ({className, onClick, children, ...props}) => {
	return (
		<Button
			onClick={onClick}
			bgColor="tertiary-outline"
			css={buttonCss}
			className={`${className}`}
			{...props}
		>
			{children}
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
	display: flex;
	align-items: center;
	background: #B341F9!important;
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	border: none;
    justify-content: center;
    height: 28rem !important;
	:hover {
		background: #B341F9!important;
		opacity: 0.8;
		border: none;
	}
`;

export { NormalButton };