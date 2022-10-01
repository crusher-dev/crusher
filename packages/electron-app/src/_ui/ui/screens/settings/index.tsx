import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { SettingsModalContent } from "../../containers/components/toolbar/settingsModal";
import { StickyFooter } from "../../containers/common/stickyFooter";
import { GoBackIcon, SelectedSVG } from "electron-app/src/_ui/constants/icons";
import { hoverStyle } from "electron-app/src/_ui/constants/style";
import { TextBlock } from "@dyson/components/atoms";
import { Conditional } from "@dyson/components/layouts";

const SettingLabel = () => {
	return (<div className="flex item-center" css={hoverStyle}>
		<GoBackIcon height={14} />
		<span css={titleCss} className="ml-4">Settings</span>
	</div>)
}
const SettingsScreen = () => {
	return (
		<CompactAppLayout footer={<StickyFooter />} title={<SettingLabel />} css={containerCss}>
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
`;

export { SettingsScreen };

const GoBack = () => {
	return (
		<div className="flex item-center pl-8" css={hoverStyle}>
			<GoBackIcon height={14} />
			<span className="ml-4 mt-1"> back</span>
		</div>
	)
}

const MenuLabel = ({ children, selected }: any) => {
	return (
		<div className="flex  items-center px-10  pr-8 justify-between w-full" css={[labelCSS, selected && selectedCSS]}>
			{children}
			<div>
				<Conditional showIf={selected}>
					<SelectedSVG />
				</Conditional>
			</div>
		</div>
	)
}

const selectedCSS = css`
	background: rgba(255, 255, 255, 0.05);
	border: 0.5px solid #181818;
	color: #fff;
`
const labelCSS = css`
	height: 26px;
	border: 0.5px solid transparent;
	border-radius: 8px;

font-weight: 500;
font-size: 13px;
letter-spacing: 0.03em;
color: rgba(255, 255, 255, 0.6);
margin-bottom: 6px;
:hover{
	background: rgba(255, 255, 255, 0.05);
	border: 0.5px solid #181818;
	color: #fff;
}

`

const SectionLabel = ({ children, selected }: any) => {
	return (
		<div className="flex  items-center px-8 pr-8 justify-between w-full" css={[sectionLabelCSS]}>
			{children}
			<hr />
		</div>
	)
}

const sectionLabelCSS = css`
	height: 26px;
	border: 0.5px solid transparent;
	border-radius: 8px;

font-weight: 500;
font-size: 13px;
letter-spacing: 0.03em;
color: rgba(255, 255, 255, 0.6);

hr{
    width: 100%;
    border-color: rgba(217, 217, 217, 0.10);
    margin-left: 9px;
}

`

export const SettingsLayout = (props: any) => {
	const { children } = props;
	return (
		<div css={container} className="flex">
			<div css={leftSection} className="py-22 px-16">
				<GoBack />
				<div className="mt-16">
					<MenuLabel selected={true}>
						basic
					</MenuLabel>
					<MenuLabel>
						project
					</MenuLabel>
					<MenuLabel >
						settings
					</MenuLabel>

					<SectionLabel>
						Project
					</SectionLabel>

				</div>
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
	min-width: 229px;
`;
