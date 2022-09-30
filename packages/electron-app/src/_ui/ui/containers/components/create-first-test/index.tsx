import React from "react";
import { css } from "@emotion/react";
import { Link } from "../../../components/Link";
import { Button } from "@dyson/components/atoms/button/Button";
import { shell } from "electron";


export const ActionButton = ({ title, className, onClick }) => {
	return (
		<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(e);
			}}
			className={String(className)}
			bgColor="tertiary-outline"
			css={saveButtonStyle}
		>
			<span>{title}</span>
		</Button>
	);
};

const saveButtonStyle = css`
	width: 92rem;
	height: 30rem;
	background: #a966ff;
	border-radius: 6rem;

	font-weight: 600;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
	}
`;

export const DocsGoBackActionBar = ({ buttonTitle, buttonCallback }) => {

	return (
		<div css={actionsContainerStyle}>
			<ActionButton title={buttonTitle} onClick={buttonCallback} css={createButtonStyle} />
		</div>
	);
};



const createButtonStyle = css`
	margin-left: 12rem;
`;


const actionsContainerStyle = css`
	display: flex;
	margin-top: 20rem;
	justify-content: center;
	align-items: center;
`;

