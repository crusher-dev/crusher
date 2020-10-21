import { css } from "@emotion/core";
import { toPascalCase } from "@utils/helpers";
import React from "react";

function normalizeActionType(type) {
	return type
		.split("_")
		.map((str) => {
			return toPascalCase(str);
		})
		.join(" ");
}

export const TestActionCard = (props) => {
	const { isFinished, style, action } = props;
	console.log(action);
	const defaultSelector = action.selectors[0].value;
	return (
		<div style={style} css={styles.container}>
			<div css={styles.actionInfo}>
				<div css={styles.actionInfoHeading}>
					{normalizeActionType(action.event_type)}
				</div>
				<div css={styles.actionInfoDesc}>
					{defaultSelector.substr(0, 15)}{" "}
					{defaultSelector.length > 15 ? "..." : null}
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

const styles = {
	container: css`
		padding: 0.8rem 2.4rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		border: 1px solid #f3f3f3;
	`,
	actionInfo: css`
		flex: 1;
	`,
	correctContainer: css``,
	actionInfoHeading: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		color: #2d3958;
	`,
	actionInfoDesc: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		color: #2d3958;
		margin-top: 0.4rem;
	`,
	timeTookForStep: css`
		margin-left: 1.2rem;
	`,
};
