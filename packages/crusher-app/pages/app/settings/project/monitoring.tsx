import React from "react";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import MonitoringCard from "@ui/containers/settings/monitoringCard";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";

const MonitoringSettings = () => {
	const cardInfo: iContentsOfModal = {
		title: "Prod Monitoring",
		host: "Production",
		tags: "Production",
		countries: "Screen/2020",
		duration: "Every 10 sec",
		escalation: "Production",
	};

	return (
		<div css={monitoringCSS}>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader
					title={"Monitoring"}
					desc={"List of all team members in current project"}
					button={<Monitor onClick={buttonTest} />}
				/>
				<div css={containerCSS}>
					<MonitoringCard
						title={"Prod Monitoring"}
						host={"Production"}
						tags={["Production", "Development"]}
						countries={["India", "UK"]}
						duration={1800}
						escalation={"Production"}
					/>
				</div>
			</SettingsContent>
		</div>
	);
};

interface iContentsOfModal {
	title: string;
	host: string;
	tags: string;
	countries: string;
	duration: string;
	escalation: string;
}

interface iButtonProps {
	onClick: () => void;
}

const Monitor = (props: iButtonProps) => {
	const { onClick } = props;
	return (
		<div css={buttonCSS} onClick={onClick}>
			Add Monitoring
		</div>
	);
};

const buttonTest = () => {
	console.log("Hello World");
};

const containerCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 100%;
	margin-top: ${42 / PIXEL_REM_RATIO}rem;
`;

const monitoringCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const buttonCSS = css`
	background: #5286ff;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	padding: ${8 / PIXEL_REM_RATIO}rem ${8 / PIXEL_REM_RATIO}rem;
	min-width: ${180 / PIXEL_REM_RATIO}rem;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	font-weight: 600;
	color: #fff;
	text-align: center;
`;

const settingContentCSS = css`
	width: ${720 / PIXEL_REM_RATIO}rem;
`;

export default withSession(WithSettingsLayout(MonitoringSettings));
