import { css } from "@emotion/core";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import { ProjectSettingsTemplate } from "@ui/template/projectSettingPage";
import { PROJECT_MENU_ITEMS } from "@constants/other";
import React, { useEffect, useRef, useState } from "react";
import Form from "@ui/components/form/Form";
import WithLabel from "@ui/components/form/withLabel";
import { DropDown } from "@ui/components/project/DropDown";
import Label from "@ui/components/form/Label";
import QuestionInput from "@ui/components/form/QuestionInput";
import TextArea from "@ui/components/form/TextArea";
import { getCLICode } from "@utils/helpers";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { useSelector } from "react-redux";
import { Platform } from "@interfaces/Platform";
import {
	getAllHosts,
	getMonitoringSettings,
	saveMonitoringSettingsInDB,
} from "@services/projects";
import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { MonitoringSettings } from "@interfaces/MonitoringSettings";
import withSession from "@hoc/withSession";
import { iPageContext } from "@interfaces/pageContenxt";

const runIntervalOptions = [
	{ value: "0.5h", label: "Every 30 minutes" },
	{ value: "1h", label: "Every 1 hours" },
	{ value: "2h", label: "Every 2 hours" },
	{ value: "4h", label: "Every 4 hours" },
	{ value: "8h", label: "Every 8 hours" },
	{ value: "12h", label: "Every 12 hours" },
	{ value: "1d", label: "Every day" },
];

const browserOptions = [
	{ value: Platform.CHROME, label: "Chrome" },
	{ value: Platform.FIREFOX, label: "Firefox" },
	{ value: Platform.SAFARI, label: "Safari" },
	{ value: Platform.ALL, label: "All of them" },
];

function WaitingModal(props) {
	const { shouldShow } = props;
	if (!shouldShow) return null;
	return (
		<>
			<div css={styles.overlay}>
				<div css={styles.logsOverlayContent}>
					<div>
						<img src={"/svg/loadingElipsis.svg"} style={{ height: "4.125rem" }} />
					</div>
					<div css={styles.waitingTitle}>Updating settings</div>
					<div css={styles.waitingDesc}>It’ll take just few seconds</div>
				</div>
			</div>
		</>
	);
}

function SettingContent(props) {
	const { continuousDevelopmentOptions, testingProviderOptions } = props;
	const monitoringSettings: MonitoringSettings = props.monitoringSettings;
	const [selectedDeploymentOption, setSelectedDeploymentOption] = useState(null);
	const [selectedInterval, setSelectedInterval] = useState(
		monitoringSettings.test_interval
			? { value: monitoringSettings.test_interval }
			: { value: "12h" },
	);
	const [selectedBrowser, setSelectedBrowser] = useState(
		monitoringSettings.platform
			? { value: monitoringSettings.platform }
			: { value: Platform.CHROME },
	);
	const [selectedHost, setSelectedHost] = useState(
		monitoringSettings.target_host
			? { value: monitoringSettings.target_host }
			: null,
	);
	const [testProvider, setTestProvider] = useState(null);
	const [generatedCode, setGeneratedCode] = useState("");
	const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
	const selectedProjectId = useSelector(getSelectedProject);

	const [hosts, setHosts] = useState([]);

	useEffect(() => {
		getAllHosts(selectedProjectId, null).then((allHostsInProject) => {
			setHosts(
				allHostsInProject
					? allHostsInProject.map((host) => {
							return { id: host.id, name: host.host_name, value: host.url };
					  })
					: [],
			);
		});
	}, []);

	const mounted = useRef(false);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}
		if (selectedHost && selectedBrowser && selectedInterval) {
			saveMonitoringSettings({
				target_host: selectedHost.value,
				platform: selectedBrowser.value,
				test_interval: selectedInterval.value,
			});
		}
	}, [selectedHost, selectedBrowser, selectedInterval]);

	function onChangeTestInterval(newTestInterval) {
		setSelectedInterval(newTestInterval);
	}

	function onChangeSelectedHost(newHost) {
		setSelectedHost(newHost);
	}

	function onChangeBrowser(newBrowser) {
		setSelectedBrowser(newBrowser);
	}

	function onChangeDeploymentOption(optionName) {
		setSelectedDeploymentOption(optionName);
	}

	function onChangeTestingProvider(optionName) {
		setTestProvider(optionName);
		getCLICode(selectedProjectId, null).then((token) => {
			if (token) {
				setGeneratedCode(token);
			}
		});
	}

	const hostOptions = hosts.map((host) => {
		return { label: host.name, value: host.id };
	});

	function saveMonitoringSettings(settings) {
		setIsUpdatingSettings(true);

		saveMonitoringSettingsInDB(settings, selectedProjectId).then((res) => {
			setIsUpdatingSettings(false);
		});
	}

	return (
		<div css={styles.monitoringContainer}>
			<Form>
				<WithLabel
					labelTitle={"Run these tests"}
					labelDescription={"This allows you to setup check on PR and branches"}
					labelStyle={{ paddingTop: "1.8rem" }}
				>
					<div css={styles.selectInput}>
						<DropDown
							isSearchable={false}
							heightFactor={0.9}
							selected={selectedInterval}
							onChange={onChangeTestInterval}
							placeholder={"Select run interval"}
							options={runIntervalOptions}
						/>
					</div>
					<div css={styles.selectInput}>
						<DropDown
							isSearchable={false}
							heightFactor={0.9}
							selected={selectedBrowser}
							onChange={onChangeBrowser}
							placeholder={"Select browsers"}
							options={browserOptions}
						/>
					</div>
					<div css={styles.selectInput}>
						<DropDown
							heightFactor={0.9}
							selected={selectedHost}
							onChange={onChangeSelectedHost}
							placeholder={"Select host"}
							options={hostOptions}
						/>
					</div>
				</WithLabel>
				<Label style={{ fontSize: "1.2rem" }} title={"Integrate in CI pipeline"} />
				<div css={styles.questionsContainer}>
					<QuestionInput
						onOptionChange={onChangeTestingProvider}
						selected={testProvider}
						question={"Select you testing provider"}
						options={testingProviderOptions}
					/>
				</div>
				{testProvider && (
					<WithLabel
						style={{ marginTop: "4.25rem" }}
						labelTitle={"Copy this code"}
						labelDescription={"Paste after deploy"}
					>
						<TextArea
							width={"27rem"}
							height={"9rem"}
							placeholder="Copy your code"
							value={generatedCode}
						/>
					</WithLabel>
				)}
			</Form>
			<WaitingModal shouldShow={isUpdatingSettings} />
		</div>
	);
}

function ProjectMonitoringSettings(props) {
	const {
		continuousDevelopmentOptions,
		testingProviderOptions,
		monitoringSettings,
	} = props;

	return (
		<div
			style={{
				display: "flex",
				paddingTop: "4.25rem",
				paddingLeft: "4.25rem",
				paddingRight: "4.25rem",
				flexDirection: "column",
			}}
		>
			<ProjectSettingsTemplate
				heading={"Monitoring Settings"}
				selected={PROJECT_MENU_ITEMS.MONITORING}
			>
				<SettingContent
					monitoringSettings={monitoringSettings}
					continuousDevelopmentOptions={continuousDevelopmentOptions}
					testingProviderOptions={testingProviderOptions}
				/>
			</ProjectSettingsTemplate>
		</div>
	);
}

const styles = {
	contentHeading: css`
		font-size: 1.1rem;
		font-weight: 500;
	`,
	servicesList: css`
		list-style: none;
		padding: 0;
		li {
			display: flex;
			align-items: center;
			&:not(:last-child) {
				margin-bottom: 4rem;
			}
		}
	`,
	serviceInfoContainer: css`
		flex: 1;
	`,
	serviceInfoHeading: css`
		font-weight: 700;
		font-size: 1.1rem;
	`,
	serviceInfoDesc: css`
		margin-top: 0.9rem;
		font-size: 1rem;
	`,
	serviceInfoButton: css`
		margin-left: auto;
		cursor: pointer;
	`,
	infoText: css`
		text-align: center;
		margin-top: 4.5rem;
		font-size: 1.125rem;
		font-weight: 500;
	`,
	buttonContainer: css`
		margin-top: 2rem;
	`,
	button: css`
		background: #5b76f7;
		border: 1px solid #2f4fe7;
		border-radius: 0.25rem;
		padding: 0.55rem 1.75rem;
		font-weight: 700;
		font-size: 0.75rem;
		color: #fff;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		display: inline-block;
		cursor: pointer;
	`,
	monitoringContainer: css`
		padding-bottom: 2rem;
	`,
	selectInput: css`
		&:not(:last-child) {
			margin-bottom: 1.5rem;
		}
	`,
	questionsContainer: css`f
        margin-top: 2rem;
    `,
	overlay: css`
		position: fixed;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.5);
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	`,
	logsOverlayContent: css`
		background: #fff;
		padding: 3.575rem 10.125rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 0.8rem;
	`,
	waitingTitle: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.35rem;
	`,
	waitingDesc: css`
		margin-top: 0.6rem;
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 0.9rem;
	`,
};

ProjectMonitoringSettings.getInitialProps = async (ctx: iPageContext) => {
	const { req, store } = ctx;
	let headers;
	if (req) {
		headers = req.headers;
		cleanHeaders(headers);
	}

	const cookies = getCookies(req!);

	const defaultProject = getSelectedProject(store.getState());
	const selectedProject = JSON.parse(
		cookies.selectedProject ? cookies.selectedProject : null,
	);

	const monitoringSettings = await getMonitoringSettings(
		selectedProject ? selectedProject : defaultProject,
		headers,
	);

	const continuousDevelopmentOptions = [
		{
			name: "yes",
			value: "Yes",
		},
		{
			name: "no",
			value: "No",
		},
	];

	const testingProviderOptions = [
		{
			name: "github_actions",
			value: "Github Actions",
		},
		{
			name: "travis_ci",
			value: "Travis CI",
		},
		{
			name: "circle_ci",
			value: "Circle CI",
		},
		{
			name: "run_locally",
			value: "Dev (Local)",
		},
	];

	return {
		continuousDevelopmentOptions,
		testingProviderOptions,
		monitoringSettings,
	};
};

export default withSession(withSidebarLayout(ProjectMonitoringSettings));
