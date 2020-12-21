import React from "react";
import { css } from "@emotion/core";
import { Conditional } from "../common/Conditional";
import { PIXEL_REM_RATIO } from "@constants/other";

interface iSettingsContentHeader {
	title: string;
	desc: string;
	button?: React.ReactElement;
}
const SettingsContentHeader = (props: iSettingsContentHeader) => {
	const { title, desc, button } = props;

	return (
		<div css={containerCSS}>
			<Conditional If={button}>
				<div css={headerWithButtonCSS}>
					<div css={headerWithButtonContent}>
						<div className={"settingPageHeading"} css={settingPageHeadingCSS}>
							{title}
						</div>
						<Conditional If={desc}>
							<div className={"settingPageDesc"} css={settingPageDescCSS}>
								{desc}
							</div>
						</Conditional>
					</div>
					<div css={buttonContainerCSS}>{button}</div>
				</div>
			</Conditional>
			<Conditional If={!button}>
				<div className={"settingPageHeading"} css={settingPageHeadingCSS}>
					{title}
				</div>

				<Conditional If={desc}>
					<div className={"settingPageDesc"} css={settingPageDescCSS}>
						{desc}
					</div>
				</Conditional>
			</Conditional>
		</div>
	);
};

const containerCSS = css`
	color: #323232;
`;
const buttonContainerCSS = css`
	cursor: pointer;
`;

const headerWithButtonCSS = css`
	display: flex;
	padding-right: ${4 / PIXEL_REM_RATIO}rem;
`;
const headerWithButtonContent = css`
	flex: 1;
`;
const settingPageHeadingCSS = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 900;
	font-size: ${20 / PIXEL_REM_RATIO}rem;
`;

const settingPageDescCSS = css`
	font-family: Gilroy;
	font-weight: 500;
	margin-top: ${13 / PIXEL_REM_RATIO}rem;
`;

export { SettingsContentHeader };
