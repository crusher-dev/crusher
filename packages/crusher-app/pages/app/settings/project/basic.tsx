import React, {useState} from "react";

import { cleanHeaders } from "@utils/backendRequest";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { Input } from "@ui/atom/Input";
import EnabledOptionIcon from "../../../../public/svg/settings/enabledOption.svg";
import DisabledOptionIcon from "../../../../public/svg/settings/disabledOption.svg";
import { Conditional } from "@ui/components/common/Conditional";
import { getProjectInfo, getSelectedProject } from "@redux/stateUtils/projects";
import { _getProjectInfo, _updateProjectInfo } from "@services/v2/project";
import { setCurrentProjectInfo } from "@redux/actions/project";
import { useSelector } from "react-redux";
import { iProjectInfoResponse } from "@crusher-shared/types/response/projectInfoResponse";
import { store } from "@redux/store";

interface iFeatureItemProps {
	title: string;
	enabled: boolean;
	onToggleEnable: any;
}

const FeatureItem = (props: iFeatureItemProps) => {
	const { title, enabled, onToggleEnable } = props;

	return (
		<li>
			<div css={featureOptionTitleCSS}>{title}</div>
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
    const projectInfo: iProjectInfoResponse = useSelector(getProjectInfo);

    const [projectName, setProjectName] = useState(projectInfo.name);

    const handleProjectNameChange = (event: any) => {
		setProjectName(event.target.value);
	};

    const saveBasicSettings = () => {
		_updateProjectInfo({ name: projectName }, projectInfo.id).then(() => {
			(store as any).dispatch(
				setCurrentProjectInfo({ ...projectInfo, name: projectName }),
			);
		});
	};

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
					<div css={saveButtonRowCSS}>
						<button css={saveButtonCSS} onClick={saveBasicSettings}>
							Save
						</button>
					</div>
				</div>
			</div>
		</SettingsContent>
	);
};

const saveButtonCSS = css`
	background: #5286ff;
	border: ${2 / PIXEL_REM_RATIO}rem solid #2f65e4;
	box-sizing: border-box;
	padding: ${8 / PIXEL_REM_RATIO}rem;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	min-width: ${154 / PIXEL_REM_RATIO}rem;
	color: #fff;
	font-family: Gilroy;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	text-align: center;
	font-weight: 600;
	border: 1.2px solid #6583fe;
	margin-left: auto;
`;

const saveButtonRowCSS = css`
	display: flex;
	margin-top: ${54 / PIXEL_REM_RATIO}rem;
`;
const featuresFormCSS = css`
	margin-top: ${64 / PIXEL_REM_RATIO}rem;
	font-family: Gilroy;
	color: #323232;
`;

const featureOptionTitleCSS = css`
	font-size: ${15 / PIXEL_REM_RATIO}rem;
`;

const featureOptionCSS = css`
	margin-left: auto;
	display: flex;
	align-items: center;
	cursor: pointer;
	font-size: ${15 / PIXEL_REM_RATIO}rem;
	span {
		margin-left: ${17 / PIXEL_REM_RATIO}rem;
	}
`;
const settingContentCSS = css`
	width: ${600 / PIXEL_REM_RATIO}rem;
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
		padding: ${10 / PIXEL_REM_RATIO}rem ${18 / PIXEL_REM_RATIO}rem;
		font-size: ${15 / PIXEL_REM_RATIO}rem;
	}
`;

ProjectBasicSettings.getInitialProps = async (ctx: any) => {
	const { req, res, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const selectedProject = getSelectedProject(store.getState());

		await _getProjectInfo(parseInt(selectedProject), headers).then(
			(projectInfo) => {
				store.dispatch(setCurrentProjectInfo(projectInfo));
			},
		);

		return {
			isVideoRecordingOn: true,
			isScreenshotOn: true,
			isMultiBrowserSupportOn: true,
		};
	} catch {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(ProjectBasicSettings));
