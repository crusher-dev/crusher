import React, { ChangeEvent, useState } from "react";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import Button from "@ui/atom/Button";
import { _addHostToProject } from "@services/projects";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import Router from "next/router";

interface iInputLabelProps {
	label: string;
	value: string;
	placeholder?: string;
	onChange?: any;
}
const InputLabel = (props: iInputLabelProps) => {
	const { label, value, onChange, placeholder } = props;

	return (
		<div css={inputWithLabelCSS}>
			<div css={labelCSS}>{label}</div>
			<input css={inputCSS} placeholder={placeholder} value={value} onChange={onChange} />
		</div>
	);
};

const AddHostSettings = () => {
	const [hostName, setHostName] = useState("");
	const [hostUrl, setHostUrl] = useState("");
	const selectedProject = useSelector(getSelectedProject);

	const handleAddHost = () => {
		if (!(hostName.length && hostUrl.length)) {
			alert("Please fill all the fields");
		}
		_addHostToProject(hostName, hostUrl, selectedProject).then(() => {
			Router.replace("/app/settings/project/monitoring");
		});
	};

	const handleHostNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setHostName(event.target.value);
	};
	const handleHostUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
		setHostUrl(event.target.value);
	};

	return (
		<div css={monitoringCSS}>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader title={"Add Monitoring"} desc={"List of all team members in current project"} />
				<div css={containerCSS}>
					<div css={formContainerCSS}>
						<InputLabel placeholder={"Host name"} label={"Name"} onChange={handleHostNameChange} value={hostName} />
						<InputLabel placeholder={"Host url"} label={"URL"} onChange={handleHostUrlChange} value={hostUrl} />
					</div>
					<div css={actionContainerCSS}>
						<Button onClick={handleAddHost} title={"Add"} css={buttonCss} />
					</div>
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

const formContainerCSS = css`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-column-gap: ${49 / PIXEL_REM_RATIO}rem;
	grid-row-gap: ${40 / PIXEL_REM_RATIO}rem;
`;

const settingContentCSS = css`
	width: ${720 / PIXEL_REM_RATIO}rem;
`;

const inputWithLabelCSS = css`
	font-family: Gilroy;
	color: #323232;
`;
const labelCSS = css`
	font-weight: bold;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
`;

const inputCSS = css`
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	border: 1px solid #c4c4c4;
	background: #ffffff;
	padding: ${10 / PIXEL_REM_RATIO}rem ${16 / PIXEL_REM_RATIO}rem;
	margin-top: ${14 / PIXEL_REM_RATIO}rem;
	fontsize: ${13 / PIXEL_REM_RATIO}rem;
	width: 100%;
`;

const buttonCss = css`
	background: #6583fe;
	min-width: ${150 / PIXEL_REM_RATIO}rem;
	text-align: center;
	padding: ${10 / PIXEL_REM_RATIO}rem 0rem;
	font-family: Gilroy;
	font-weight: 600;
	font-size: ${15 / PIXEL_REM_RATIO}rem;
`;
const actionContainerCSS = css`
	display: flex;
	justify-content: flex-end;
	margin-top: ${80 / PIXEL_REM_RATIO}rem;
`;

export default withSession(WithSettingsLayout(AddHostSettings));
