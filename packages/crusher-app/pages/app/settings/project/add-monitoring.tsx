import React from "react";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import MonitoringCard from "@ui/containers/settings/monitoringCard";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";

const AddMonitoringSettings = () => {
	return (
		<div css={monitoringCSS}>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader
					title={"Add Monitoring"}
					desc={"List of all team members in current project"}
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

const settingContentCSS = css`
	width: ${720 / PIXEL_REM_RATIO}rem;
`;

export default withSession(WithSettingsLayout(AddMonitoringSettings));
