import { ContentArea } from "@ui/containers/ContentArea";
import { css } from "@emotion/core";
import { TEAM_SETTING_MENU_ITEMS } from "@constants/other";
import Link from "next/link";

function LeftMenuComponent({ selected }) {
	return (
        <div>
			<div css={styles.leftSection}>
				<div css={styles.menuHeading}>Teams Settings</div>
				{Object.entries(TEAM_SETTING_MENU_ITEMS).map(([key, value]) => {
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
		</div>
    );
}

export function TeamSettingsTemplate({ selected, children }) {
	return (
		<ContentArea>
			<div css={styles.gridContainer}>
				<LeftMenuComponent selected={selected} />
				<div css={styles.rightSection}>{children}</div>
			</div>
		</ContentArea>
	);
}

const styles = {
	gridContainer: css`
		display: grid;
		grid-template-columns: 16.5rem auto;
		grid-gap: 2rem;
		height: 100%;
		font-family: "DM Sans", sans-serif;
	`,
	leftSection: css`
		background: #f9faff;
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 8px;
	`,
	menuItem: css`
		padding: 0.8rem 1.3rem;
		color: #42454c;

		font-size: 0.95rem;
		cursor: pointer;
		:hover {
		}
	`,
	selectedMenuItem: css`
		background: #ffffff;
		border: 1px solid #d6ddff;
		border-left: 0px;
		font-weight: 500;
		border-right: 0px;
	`,
	menuHeading: css`
		padding: 0.8rem 1.2rem;
		color: #42454c;
		font-size: 0.92rem;
		font-weight: 500;
		padding-bottom: 0.8rem;
	`,
	rightSection: css`
		background: #ffffff;
		border: 1px solid #d6ddff;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 1.65rem 2.25rem;
		color: #42454c;
	`,
};
