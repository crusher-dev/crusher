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
	background: #6583fe;
	padding: 0.65rem;
	width: 100%;
	text-align: center;
	font-family: Gilroy;
	font-weight: bold;
	color: #fff;
	font-size: 0.9rem;
	cursor: pointer;
`;

export { ModalButton };
