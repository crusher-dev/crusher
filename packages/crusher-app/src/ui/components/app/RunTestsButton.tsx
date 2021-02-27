import PlusSVG from "../../../../public/svg/sidebarSettings/plus.svg";
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
		background: #5b76f7;
		border: 1px solid #3f60f5;
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.5rem 1.5rem;
		text-align: center;
		:hover {
			background: #4361ed;
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
