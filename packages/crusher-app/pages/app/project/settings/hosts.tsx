import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import { ProjectSettingsTemplate } from "@ui/template/projectSettingPage";
import { PROJECT_MENU_ITEMS } from "@constants/other";
import React, { useCallback, useEffect, useState } from "react";
import List from "@ui/components/list";
import Form from "@ui/components/form/Form";
import WithLabel from "@ui/components/form/withLabel";
import Input from "@ui/components/form/Input";
import Button from "@ui/atom/Button";
import {
	addHostToProject,
	deleteHostFromProject,
	getAllHosts,
} from "@services/projects";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { Player } from "@lottiefiles/react-lottie-player";
import Head from "next/head";
import WithSession from "@hoc/withSession";

const HOST_STEP = {
	VIEW_HOSTS: "VIEW_HOSTS",
	CREATE_HOST: "CREATE_HOST",
};

function RenderCreateHostForm(props) {
	const { hostName, hostUrl, onSaveTest } = props;

	const [name, setName] = useState(hostName);
	const [url, setURL] = useState(hostUrl);

	function onNameChange(event) {
		setName(event.target.value);
	}

	function onURLChange(event) {
		setURL(event.target.value);
	}

	function saveTest() {
		if (!!name && !!url) {
			onSaveTest(name, url);
		} else {
			alert("Complete all the fields");
		}
	}

	return (
		<>
			<div css={styles.createHostContainer}>
				<Form heading={"Create new host"}>
					<WithLabel
						labelTitle={"Name"}
						labelDescription={"This is the name by which you address this host"}
					>
						<Input
							width={"20rem"}
							value={name}
							onChange={onNameChange}
							placeholder={"Enter host name"}
						/>
					</WithLabel>
					<WithLabel
						labelTitle={"URL"}
						labelDescription={"This is the url of this host"}
					>
						<Input
							width={"20rem"}
							value={url}
							onChange={onURLChange}
							placeholder={"Enter host url"}
						/>
					</WithLabel>
					<div css={styles.saveButtonContainer}>
						<Button title={"Save Host"} onClick={saveTest} />
					</div>
				</Form>
			</div>
		</>
	);
}

function SettingContent(props) {
	const [step, setStep] = useState(HOST_STEP.VIEW_HOSTS);
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
			console.log("Got hosts", allHostsInProject);
		});
	}, []);

	function createHost() {
		setStep(HOST_STEP.CREATE_HOST);
	}

	function onSaveTest(hostName, hostURL) {
		addHostToProject(hostName, hostURL, selectedProjectId).then((hostId) => {
			if (hostId) {
				setHosts([...hosts, { id: hostId, name: hostName, value: hostURL }]);
			}
			setStep(HOST_STEP.VIEW_HOSTS);
		});
	}

	function onDeleteHost(id) {
		deleteHostFromProject(id, null).then((res) => {
			const newHosts = hosts.filter((host) => {
				return host.id !== id;
			});

			setHosts(newHosts);
		});
	}

	return (
		<div>
			{step === HOST_STEP.VIEW_HOSTS && (
				<>
					<div css={styles.buttonContainer} onClick={createHost}>
						<div css={styles.button}>Create host</div>
					</div>
					<div style={{ marginTop: "1.5rem" }}>
						{hosts && hosts.length ? (
							<List onDeleteItem={onDeleteHost} items={hosts} />
						) : (
							<div css={styles.activitiesPlaceholderContainer}>
								<Player
									autoplay={true}
									src={"https://assets2.lottiefiles.com/packages/lf20_S6vWEd.json"}
									speed={1}
									background={"transparent"}
									style={{ width: 200, height: 200, margin: "0 auto" }}
									loop={true}
								/>
								<div css={styles.activitiesPlaceholderHeading}>Alas!</div>
								<div css={styles.activitiesPlaceholderMessageContainer}>
									<div>You don’t have any hosts to show.</div>
									<div css={styles.blueItalicText}>Need any help</div>
								</div>
							</div>
						)}
					</div>
				</>
			)}
			{step === HOST_STEP.CREATE_HOST && (
				<RenderCreateHostForm onSaveTest={onSaveTest} />
			)}
		</div>
	);
}

function ProjectHostsSettings(props) {
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
			<Head>
				<script
					src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
					defer
				/>
			</Head>
			<ProjectSettingsTemplate
				heading={"Hosts Settings"}
				selected={PROJECT_MENU_ITEMS.HOSTS}
			>
				<SettingContent />
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
		margin-top: 1rem;
		display: flex;
		justify-content: flex-end;
	`,
	button: css`
		background: #5b76f7;
		border: 1px solid #2f4fe7;
		border-radius: 0.25rem;
		padding: 0.35rem 1.6rem;
		font-weight: 700;
		font-size: 0.8rem;
		color: #fff;
		display: inline-block;
		cursor: pointer;
	`,
	createHostContainer: css``,
	saveButtonContainer: css`
		margin-top: 3rem;
		display: flex;
		justify-content: flex-end;
	`,
	activitiesPlaceholderContainer: css`
		border-radius: 0.25rem;
		padding: 0;
		margin-top: 2.375rem;
		border-radius: 0.2rem;
		padding: 2.5rem 5.45rem;
	`,
	activitiesPlaceholderHeading: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.4rem;
		color: #2b2b39;
		text-align: center;
	`,
	activitiesPlaceholderMessageContainer: css`
		margin-top: 1rem;
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 1.1rem;
		line-height: 2rem;
		color: #2b2b39;
		text-align: center;
	`,
	blueItalicText: css`
		color: #5b76f7;
		font-weight: bold;
		text-decoration: underline;
	`,
};

ProjectHostsSettings.getInitialProps = async (ctx) => {
	const { req } = ctx;

	return {};
};

export default WithSession(WithSidebarLayout(ProjectHostsSettings));
