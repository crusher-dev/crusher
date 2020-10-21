import { TestActionCard } from "@components/testActionCard";
import { css } from "@emotion/core";
import { toPrettyEventName } from "@utils/helpers";
// @ts-ignore
import CodeGenerator from "code-generator";
import ClipboardCopy from "clipboard-copy";
import { NAVIGATE_URL } from "@utils/constants";
import React from "react";

function Step(props) {
	const { action, index, deleteActionCallback } = props;
	const { event_type, selector, value } = action;

	function handleDeleteClick() {
		if (deleteActionCallback) {
			deleteActionCallback(index);
		}
	}

	let valueToShow = "";

	if (event_type === NAVIGATE_URL) {
		valueToShow = value;
	} else {
		valueToShow = selector;
	}
	return (
		<li css={styles.step}>
			<div
				style={{
					width: "0.3rem",
					background: "#648FF4",
					borderColor: "#648FF4",
					borderWidth: "0.05rem",
					borderTopLeftRadius: "0.25rem",
					borderBottomLeftRadius: "0.25rem",
					borderStyle: "solid",
				}}
			></div>
			<div css={styles.innerStep}>
				<div css={styles.stepIndex}>{index + 1}</div>
				<div css={styles.stepInfo}>
					<div css={styles.stepEvent}>{toPrettyEventName(event_type)}</div>
					<div css={styles.stepSelector}>{valueToShow}</div>
				</div>
				<div css={styles.deleteStep} onClick={handleDeleteClick}>
					<img src={"/svg/cross.svg"} width={14} />
				</div>
			</div>
		</li>
	);
}

function RenderSteps(props) {}
export function ActionsListBox(props) {
	const { actions, deleteActionCallback } = props;
	const out = actions.map((action, index) => {
		return (
			<TestActionCard
				action={action}
				isFinished={true}
				style={{ marginBottom: "2rem" }}
				deleteActionCallback={deleteActionCallback}
				index={index}
			/>
		);
	});

	return <ul css={styles.stepsList}>{out}</ul>;
}

const styles = {
	stepsHeadingContainer: css`
		display: flex;
		color: #2d3958;
		align-items: center;
	`,
	stepsHeading: css`
		font-size: 1.25rem;
		font-weight: 700;
	`,
	stepsExport: css`
		font-size: 0.9rem;
		margin-left: auto;
		cursor: pointer;
		span {
			margin-left: 1.25rem;
		}
	`,
	stepsList: css`
		list-style: none;
		padding: 0;
		width: 100%;
		margin-top: 3rem;
		position: relative;
	`,
	step: css`
		display: flex;
		border: 0.05rem solid #d8e9ff;
		border-radius: 0.25rem;
		&:before {
			background-image: linear-gradient(#d8e9ff 45%, rgba(255, 255, 255, 0) 00%);
			background-position: right;
			background-size: 3px 20px;
			background-repeat: repeat-y;
			width: 3px;
			content: "";
			position: absolute;
			top: 0px;
			bottom: 0px;
			left: 1.6rem;
			z-index: 1;
		}
		&:not(:last-child) {
			margin-bottom: 2.2rem;
		}
	`,
	innerStep: css`
		display: flex;
		flex: 1;
		position: relative;
		z-index: 999;
		padding: 0.95rem;
		padding-right: 1.75rem;
		padding-left: 1.125rem;
		padding-bottom: 0.75rem;
		background-color: #fff;
	`,
	stepIndex: css`
		color: #d8e9ff;
		font-weight: 700;
		font-size: 1.05rem;
	`,
	stepInfo: css`
		flex: 1;
		margin-left: 1.25rem;
	`,
	stepEvent: css`
		color: #2d3958;
		font-size: 0.9rem;
		font-weight: 700;
	`,
	stepSelector: css`
		margin-top: 0.25rem;
		font-size: 0.8rem;
	`,
	deleteStep: css`
		width: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			cursor: pointer;
		}
	`,
};
