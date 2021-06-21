import React from "react";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import RunIcon from "../../../../public/svg/settings/run.svg";
import { RUN_INTERVAL_OPTIONS } from "@constants/testInterval";
import { _runMonitoring } from "@services/monitoring";

interface iMonitoringCardProps {
	id: number;
	title: string;
	host: string;
	tags?: string[];
	countries?: string[];
	duration: number;
	escalation?: string | null;
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
	const { id, title, host, tags, countries, duration, escalation } = props;

	const durationOption = RUN_INTERVAL_OPTIONS.find((intervalOption) => {
		console.log(intervalOption.value, duration);
		return intervalOption.value === duration;
	});

	const runMonitoring = () => {
		_runMonitoring(id)
			.then(() => {
				alert(`Running monitoring #${title} for all the tests`);
			})
			.catch((err: Error) => {
				alert(`Some error occured dduring running monitoring #${title} for all the tests`);
				console.error(err);
			});
	};

	return (
        <div css={containerCSS}>
			<div css={headerCSS}>
				<strong css={monitoringNameCSS}>{title}</strong>
				<span css={monitoringEditButtonCSS}>Edit</span>
				<div css={monitoringRunActionContainerCSS}>
					<div css={runNowCSS} onClick={runMonitoring}>
						<RunIcon />
						<span css={runNowTestCSS}>Run test now</span>
					</div>
				</div>
			</div>
			<div css={mainContentCSS}>
				<div css={infoContentCSS}>
					<MonitoringInfoLabel title={"Host"} value={host} />
					<MonitoringInfoLabel title={"Duration"} value={durationOption ? (durationOption as any).label : `Every ${duration} seconds`} />
					<MonitoringInfoLabel title={"Tags/Test"} value={tags?.length ? tags.join(", ") : "N/A"} />
					<MonitoringInfoLabel title={"Escalation"} value={escalation || "N/A"} />
					<MonitoringInfoLabel title={"Countries"} value={countries?.length ? countries.join(", ") : "N/A"} />
				</div>
				<div css={monitoringQuickActionsCSS}>
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

const monitoringQuickActionsCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;

const runNowCSS = css`
	text-align: right;
	cursor: pointer;
	display: flex;
`;

const runNowTestCSS = css`
	margin-left: ${15 / PIXEL_REM_RATIO}rem;
	font-weight: 500;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	text-decoration-line: underline;
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

const monitoringEditButtonCSS = css`
	margin-left: ${18 / PIXEL_REM_RATIO}rem;
	font-weight: 500;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	color: #323232;
	text-decoration-line: underline;
	cursor: pointer;
`;
const monitoringRunActionContainerCSS = css`
	flex: 1;
	display: flex;
	justify-content: flex-end;
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
