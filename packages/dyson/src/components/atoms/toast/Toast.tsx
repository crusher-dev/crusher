import { css } from "@emotion/react";
import { CloseSVG } from "../../icons/CloseSVG";
import { ReactElement } from "react";

type Toast = {
	children: ReactElement;
	onClose: Function;
	type: "normal" | "success" | "info" | "error";
};
export const Toast = ({ children, onClose, type = "normal" }) => {
	return (
		<div
			css={[alertContainer, postionCSS, success, type === "success" && success, type === "error" && error]}
			className={"flex items-center justify-between"}
		>
			<div>{children}</div>
			<CloseSVG height={12} width={12} onClick={onClose && onClose}></CloseSVG>
		</div>
	);
};

const postionCSS = css`
	position: fixed;
	top: 50rem;
	left: 50%;
	transform: translateX(-50%);

	box-shadow: 0px 4px 5px rgba(31, 28, 28, 0.4);
`;

const alertContainer = css`
	min-width: 343px;
	height: 36px;

	padding: 2rem 12rem 0 16rem;

	font-size: 14rem;
	line-height: 14rem;
	font-weight: 500;

	background: #1e2126;
	border: 1px solid #2d3339;
	border-radius: 5px;
`;

const success = css`
	background: #89dd7b;
	border: 1px solid #7bdb6c;
	color: #23401e;
	path {
		fill: #23401e;
	}
`;
const error = css`
	background: #ec7eb3;
	border: 1px solid #fc5da9;
	color: #592c42;

	path {
		fill: #592c42;
	}
`;
