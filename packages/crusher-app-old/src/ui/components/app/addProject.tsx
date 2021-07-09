import PlusSVG from "../../../../public/svg/sidebarSettings/plus.svg";
import React from "react";
import { css } from "@emotion/core";

export function AddProject({ label = "Create a test", onClick }) {
	return (
		<div css={styles.createTestButton} onClick={onClick}>
			<PlusSVG />
			<span css={styles.createTestLabel}>{label}</span>
		</div>
	);
}

const styles = {
	createTestButton: css`
		align-items: center;
		align-self: center;
		display: flex;
		cursor: pointer;
		padding: 20px;
		background: #111313;
		border: 1px solid #111313;
		box-sizing: border-box;
		border-radius: 5px;
		padding: 0.39rem 0.75rem;
		:hover {
			background: #4361ed;
			border: 1px solid #4361ed;
		}
		:hover {
			text-decoration: none !important;
		}
	`,
	createTestLabel: css`
		margin-left: 1.5rem;
		font-weight: 500;
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
