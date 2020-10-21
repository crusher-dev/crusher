import React from "react";
import { css } from "@emotion/core";
import Button from "../../ui/atom/button";
import ButtonInput from "./buttonInput";

function QuestionInput(props) {
	const { question, options, style, selected, onOptionChange } = props;
	const optionsOut = options.map((option) => {
		return (
			<ButtonInput
				style={{ padding: "0.55rem 3rem" }}
				title={option.value}
				isSelected={option.name === selected}
				onClick={onOptionChange}
				name={option.name}
			/>
		);
	});
	return (
		<div css={styles.questionContainer} style={style}>
			<div css={styles.question}>{question}</div>
			<div css={styles.optionsContainer}>{optionsOut}</div>
		</div>
	);
}

const styles = {
	questionContainer: css`
		&:not(:last-child) {
			margin-bottom: 2rem;
		}
	`,
	question: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: 500;
		font-size: 1.05rem;
		color: #2d3958;
	`,
	optionsContainer: css`
		display: flex;
		margin-top: 1.45rem;
	`,
};

export default QuestionInput;
