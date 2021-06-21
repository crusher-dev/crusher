import { css } from "@emotion/core";
import { PROJECT_MENU_ITEMS } from "@constants/other";
import Link from "next/link";
import React from "react";

function LeftMenuComponent({ selected }) {
	return (
        <div css={styles.leftSection}>
			<div css={styles.menuHeading}>Project Settings</div>
			{Object.entries(PROJECT_MENU_ITEMS).map(([key, value]) => {
				const isSelected = value === selected;
				return (
					<Link href={key.toLowerCase()}>
						<a>
							<div css={[styles.menuItem, isSelected && styles.selectedMenuItem]} key={key}>
								{value}
							</div>
						</a>
					</Link>
				);
			})}
		</div>
    );
}

export function ProjectSettingsTemplate({ selected, children, heading }) {
	return (
		<div css={styles.gridContainer}>
			<LeftMenuComponent selected={selected} />
			<div>
				<div css={styles.heading}>{heading}</div>
				<div css={styles.rightSection}>{children}</div>
			</div>
		</div>
	);
}

const styles = {
	heading: css`
		font-size: 1.2rem;
		font-weight: 500;
		color: #2b2b39;
	`,
	gridContainer: css`
		display: grid;
		grid-template-columns: 16.5rem auto;
		grid-gap: 3rem;
		height: 100%;
		font-family: "DM Sans", sans-serif;
	`,
	leftSection: css`
		background: #fff;
		border: 1px solid #f2f2f2;
		box-sizing: border-box;
		border-radius: 8px;
		align-self: flex-start;
	`,
	menuItem: css`
		padding: 0.8rem 1.3rem;
		color: #42454c;
		font-size: 0.97rem;
		cursor: pointer;
		:hover {
		}
	`,
	selectedMenuItem: css`
		background: #f2f2f2;
		border: 1px solid #f2f2f2;
		border-left: 0px;
		font-weight: 500;
		border-right: 0px;
	`,
	menuHeading: css`
		padding: 0.8rem 1.2rem;
		color: #42454c;
		font-size: 1rem;
		font-weight: 500;
		padding-bottom: 0.8rem;
	`,
	rightSection: css`
		background: #ffffff;
		border: 1px solid #f2f2f2;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 2.25rem 2.25rem;
		color: #42454c;
		margin-top: 1.25rem;
	`,
};
