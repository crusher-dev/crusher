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
	logs: Array<LiveLogs>,
): Array<ActionsWithStatus> {
	let actionsIndex = 0;

	const out = [];

	console.log(actions);

	for (let i = 0; i < logs.length; i++) {
		const action = actions[actionsIndex];
		if (actions[actionsIndex++].type === logs[i].actionType) {
			const descFunction = ACTION_DESCRIPTIONS[action.type];
			console.log(action.type);
			const selector = action.payload.selectors
				? action.payload.selectors[0].value
				: null;
			//@ts-ignore
			out.push({
				event_type: logs[i].actionType,
				selector: selector,
				desc:
					typeof descFunction === "function"
						? ACTION_DESCRIPTIONS[action.type]({
								selector: (action.payload.meta.selectors[0] as any).value,
								value: action.payload.meta.value,
						  })
						: "",
				timeTaken: logs[i].meta.timeTaken,
				isCompleted: true,
			});
		} else {
			break;
		}
	}

	for (let i = actionsIndex; i < actions.length; i++) {
		const action = actions[i];
		const descFunction = ACTION_DESCRIPTIONS[action.type];
		console.log(action.type);

		//@ts-ignore
		out.push({
			event_type: action.type,
			selector: action.payload.selectors ? action.payload.selectors[0].value : "",
			desc:
				typeof descFunction === "function"
					? ACTION_DESCRIPTIONS[action.type]({
							selector: (action.payload.selectors[0] as any).value,
							value: action.value,
					  })
					: "",
			timeTaken: null,
			isCompleted: false,
		});
	}

	return out;
}

function LiveLogsActions(props: LiveLogsActionsProps) {
	const { actions, logs } = props;
	const logsWithStatus = getLogsWithStatus(actions, logs);
	const lastDone = React.createRef();
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
