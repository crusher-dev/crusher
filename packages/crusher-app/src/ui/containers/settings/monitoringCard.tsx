import React from "react";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";

interface iMonitoringCardProps {
	title: string;
	host: string;
	tags?: Array<string>;
	countries?: Array<string>;
	duration: number;
	escalation?: string;
}

interface iMonitoringInfoLabelProps {
	title: string;
	value: string | number;
}
const MonitoringInfoLabel = (props: iMonitoringInfoLabelProps) => {
	const { title, value } = props;

	return (
		<div css={infoLabelCSS}>
			<span css={infoLabelTitleCSS}>{title}:</span>
			<span css={infoLabelValueCSS}>{value}</span>
		</div>
	);
};

function MonitoringCard(props: iMonitoringCardProps) {
	const { title, host, tags, countries, duration, escalation } = props;

	return (
		<div css={containerCSS}>
			<div css={headerCSS}>
				<strong css={monitoringNameCSS}>{title}</strong>
				<div>
					<span css={monitoringEditActions}>Copy Template</span>
					<span css={monitoringEditActions}>Edit</span>
				</div>
			</div>
			<div css={mainContentCSS}>
				<div css={infoContentCSS}>
					<MonitoringInfoLabel title={"Host"} value={host} />
					<MonitoringInfoLabel title={"Duration"} value={duration} />
					<MonitoringInfoLabel
						title={"Tags/Test"}
						value={tags ? tags.join(", ") : "N/A"}
					/>
					<MonitoringInfoLabel
						title={"Escalation"}
						value={escalation ? escalation : "N/A"}
					/>
					<MonitoringInfoLabel
						title={"Countries"}
						value={countries ? countries.join(", ") : "N/A"}
					/>
				</div>
				<div css={monitoringQuickActionsCSS}>
					<div css={runNowCSS}>Run Now</div>
					<button css={viewBuildCSS}>View Builds</button>
				</div>
			</div>
		</div>
	);
}

const headerCSS = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const monitoringEditActions = css`
	cursor: pointer;

	&:not(:first-child) {
		margin-left: 1rem;
	}
`;

const monitoringQuickActionsCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;

const runNowCSS = css`
	text-align: right;
`;

const containerCSS = css`
	font-family: Gilroy;
	background: #ffffff;
	border: ${2 / PIXEL_REM_RATIO}rem solid #e6e6e6;
	box-sizing: border-box;
	border-radius: ${8 / PIXEL_REM_RATIO}rem;
	display: flex;
	flex-direction: column;
	padding: ${25 / PIXEL_REM_RATIO}rem ${36 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: 12rem;
`;

const monitoringNameCSS = css`
	font-size: 1.2rem;
	line-height: 1.25rem;
	color: #323232;
	padding-top: 0;
	margin-top: 2px;
`;

const infoLabelCSS = css`
	font-size: 0.9rem;
	line-height: 1.125rem;
	color: #323232;
`;

const infoLabelTitleCSS = css`
	color: #9b9b9b;
`;
const infoLabelValueCSS = css`
	margin-left: ${8 / PIXEL_REM_RATIO}rem;
`;

const viewBuildCSS = css`
	background: #ffffff;
	border: ${1 / PIXEL_REM_RATIO}rem solid #c4c4c4;
	box-sizing: border-box;
	border-radius: ${6 / PIXEL_REM_RATIO}rem;
	font-weight: 600;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	height: 1.75rem;
	width: 7.5rem;
	margin-top: ${20 / PIXEL_REM_RATIO}rem;
	color: #323232;
`;

const mainContentCSS = css`
	display: flex;
	justify-content: space-between;
	margin-top: ${23 / PIXEL_REM_RATIO}rem;
`;

const infoContentCSS = css`
	display: grid;
	grid-template-columns: auto auto;
	grid-column-gap: ${36 / PIXEL_REM_RATIO}rem;
	grid-row-gap: ${19 / PIXEL_REM_RATIO}rem;
`;

export default MonitoringCard;
