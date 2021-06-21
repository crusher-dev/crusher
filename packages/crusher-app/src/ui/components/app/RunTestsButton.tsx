import React from "react";
import { css } from "@emotion/core";

interface iRunTestButtonProps {
	label: string;
	onClick?: any;
}
export function RunTestButton(props: iRunTestButtonProps) {
	const { onClick } = props;

	return (
		<div css={styles.createTestButton} onClick={onClick}>
			<span css={styles.createTestLabel}>Run tests</span>
		</div>
	);
}

RunTestButton.defaultProps = {
	label: "Create a test",
};

const styles = {
	createTestButton: css`
    align-items: center;
    align-self: center;
    display: flex;
    cursor: pointer;
    background: #242428;
    border: 1px solid #242428;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 0.5rem 1.5rem;
    text-align: center;

    :hover {
      background: #37383b;
    }

    :hover {
      text-decoration: none !important;
    }
	`,
	createTestLabel: css`
		font-size: 1.06rem;

		align-self: center;
		color: #fff;
		font-weight: 600;
		text-decoration: none !important;
		:hover {
			text-decoration: none !important;
		}
	`,
};
