import React, { useCallback, useState } from "react";

import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import WithSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { Input } from "@ui/atom/Input";
import EnabledOptionIcon from "../../../../public/svg/settings/enabledOption.svg";
import DisabledOptionIcon from "../../../../public/svg/settings/disabledOption.svg";
import { Conditional } from "@ui/components/common/Conditional";

interface iFeatureItemProps {
	title: string;
	enabled: boolean;
	onToggleEnable: any;
}

const FeatureItem = (props: iFeatureItemProps) => {
	const { title, enabled, onToggleEnable } = props;

	return (
		<li>
			<div>{title}</div>
			<div css={featureOptionCSS} onClick={onToggleEnable}>
				<Conditional If={enabled}>
					<>
						<EnabledOptionIcon />
						<span>Enabled</span>
					</>
				</Conditional>
				<Conditional If={!enabled}>
					<>
						<DisabledOptionIcon />
						<span>Disabled</span>
					</>
				</Conditional>
			</div>
		</li>
	);
};

FeatureItem.defaultProps = {
	enabled: false,
};

const ProjectBasicSettings = () => {
	const [projectName, setProjectName] = useState("Crusher");
	const [featuresInfo, setFeaturesInfo] = useState({
		video_recording: true,
		screenshot: true,
		log_duration_time: false,
		multi_browser_support: false,
	});

	const handleProjectNameChange = (event: any) => {
		setProjectName(event.target.value);
	};

	const handleVideoRecordingToggle = useCallback(() => {
		setFeaturesInfo({
			...featuresInfo,
			video_recording: !featuresInfo.video_recording,
		});
	}, [featuresInfo]);

	const handleScreenshotToggle = useCallback(() => {
		setFeaturesInfo({
			...featuresInfo,
			screenshot: !featuresInfo.screenshot,
		});
	}, [featuresInfo]);

	const handleLogDurationTimeToggle = useCallback(() => {
		setFeaturesInfo({
			...featuresInfo,
			log_duration_time: !featuresInfo.log_duration_time,
		});
	}, [featuresInfo]);

	const handleMultiBrowserSupportToggle = useCallback(() => {
		setFeaturesInfo({
			...featuresInfo,
			multi_browser_support: !featuresInfo.multi_browser_support,
		});
	}, [featuresInfo]);
	return (
		<SettingsContent contentCSS={settingContentCSS}>
			<SettingsContentHeader
				title={"Basic Settings"}
				desc={"Configure crusher name and enable/disables features for the test"}
			/>
			<div css={mainContainerCSS}>
				<Input
					label={"Name of the project"}
					placeholder={"Enter project name"}
					value={projectName}
					onChange={handleProjectNameChange}
					inputContainerCSS={inputContainerCSS}
				/>
				<div css={featuresFormCSS}>
					<div css={featuresHeadingCSS}>Features</div>
					<ul css={featuresListCSS}>
						<FeatureItem
							title={"Video Recording"}
							enabled={featuresInfo.video_recording}
							onToggleEnable={handleVideoRecordingToggle}
						/>
						<FeatureItem
							title={"Screenshot"}
							enabled={featuresInfo.screenshot}
							onToggleEnable={handleScreenshotToggle}
						/>
						<FeatureItem
							title={"Log duration time"}
							enabled={featuresInfo.log_duration_time}
							onToggleEnable={handleLogDurationTimeToggle}
						/>
						<FeatureItem
							title={"Multi browser support"}
							enabled={featuresInfo.multi_browser_support}
							onToggleEnable={handleMultiBrowserSupportToggle}
						/>
					</ul>
				</div>
			</div>
		</SettingsContent>
	);
};

const featuresFormCSS = css`
	margin-top: ${64 / PIXEL_REM_RATIO}rem;
	font-family: Gilroy;
	color: #323232;
`;
const featuresHeadingCSS = css`
	font-size: ${18 / PIXEL_REM_RATIO}rem;
	font-weight: 700;
`;
const featuresListCSS = css`
	margin-top: ${24 / PIXEL_REM_RATIO}rem;
	li {
		display: flex;
		&:not(:first-child) {
			margin-top: ${30 / PIXEL_REM_RATIO}rem;
		}
	}
`;
const featureOptionCSS = css`
	margin-left: auto;
	display: flex;
	align-items: center;
	cursor: pointer;
	span {
		margin-left: ${17 / PIXEL_REM_RATIO}rem;
	}
`;
const settingContentCSS = css`
	width: ${640 / PIXEL_REM_RATIO}rem;
`;
const inputContainerCSS = css`
	width: 100%;
`;
const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: ${547 / PIXEL_REM_RATIO}rem;
	label {
		font-weight: 600;
		font-size: ${16 / PIXEL_REM_RATIO}rem;
		color: #323232;
	}
	input {
		padding: ${12 / PIXEL_REM_RATIO}rem ${20 / PIXEL_REM_RATIO}rem;
		font-size: ${16 / PIXEL_REM_RATIO}rem;
	}
`;

ProjectBasicSettings.getInitialProps = async (ctx: any) => {
	const { req, res } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}
		const cookies = getCookies(req);

		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);

		return {
			isIntegratedWithSlack: false,
			isIntegratedWithRepo: false,
			isIntegratedWithEmail: true,
		};
	} catch (ex) {
		throw ex;
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSettingsLayout(ProjectBasicSettings));
