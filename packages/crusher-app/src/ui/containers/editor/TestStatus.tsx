import React from "react";
import { css } from "@emotion/core";
import { ProgressBar } from "@ui/components/app/ProgressBar";
import { LiveLogsActions } from "@ui/components/editor/LiveLogsActions";
import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";
import { iAction } from "@crusher-shared/types/action";

interface TestStatusProps {
	logs: iLiveStepLogs[];
	actions: iAction[];
	isAborted?: boolean;
}

function TestStatus(props: TestStatusProps) {
	const { logs, actions } = props;

	const actionsCount = actions.length;

	return (
		<div css={containerCSS}>
			<div css={infoHeadingCSS}>{"We're verifying your test in background"}</div>
			<ProgressBar progress={(logs.length / actionsCount) * 100} style={{ width: "100%", height: "0.38rem", marginTop: "0.9rem" }} />
			<div css={statusDescContainerCSS}>
				<span>You can go ahead and save test.</span>
				<span css={stepsStatusCSS}>
					{logs.length}/{actionsCount} Steps
				</span>
			</div>
			<div css={liveLogsContainerCSS}>
				<LiveLogsActions isAborted={props.isAborted} actions={actions} logs={logs} />
			</div>
		</div>
	);
}

const containerCSS = css`
	margin-top: 3.9rem;
	width: 90%;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
`;
const infoHeadingCSS = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1rem;
`;
const statusDescContainerCSS = css`
	margin-top: 0.9rem;
	font-family: Gilroy;
	font-weight: 500;
	font-style: normal;
	font-size: 0.75rem;
	color: #2d3958;
`;
const stepsStatusCSS = css`
	float: right;
	font-weight: bold;
`;
const liveLogsContainerCSS = css`
	margin-top: 2.25rem;
`;

export { TestStatus };
