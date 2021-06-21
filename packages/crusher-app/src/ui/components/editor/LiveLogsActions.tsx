import React, { RefObject, useEffect } from "react";
import { LogActionCard } from "@ui/components/list/testActionCard";
import { css } from "@emotion/core";

import { iAction } from "@crusher-shared/types/action";
import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";

interface LiveLogsActionsProps {
	isAborted?: boolean;
	logs: iLiveStepLogs[];
	actions: iAction[];
}

export interface ActionsWithStatus {
	event_type: string;
	desc: string;
	selector: string;
	timeTaken: string;
	isCompleted: boolean;
}

function getLogsWithStatus(actions: iAction[], logs: iLiveStepLogs[]): ActionsWithStatus[] {
	const out: ActionsWithStatus[] = [];

	for (let i = 0; i < actions.length; i++) {
		const selector = actions[i].payload.selectors ? (actions[i].payload.selectors as any)[0].value : null;

		out.push({
			event_type: actions[i].type,
			selector: selector as string,
			desc: "Some description",
			timeTaken: "0",
			isCompleted: logs[i] && logs[i].actionType === actions[i].type,
		});
	}
	return out;
}

function LiveLogsActions(props: LiveLogsActionsProps) {
	const { actions, logs, isAborted } = props;
	const logsWithStatus = getLogsWithStatus(actions, logs);
	const lastDone: RefObject<HTMLDivElement> = React.createRef();
	let isLastLog = false;
	const out = logsWithStatus.map((action, index) => {
		if (index > 0 && !logsWithStatus[index - 1].isCompleted) return null;
		if (index >= logs.length - 1) {
			isLastLog = true;
		}

		const out = (
			<LogActionCard
				key={index}
				isLast={index === actions.length - 1}
				index={index + 1}
				forwardRef={isLastLog ? lastDone : null}
				action={action}
				timeTaken={parseInt(action.timeTaken)}
				isActionCompleted={action.isCompleted}
				isActionAborted={!action.isCompleted && isAborted}
			/>
		);
		return out;
	});

	useEffect(() => {
		if (lastDone.current) {
			lastDone.current.scrollIntoView();
		}
	}, [logs]);

	return (
		<>
			<div css={styles.container}>{out}</div>
			<style>
				{`
			/* Scrollbar */
::-webkit-scrollbar {
    width: .45rem;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(27, 27, 27, .4);
    border-radius: 3px;
}
::-webkit-scrollbar-track{
    background: transparent;
}
`}
				`
			</style>
		</>
	);
}

const styles = {
	container: css`
		height: 14rem;
		overflow: scroll;
		scroll-behavior: smooth;
	`,
};

export { LiveLogsActions };
