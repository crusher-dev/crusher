import React from "react";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import MonitoringCard from "@ui/containers/settings/monitoringCard";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import Router from "next/router";
import { ProjectHostsList } from "@ui/containers/settings/projectHostsList";
import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { _getProjectHosts } from "@services/projects";
import { redirectToFrontendPath } from "@utils/router";
import { iHostListResponse } from "@crusher-shared/types/response/hostListResponse";
import { setMonitoringList, setProjectHosts } from "@redux/actions/monitoring";
import { _getMonitoringList } from "@services/monitoring";
import { useSelector } from "react-redux";
import { getProjectMonitoringList } from "@redux/stateUtils/monitoring";

const MonitoringSettings = () => {
	const monitoringRecords = useSelector(getProjectMonitoringList);

	const handleAddHostClick = () => {
		Router.replace("/app/settings/project/add-host");
	};
	const handleAddMonitoringClick = () => {
		Router.replace("/app/settings/project/add-monitoring");
	};

	const monitoringOut = monitoringRecords.map((record) => {
		return (
			<div css={monitoringCardItemCSS} key={record.id}>
				<MonitoringCard
					id={record.id}
					title={"Prod Monitoring"}
					host={record.target_host_name}
					tags={[]}
					countries={[]}
					duration={record.test_interval}
					escalation={null}
				/>
			</div>
		);
	});

	return (
		<div css={monitoringCSS}>
			<SettingsContent contentCSS={settingContentCSS}>
				<div css={sectionCSS}>
					<SettingsContentHeader
						title={"Hosts"}
						desc={"List of all the hosts you want to run monitoring/testing on"}
						button={<AddHost onClick={handleAddHostClick} />}
					/>

					<div css={projectHostListContainerCSS}>
						<ProjectHostsList />
					</div>
				</div>
				<div css={sectionCSS}>
					<SettingsContentHeader
						title={"Monitoring"}
						desc={"List of all team members in current project"}
						button={<AddMonitoringButton onClick={handleAddMonitoringClick} />}
					/>
					<div css={containerCSS}>{monitoringOut}</div>
				</div>
			</SettingsContent>
		</div>
	);
};

interface iButtonProps {
	onClick: () => void;
}

const AddHost = (props: iButtonProps) => {
	const { onClick } = props;
	return (
		<div css={buttonCSS} onClick={onClick}>
			Add a host
		</div>
	);
};

const AddMonitoringButton = (props: iButtonProps) => {
	const { onClick } = props;
	return (
		<div css={buttonCSS} onClick={onClick}>
			Add Monitoring
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

const sectionCSS = css`
	&:not(:first-child) {
		margin-top: ${82 / PIXEL_REM_RATIO}rem;
	}
`;
const projectHostListContainerCSS = css`
	margin-top: ${36 / PIXEL_REM_RATIO}rem;
`;
const monitoringCardItemCSS = css`
	&:not(:first-child) {
		margin-top: 0.7rem;
	}
`;

MonitoringSettings.getInitialProps = async (ctx: any) => {
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

		await _getMonitoringList(selectedProject, headers).then((monitoringList) => {
			store.dispatch(setMonitoringList(monitoringList));
		});

		return {};
	} catch (ex) {
		console.error(ex);
		redirectToFrontendPath("/404", res);
		return null;
	}
};
export default withSession(WithSettingsLayout(MonitoringSettings));
