import React from "react";
import { css } from "@emotion/react";
import { Button } from "@dyson/components/atoms";

const NormalButton = ({ className, onClick, children, ...props }) => {
	return (
		(<Button
			onClick={onClick}
			bgColor="tertiary-outline"
			css={buttonCss}
			className={String(className)}
			{...props}
		>
			{children}
		</Button>)
	);
};


const buttonCss = css`
	box-sizing: content-box;
	display: flex;
	align-items: center;
	background: #B341F9!important;
	border-radius: 8rem !important;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
	font-size: 14rem;
	line-height: 17rem;
	color: #ffffff;
	border: none;
    justify-content: center;
    height: 30rem !important;
	border-color: #B341F9 !important;
	:hover {
		background: #B341F9!important;
		opacity: 0.8;
		border: none;
	}
`;

export { NormalButton };