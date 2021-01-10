import React, { useEffect } from "react";
import { LiveLogs } from "@interfaces/LiveLogs";
import { LogActionCard } from "@ui/components/list/testActionCard";
import { css } from "@emotion/core";

import { ACTION_DESCRIPTIONS } from "../../../../../crusher-shared/constants/actionDescriptions";
import { iAction } from "@crusher-shared/types/action";
import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";

interface LiveLogsActionsProps {
	logs: Array<iLiveStepLogs>;
	actions: Array<iAction>;
}

export interface ActionsWithStatus {
	event_type: string;
	desc: string;
	selector: string;
	timeTaken: string;
	isCompleted: boolean;
}

function getLogsWithStatus(
	actions: Array<iAction>,
	logs: Array<iLiveStepLogs>,
): Array<ActionsWithStatus> {
	const actionsIndex = 0;

	const out: Array<ActionsWithStatus> = [];

	for (let i = 0; i < actions.length; i++) {
		const selector = actions[i].payload.selectors
			? actions[i].payload.selectors[0].value
			: null;

		out.push({
			event_type: actions[i].type,
			selector: selector as string,
			desc: "Some description",
			timeTaken: "0",
			isCompleted: logs[i] && logs[i].actionType === actions[i].type,
		});
	}
	console.log(logs, actions, ")__");
	return out;
}

function LiveLogsActions(props: LiveLogsActionsProps) {
	const { actions, logs } = props;
	const logsWithStatus = getLogsWithStatus(actions, logs);
	const lastDone = React.createRef();
	console.log(logsWithStatus, "OGSS");
	const out = logsWithStatus.map((action, index) => {
		const out = (
			<LogActionCard
				key={index}
				isLast={index === actions.length - 1}
				index={index + 1}
				action={action}
				timeTaken={parseInt(action.timeTaken)}
				isActionCompleted={action.isCompleted}
			/>
		);
		return out;
	});

	useEffect(() => {
		if (lastDone.current) {
			(lastDone.current as any).scrollIntoView();
		}
	}, [logs]);

	return <div css={styles.container}>{out}</div>;
}

const styles = {
	container: css`
		overflow: scroll;
		height: 14rem;
		scroll-behavior: smooth;
	`,
};

export { LiveLogsActions };
