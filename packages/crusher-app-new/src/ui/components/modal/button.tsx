import React from "react";
import { css } from "@emotion/core";

interface iProps {
	title: string;
	onClick: () => void;
	containerCss: any;
}

const ModalButton = (props: iProps) => {
	const { onClick, title, containerCss } = props;
	return (
		<div css={[buttonCss, containerCss]} onClick={onClick}>
			{title}
		</div>
	);
};

const buttonCss = css`
	&:hover {
		background: #3c59cf;
	}
	background: #6583fe;
	padding: 1rem;
	width: 100%;
	text-align: center;
	font-family: Gilroy;
	font-weight: bold;
	color: #fff;
	font-size: 1.126rem;
	line-height: 1.126rem;
	cursor: pointer;
	font-weight: 700;
	border-radius: 0.31rem;
`;

export { ModalButton };
