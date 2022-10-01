import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { SettingsModalContent } from "../../containers/components/toolbar/settingsModal";
import { StickyFooter } from "../../containers/common/stickyFooter";

const SettingsScreen = () => {
	return (
		<CompactAppLayout footer={<StickyFooter />} title={<span css={titleCss}>Settings</span>} css={containerCss}>
			<SettingsLayout>
				<SettingsModalContent />
			</SettingsLayout>
		</CompactAppLayout>
	);
};

const containerCss = css`
	height: 100%;
	background: #080808;
	position: relative;
`;

const titleCss = css`
	font-family: Cera Pro;

	font-weight: 500;
	font-size: 13.4px;
	color: #ffffff;
`;

export { SettingsScreen };

export const SettingsLayout = (props: any) => {
	const { children } = props;
	return (
		<div css={container} className="flex">
			<div css={leftSection} className="py-16 px-16">
				sd
			</div>
			<div className="w-full">{children}</div>
		</div>
	);
};

const container = css`
	background: #080808;
	border-width: 0.5px 0.5px 0px 0.5px;
	border-style: solid;
	border-color: rgba(153, 153, 153, 0.12);
	font-size: 13px;
	min-height: 568px;
	margin-top: -10px;
`;

const leftSection = css`
	background: #080808;
	border-right: 0.5px solid rgba(153, 153, 153, 0.12);
	min-width: 220px;
`;
