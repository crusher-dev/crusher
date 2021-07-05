import React from "react";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import DeleteIcon from "../../../../public/svg/settings/delete.svg";
import { useSelector } from "react-redux";
import { getProjectHosts } from "@redux/stateUtils/monitoring";

interface iProjectHostProps {
	id: number;
	name: string;
	host: string;
	onDelete: (id: number) => void;
}

const ProjectHost = (props: iProjectHostProps) => {
	const { name, host } = props;
	return (
		<li css={projectHostCSS}>
			<div css={projectHostNameCSS}>{name}</div>
			<div css={projectHostValueCSS}>
				<span css={labelCSS}>Host :</span> {host}
			</div>
			{/*<div css={projectDeleteActionCSS}>*/}
			{/*	<DeleteIcon />*/}
			{/*	<span css={projectDeleteButtonTextCSS}>Delete</span>*/}
			{/*</div>*/}
		</li>
	);
};

const labelCSS = css`
	color: #9b9b9b;
`;
const projectHostCSS = css`
	display: flex;
	align-items: center;
	border: ${2 / PIXEL_REM_RATIO}rem solid #e6e6e6;
	padding: ${14 / PIXEL_REM_RATIO}rem ${24 / PIXEL_REM_RATIO}rem;
	border-radius: ${8 / PIXEL_REM_RATIO}rem;
	background: #ffffff;
	font-family: Gilroy;
	&:not(:first-child) {
		margin-top: 0.7rem;
	}
`;
const projectHostNameCSS = css`
	font-weight: 700;
	font-size: ${17 / PIXEL_REM_RATIO}rem;
	color: #323232;
`;
const projectHostValueCSS = css`
	flex: 1;
	margin-left: ${26 / PIXEL_REM_RATIO}rem;
	font-size: ${15 / PIXEL_REM_RATIO}rem;
	color: #323232;
`;
// const projectDeleteActionCSS = css`
// 	display: flex;
// 	font-family: Gilroy;
// 	font-size: ${14 / PIXEL_REM_RATIO}rem;
// 	font-weight: 500;
// 	cursor: pointer;
// `;
//
// const projectDeleteButtonTextCSS = css`
// 	margin-left: ${10 / PIXEL_REM_RATIO}rem;
// 	color: #d94467;
// `;

const ProjectHostsList = () => {
	const hosts = useSelector(getProjectHosts);

	const out = hosts.map((host) => {
		return (
			<ProjectHost
				key={host.id}
				id={host.id}
				name={host.host_name}
				host={host.url}
				onDelete={(id) => {
					console.log("Clicked on ", id);
				}}
			/>
		);
	});
	return <ul>{out}</ul>;
};

export { ProjectHostsList };
