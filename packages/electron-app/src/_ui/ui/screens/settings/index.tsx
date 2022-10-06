import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { SettingsModalContent } from "../../containers/components/toolbar/settingsModal";
import { StickyFooter } from "../../containers/common/stickyFooter";
import { GoBackIcon, SelectedSVG } from "electron-app/src/_ui/constants/icons";
import { hoverStyle } from "electron-app/src/_ui/constants/style";
import { TextBlock } from "@dyson/components/atoms";
import { Conditional } from "@dyson/components/layouts";
import { useNavigate } from "react-router-dom";
import { IntegrationSettings } from "./integrationSettings";
import { atom, useAtom } from "jotai";

const goBackToProjectPage = (navigate) => {
	navigate("/");
}
const SettingLabel = () => {
	const navigate = useNavigate();
	return (<div className="flex item-center" css={hoverStyle} onClick={goBackToProjectPage.bind(this, navigate)}>
		<GoBackIcon height={14} />
		<span css={titleCss} className="ml-4">Settings</span>
	</div>)
}

const settingsAtom = atom<string>("integrations");

const SettingsScreen = () => {
	const [section, _] = useAtom(settingsAtom);
	return (
		<CompactAppLayout footer={<StickyFooter />} title={<SettingLabel />} css={containerCss}>
			<SettingsLayout>
				{section === "integrations" ? (
					<div className={"px-22 py-24"}>
						<IntegrationSettings />
					</div>
				) : ""}

				{section === "basic" ? (<SettingsModalContent />) : ""}
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
	const navigate = useNavigate();
	return (
		<div
			title="go back"
			className="flex item-center pl-8" css={hoverStyle} onClick={goBackToProjectPage.bind(this, navigate)}>
			<GoBackIcon height={14} />
			<span className="ml-4 mt-1"> back</span>
		</div>
	)
}

const MenuLabel = ({ children, selected, className, ...props }: any) => {
	return (
		<div className={`flex  items-center px-10  pr-8 justify-between w-full ${className}`} css={[labelCSS, selected && selectedCSS]} {...props}>
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
	const [section, setSection] = useAtom(settingsAtom);


	return (
		<div css={container} className="flex">
			<div css={leftSection} className="py-22 px-16">
				<GoBack />
				<div className="mt-16">
					<MenuLabel onClick={setSection.bind(this, "basic")} selected={section === "basic"}>
						basic
					</MenuLabel>

					<SectionLabel>
						Project
					</SectionLabel>
					<MenuLabel onClick={setSection.bind(this, "integrations")} selected={section === "integrations"}>
						integration
					</MenuLabel>

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
