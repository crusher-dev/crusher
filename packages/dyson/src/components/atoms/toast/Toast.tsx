import { css } from "@emotion/react";
import { CloseSVG } from "../../icons/CloseSVG";
import { ReactElement } from "react";

type Toast = {
	children: ReactElement | string;
	onClose: Function;
	type: "normal" | "success" | "info" | "error";
};

export const Toast = ({ children, onClose, type = "normal" }: Toast) => {
	return (
		<div css={[alertContainer, postionCSS, type === "success" && success, type === "error" && error]} className={"flex items-center justify-between"}>
			<div>{children}</div>
			<CloseSVG height={12} width={12} onClick={onClose}></CloseSVG>
		</div>
	);
};

const postionCSS = css`
	position: fixed;
	z-index: 100000000;
	top: 50rem;
	left: 50%;
	transform: translateX(-50%);
`;

const alertContainer = css`
	min-width: 343rem;
	height: 36rem;

	padding: 0rem 16rem 0 16rem;

	font-weight: 500;

	border-radius: 12rem;

	border: 0.5px solid rgba(50, 50, 50, 0.78);
    box-shadow: 0px 0px 0px 5px rgb(0 0 0 / 34%);
	background: #171718;
	
	div{
		font-size: 14.5rem;
		letter-spacing: .2px;
	}

	color: #D1D5DB;
`;

const success = css`
	background: #31CA74;
	border: 1px solid #0c0c0c6b;
	color: #0C0C0C;
	path {
		fill: #0C0C0C;
	}
`;
const error = css`
	background: #EA3E5D;
	border: 1px solid #fc5d84;
	color: #D1D5DB;

	svg {
		margin-left: 8rem;
	}
	path {
		fill: #D1D5DB;
	}
`;
