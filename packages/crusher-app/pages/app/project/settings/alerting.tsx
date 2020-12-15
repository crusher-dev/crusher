import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import { ProjectSettingsTemplate } from "@ui/template/projectSettingPage";
import { PROJECT_MENU_ITEMS } from "@constants/other";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import Button from "@ui/atom/Button";
import { cleanHeaders } from "@utils/backendRequest";
import { getAllSlackIntegrationsForProject } from "@services/alerting";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import { resolvePathToBackendURI } from "@utils/url";
import WithSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";

function RenderSlackIntegrations(props) {
	const { slackIntegrations } = props;
	const slackIntegrationsOut = slackIntegrations.map((integration) => {
		const label = integration.label;
		const labelArr = label.split("___");
		const workspace = labelArr[0];
		const channel = labelArr[1];

		return (
			<li>
				<span style={{ marginRight: 4 }}>{workspace}</span> |{" "}
				<span style={{ marginLeft: 4 }}>{channel}</span>
			</li>
		);
	});
	return <ul>{slackIntegrationsOut}</ul>;
}

function SettingContent(props) {
	const { isIntegratedWithEmail, slackIntegrations } = props;
	const [isIntegratedWithSlack, setIsIntegratedWithSlack] = useState(
		props.isIntegratedWithSlack,
	);
	const [isIntegratedWithRepo, setIsIntegratedWithRepo] = useState(
		props.isIntegratedWithRepo,
	);
	const selectedProject = useSelector(getSelectedProject);

	const handleGithubClick = () => {
		const _newWindow = window.open(
			"https://github.com/apps/Crusher-Test/installations/new",
			"Github authorization",
		);
		if (window.focus) {
			_newWindow.focus();
		}
	};

	function toggleIntegrateWithGithubRepo() {
		setIsIntegratedWithRepo(!isIntegratedWithRepo);
	}

	function toggleIntegrateWithSlack() {
		// setIsIntegratedWithSlack(!isIntegratedWithSlack);
	}

	return (
		<ul css={styles.servicesList}>
			<li>
				<div css={styles.serviceInfoContainer}>
					<div css={styles.serviceInfoHeading}>Integrate with repo</div>
					<div css={styles.serviceInfoDesc}>
						This allows you to setup check on PR and branches
					</div>
				</div>
				<div css={styles.serviceInfoButton} onClick={toggleIntegrateWithGithubRepo}>
					{isIntegratedWithRepo && (
						<Button title="Integrated with Github" disabled={true} />
					)}
					{!isIntegratedWithRepo && (
						<Button onClick={handleGithubClick} title="Integrate with Github" />
					)}
				</div>
			</li>
			<li>
				<div css={styles.serviceInfoContainer}>
					<div css={styles.serviceInfoHeading}>Integrate with slack</div>
					<div css={styles.serviceInfoDesc}>This allows you to setup check</div>
				</div>
				<div css={styles.serviceInfoButton} onClick={toggleIntegrateWithSlack}>
					{slackIntegrations && slackIntegrations.length && (
						<>
							<Button title="Integrated with Slack" disabled={true} />
							<RenderSlackIntegrations slackIntegrations={slackIntegrations} />
						</>
					)}
					{!(slackIntegrations && slackIntegrations.length) && (
						<a
							target={"_blank"}
							href={`https://slack.com/oauth/v2/authorize?scope=incoming-webhook&client_id=650512229650.1202465322982?redirect_uri=${escape(
								resolvePathToBackendURI(`alerting/add/slack`),
							)}&state=${selectedProject}`}
						>
							<Button title="Add to slack" />
						</a>
					)}
				</div>
			</li>
			{isIntegratedWithEmail && (
				<li>
					<div css={styles.serviceInfoContainer}>
						<div css={styles.serviceInfoHeading}>Integrate with email</div>
						<div css={styles.serviceInfoDesc}>
							This allows you to setup updates into your inbox
						</div>
					</div>
					<div css={styles.serviceInfoButton}>
						<Button title="Integrated with Email" disabled={true}></Button>
					</div>
				</li>
			)}
		</ul>
	);
}

function ProjectAlertingSettings(props) {
	const {
		isIntegratedWithSlack,
		isIntegratedWithRepo,
		isIntegratedWithEmail,
		slackIntegrations,
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
				heading={"Alerting Settings"}
				selected={PROJECT_MENU_ITEMS.ALERTING}
			>
				<SettingContent
					isIntegratedWithSlack={isIntegratedWithSlack}
					isIntegratedWithRepo={isIntegratedWithRepo}
					isIntegratedWithEmail={isIntegratedWithEmail}
					slackIntegrations={slackIntegrations}
				/>
			</ProjectSettingsTemplate>
		</div>
	);
}

const styles = {
	contentHeading: css`
		font-size: 1.3rem;
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
};

ProjectAlertingSettings.getInitialProps = async (ctx) => {
	const { res, req, store, query } = ctx;
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

		const slackIntegrations = await getAllSlackIntegrationsForProject(
			selectedProject,
			headers,
		);

		return {
			isIntegratedWithSlack: false,
			isIntegratedWithRepo: false,
			isIntegratedWithEmail: true,
			slackIntegrations: slackIntegrations,
		};
	} catch (ex) {
		throw ex;
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSettingsLayout(ProjectAlertingSettings));
