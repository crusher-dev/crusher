import React, { ChangeEvent, useState } from "react";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import ReactSelect from "react-select";
import Button from "@ui/atom/Button";
import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { _getProjectHosts } from "@services/projects";
import { iHostListResponse } from "@crusher-shared/types/response/hostListResponse";
import { setProjectHosts } from "@redux/actions/monitoring";
import { redirectToFrontendPath } from "@utils/router";
import { useSelector } from "react-redux";
import { getProjectHosts } from "@redux/stateUtils/monitoring";
import { _addMonitoring } from "@services/monitoring";
import { getSelectedProject } from "@redux/stateUtils/projects";
import Router from "next/router";
import { RUN_INTERVAL_OPTIONS } from "@constants/testInterval";

interface iSelectInputLabel {
	label: string;
	value: any;
	options: any[];
	placeholder?: string;
	onChange?: any;
}

const SelectInputLabel = (props: iSelectInputLabel) => {
	const { label, value, options, onChange, placeholder } = props;

	return (
		<div css={inputWithLabelCSS}>
			<div css={labelCSS}>{label}</div>
			<ReactSelect
				css={selectInputCSS}
				styles={{
					valueContainer: () => ({
						padding: `${6.5 / PIXEL_REM_RATIO}rem ${16 / PIXEL_REM_RATIO}rem`,
						fontFamily: "Gilroy",
						fontWeight: 500,
						fontSize: `${13 / PIXEL_REM_RATIO}rem`,
					}),
				}}
				placeholder={placeholder}
				options={options}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

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

const AddMonitoringSettings = () => {
	const selectedProject = useSelector(getSelectedProject);
	const hosts = useSelector(getProjectHosts);
	const hostOptions = hosts.map((host) => ({
		label: host.host_name,
		value: host.id,
	}));

	const [selectedHost, setSelectedHost] = useState(hostOptions ? hostOptions[0] : null);
	const [selectedDuration, setSelectedDuration] = useState(RUN_INTERVAL_OPTIONS[0]);
	const [tags, setTags] = useState("");

	const handleAddMonitoring = () => {
		if (!(selectedHost && selectedDuration)) {
			alert("Please fill all the required fields");
			return;
		}
		_addMonitoring({ host: selectedHost.value, interval: selectedDuration.value, tags: tags }, selectedProject).then(() => {
			Router.replace("/app/settings/project/monitoring");
		});
	};

	const handleHostOptionChange = (selectedOption: any) => {
		setSelectedHost(selectedOption);
	};
	const handleDurationChange = (selectedOption: any) => {
		setSelectedDuration(selectedOption);
	};

	const handleTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTags(event.target.value);
	};

	return (
		<div css={monitoringCSS}>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader title={"Add Monitoring"} desc={"List of all team members in current project"} />
				<div css={containerCSS}>
					<div css={formContainerCSS}>
						<SelectInputLabel
							placeholder={"Select host"}
							value={selectedHost}
							label={"Host"}
							options={hostOptions}
							onChange={handleHostOptionChange}
						/>
						<SelectInputLabel
							placeholder={"Select duration"}
							value={selectedDuration}
							onChange={handleDurationChange}
							label={"Duration"}
							options={RUN_INTERVAL_OPTIONS}
						/>
						<InputLabel placeholder={"Enter tags separated by comma"} label={"TestId/Tags"} value={tags} onChange={handleTagsChange} />
					</div>
					<div css={actionContainerCSS}>
						<Button onClick={handleAddMonitoring} title={"Add"} css={buttonCss} />
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
const selectInputCSS = css`
	margin-top: ${14 / PIXEL_REM_RATIO}rem;
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

AddMonitoringSettings.getInitialProps = async (ctx: any) => {
	const { req, res, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const selectedProject = cookies.selectedProject ? JSON.parse(cookies.selectedProject) : null;

		await _getProjectHosts(selectedProject, headers).then((hosts: iHostListResponse[]) => {
			store.dispatch(setProjectHosts(hosts));
		});

		return {};
	} catch (ex) {
		console.error(ex);
		redirectToFrontendPath("/404", res);
		return null;
	}
};
export default withSession(WithSettingsLayout(AddMonitoringSettings));
