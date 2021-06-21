import { css } from "@emotion/core";
import { toPascalCase } from "@utils/helpers";
import React from "react";
import { ActionsWithStatus } from "@ui/components/editor/LiveLogsActions";
import { Conditional } from "@ui/components/common/Conditional";

function normalizeActionType(type: any) {
	return type
		.split("_")
		.map((str) => {
			return toPascalCase(str);
		})
		.join(" ");
}

export const TestActionCard = (props: any) => {
	const { isFinished, style, action } = props;
	const defaultSelector = action.selectors[0].value;
	return (
		<div style={{ ...style, fontWeight: isFinished ? "bold" : "regular" }} css={styles.container}>
			<div css={styles.actionInfo}>
				<div css={styles.actionInfoHeading}>{normalizeActionType(action.event_type)}</div>
				<div css={styles.actionInfoDesc}>
					{defaultSelector.substr(0, 15)} {defaultSelector.length > 15 ? "..." : null}
				</div>
			</div>
			{isFinished ? (
				<div css={styles.correctContainer}>
					<img src={"/svg/tests/correct.svg"} style={{ width: "1.05rem" }} />
				</div>
			) : null}
			<div css={styles.timeTookForStep}>Took 1 sec</div>
		</div>
	);
};

interface iLoginActionCardProps {
	index: number;
	action: ActionsWithStatus;
	style?: React.CSSProperties;
	isLast: boolean;
	timeTaken: number;
	isActionCompleted: boolean;
	isActionAborted?: boolean;
	forwardRef?: any;
}
export const LogActionCard = (props: iLoginActionCardProps) => {
	const {
        index,
        action,
        isActionCompleted,
        isActionAborted,
        style,
        isLast,
        forwardRef
    } = props;

	return (
		<div style={{ ...style, fontWeight: isActionCompleted ? 700 : 500 }} css={styles.container} ref={forwardRef}>
			<div css={styles.actionInfo}>
				<div css={styles.actionBoxRow}>
					<div css={styles.actionBoxRowIndex}>{index}.)</div>
					<div css={styles.actionBoxInfo}>
						<div css={styles.actionInfoHeading}>{action.event_type}</div>
						<div css={styles.actionInfoDesc}>{action.selector}</div>
					</div>
				</div>
			</div>
			<div css={styles.correctContainer} style={{ bottom: isLast ? "-0.7rem" : "-2.8rem" }}>
				<Conditional If={isActionCompleted}>
					<img src={"/svg/editor/correctStep.svg"} style={{ width: "1.5rem" }} />
				</Conditional>
				<Conditional If={isActionAborted}>
					<img src={"/svg/editor/wrongStep.svg"} style={{ width: "1.5rem" }} />
				</Conditional>
				<Conditional If={!isActionCompleted && !isActionAborted}>
					<img src={"/svg/editor/notProcessedStep.svg"} style={{ width: "1.5rem" }} />
				</Conditional>

				{!isLast && (
					<div
						style={{
							height: "2rem",
							width: "0.15rem",
							background: "#F3F3F3",
							position: "relative",
							left: "50%",
							transform: "translateX(-50%)",
						}}
					></div>
				)}
			</div>
			{/*<div css={styles.timeTookForStep}>*/}
			{/*	{timeTaken ? (timeTaken / 1000).toFixed(1) : "Few"} sec*/}
			{/*</div>*/}
		</div>
	);
};

const styles = {
	container: css`
		padding: 0.8rem;
		margin-bottom: 2.35rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border: 1px solid #f3f3f3;
		border-radius: 0.25rem;
		font-family: Gilroy;
		position: relative;
		overflow: visible;
		z-index: 24;
	`,
	actionInfo: css`
		flex: 1;
	`,
	correctContainer: css`
		position: absolute;
		bottom: -2.8rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 23;
	`,
	actionInfoHeading: css`
		font-family: Gilroy;
		font-style: normal;
		color: #2d3958;
	`,
	actionInfoDesc: css`
		font-family: Gilroy;
		font-style: normal;
		font-weight: normal;
		color: #2d3958;
		margin-top: 0.25rem;
	`,
	timeTookForStep: css`
		margin-left: 1.2rem;
	`,
	actionBoxRow: css`
		display: flex;
	`,
	actionBoxRowIndex: css`
		margin-right: 0.5rem;
	`,
	actionBoxInfo: css`
		flex: 1;
	`,
};
