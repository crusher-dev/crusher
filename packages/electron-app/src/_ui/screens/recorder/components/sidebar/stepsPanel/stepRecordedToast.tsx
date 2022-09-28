import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { AddedIcon } from "electron-app/src/_ui/icons";

const StepRecordedToast = ({meta}) => {
	const { action } = meta;

	return (
		<div className={"flex items-center"} css={containerCss}>
			<AddedIcon css={addedIconCss}/>
			<div css={messageCss} className={"ml-8"}>added a <span css={actionTextCss}>{action}</span> step</div>
		</div>
	);
}


const addedIconCss = css`
	width: 12rem;
	height: 12rem;
	path {
		fill: rgba(255, 114, 68, 1);
	}
`;
const containerCss = css`
	position: fixed;
	bottom: 60rem;
	padding: 14rem 16rem;
	background: #171718;
	border: 0.5px solid rgba(50, 50, 50, 0.78);
	box-shadow: 0px 0px 7px 3px rgba(0, 0, 0, 0.88);
	border-radius: 12px;
	z-index: 9999;
	left: 50%;
	transform: translateX(-50%);
	z-index: 999999;
`;
const actionTextCss = css`
	color: rgba(255, 114, 68, 1);
	font-weight: 600;
`;
const messageCss = css`
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 500;
	font-size: 14rem;
`;
export { StepRecordedToast };