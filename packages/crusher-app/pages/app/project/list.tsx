import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import WithSession from "@hoc/withSession";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import { getAllTestsInfosInProject } from "@services/test";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { cleanHeaders } from "@utils/backendRequest";
import { useSelector } from "react-redux";
import { AddProject } from "@ui/components/app/addProject";
import Chrome from "../../../public/svg/project/chrome.svg";
import Router from "next/router";
import { getTime } from "@utils/helpers";
import { deleteProjectFromBackend } from "@services/projects";
import React, { useState } from "react";
import { CreateProjectModal } from "@ui/containers/modals/createProjectModal";
import { CreateTestModal } from "@ui/containers/modals/createTestModal";
import ReactDOM from 'react-dom';

function ProjectItem({ name, id, team_id, noTests, created_at, showAddTestModal }) {
	const addTest = (projectId: number) => {
		if(showAddTestModal){
			showAddTestModal(projectId);
		}
	};

	const deleteProject = (projectId: number) => {
		deleteProjectFromBackend(projectId);
	};

	return (
		<div css={projectCard}>
			<Chrome css={icon} />

			<div css={projectContent}>
				<div css={projectName}>{name}</div>
				<div css={projectMeta}>
					<div css={projectTest}>{noTests} tests</div>
					<div css={addProjectTest} onClick={addTest}>
						Add test
					</div>
				</div>
			</div>
			<div css={projectRightSection}>
				<div css={projectCreatedOn}>Created on {getTime(new Date(created_at))}</div>
				<div css={projectDeleteButton} onClick={deleteProject}>
					Delete
				</div>
			</div>
		</div>
	);
}

function HeaderComponent() {
	const [showAddProject, setshowAddProjectStatus] = useState(false);
	return (
		<div css={headingBlock}>
			<div>
				<div css={heading}>Projects</div>
				<div css={headingText}>List of projects in your workspace</div>
			</div>
			<div>
				<AddProject
					label={"Add Project"}
					onClick={setshowAddProjectStatus.bind(this, true)}
				/>
				{showAddProject && (
					<CreateProjectModal
						onClose={() => {
							setshowAddProjectStatus(false);
						}}
					/>
				)}
			</div>
		</div>
	);
}

function ProjectTestsList(props) {
	const [showAddTestModal, setShowAddTestModal] = useState({ value: false, projectId: null });
	const projects = useSelector(getProjects);

	const showAddTestModalCallback = (projectId: string) => {
		setShowAddTestModal({value: true, projectId: projectId});
	};

	const closeAddTestModal = () => {
		ReactDOM.render(null, document.getElementById("overlay"));
		setShowAddTestModal({value: false, projectId: null});
	};

	const createTestCallback = (url, browsers) => {
		closeAddTestModal();
		Router.replace("/app/project/onboarding/create-test");
	}

	return (
		<div css={container}>
			{showAddTestModal && showAddTestModal.value && (
				<CreateTestModal onSubmit={createTestCallback} onClose={closeAddTestModal}/>
			)}
			<div css={innerContainer}>
				<HeaderComponent />
				<div css={projectCardsContainer}>
					{projects.map((project) => (
						<ProjectItem {...project} showAddTestModal={showAddTestModalCallback} />
					))}
				</div>
			</div>
		</div>
	);
}

const projectCardsContainer = css`
	margin-top: 2.25rem;
`;
const heading = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.5rem;
	line-height: 1.5rem;
	color: #2b2b39;
`;
const headingText = css`
	margin-top: 0.6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 500;
	font-size: 1.075rem;
	color: #2b2b39;
`;
const headingBlock = css`
	display: flex;
	justify-content: space-between;
	align-items: start;
`;

const container = css`
	margin: 0 auto;
	display: flex;
	justify-content: center;
`;
const innerContainer = css`
	padding: 3rem 0;
	width: 49rem;
`;

const projectCard = css`
	padding: 1.06rem 1.5rem;
	border: 1px solid #dddddd;
	box-sizing: border-box;
	border-radius: 8px;
	display: flex;
	margin-bottom: 2.5rem;
`;
const icon = css`
	margin-right: 1.75rem;
`;
const projectContent = css``;
const projectName = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.2rem;
	line-height: 1.2rem;
	margin-bottom: 0.75rem;
`;
const projectMeta = css`
	display: flex;
	font-size: 1rem;
	color: #2b2b39;
`;

const projectTest = css`
	margin-right: 1rem;
`;

const addProjectTest = css`
	text-decoration: underline;
	cursor: pointer;
`;
const projectRightSection = css`
	margin-left: auto;
	flex-direction: column;
	display: flex;
	align-items: flex-end;
`;
const projectDeleteButton = css`
	color: #e43756;
	font-size: 0.86rem;
	font-weight: 600;
	margin-top: 1rem;
	cursor: pointer;
`;
const projectCreatedOn = css``;

ProjectTestsList.getInitialProps = async (ctx) => {
	const { res, req, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const defaultProject = getSelectedProject(store.getState());

		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);
		const tests = await getAllTestsInfosInProject(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);
		return {
			tests: [],
		};
	} catch (er) {
		throw er;
		await redirectToFrontendPath("/404", res);
		return {};
	}
};

export default WithSession(WithSidebarLayout(ProjectTestsList));
