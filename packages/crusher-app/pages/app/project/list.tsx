import { css } from "@emotion/core";
import { useSelector } from "react-redux";
import { getProjects } from "@redux/stateUtils/projects";
import Router from "next/router";

import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import withSession from "@hoc/withSession";
import { getTime } from "@utils/helpers";
import { _deleteProjectFromBackend } from "@services/projects";

import { AddProject } from "@ui/components/app/addProject";
import { Conditional } from "@ui/components/common/Conditional";
import { CreateProjectModal } from "@ui/containers/modals/createProjectModal";
import { CreateTestModal } from "@ui/containers/modals/createTestModal";
import Chrome from "../../../public/svg/project/chrome.svg";

import React, { useState } from "react";
import ReactDOM from "react-dom";

interface iProjectItem {
	project: any;
	showAddTestModal: any;
}
function ProjectItem({ project, showAddTestModal }: iProjectItem) {
	const { name, id, noTests, created_at } = project;
	const addTest = (projectId: number) => {
		if (showAddTestModal) {
			showAddTestModal(projectId);
		}
	};

	const deleteProject = (projectId: number) => {
		_deleteProjectFromBackend(projectId);
	};

	return (
		<div css={projectCardCSS}>
			<Chrome css={iconCSS} />

			<div>
				<div css={projectNameCSS}>{name}</div>
				<div css={projectMetaCSS}>
					<div css={projectTestCSS}>{noTests} tests</div>
					<div css={addProjectTestCSS} onClick={addTest.bind(this, id)}>
						Add test
					</div>
				</div>
			</div>
			<div css={projectRightSectionCSS}>
				<div>Created on {getTime(new Date(created_at))}</div>
				<div css={projectDeleteButtonCSS} onClick={deleteProject.bind(this, id)}>
					Delete
				</div>
			</div>
		</div>
	);
}

function HeaderComponent() {
	const [showAddProject, setShowAddProjectStatus] = useState(false);
	return (
		<div css={headingBlockCSS}>
			<div>
				<div css={headingCSS}>Projects</div>
				<div css={headingTextCSS}>List of projects in your workspace</div>
			</div>
			<div>
				<AddProject
					label={"Add Project"}
					onClick={setShowAddProjectStatus.bind(this, true)}
				/>

				<Conditional If={showAddProject}>
					<CreateProjectModal
						onClose={() => {
							setShowAddProjectStatus(false);
						}}
					/>
				</Conditional>
			</div>
		</div>
	);
}

function ProjectTestsList() {
	const [showAddTestModal, setShowAddTestModal] = useState({
		value: false,
		projectId: null as number | null,
	});
	const projects = useSelector(getProjects);

	const showAddTestModalCallback = (projectId: number) => {
		setShowAddTestModal({ value: true, projectId: projectId });
	};

	const closeAddTestModal = () => {
		ReactDOM.render(null as any, document.getElementById("overlay"));
		setShowAddTestModal({ value: false, projectId: null });
	};

	const createTestCallback = () => {
		closeAddTestModal();
		Router.replace("/app/project/onboarding/create-test");
	};

	return (
		<div css={containerCSS}>
			<Conditional If={showAddTestModal && showAddTestModal.value}>
				<CreateTestModal
					onSubmit={createTestCallback}
					onClose={closeAddTestModal}
				/>
			</Conditional>

			<div css={innerContainerCSS}>
				<HeaderComponent />
				<div css={projectCardsContainerCSS}>
					{projects.map((project: any) => (
						<ProjectItem
							key={project.id}
							project={project}
							showAddTestModal={showAddTestModalCallback}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

const projectCardsContainerCSS = css`
	margin-top: 2.25rem;
`;
const headingCSS = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.5rem;
	line-height: 1.5rem;
	color: #2b2b39;
`;
const headingTextCSS = css`
	margin-top: 0.6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 500;
	font-size: 1.075rem;
	color: #2b2b39;
`;
const headingBlockCSS = css`
	display: flex;
	justify-content: space-between;
	align-items: start;
`;

const containerCSS = css`
	margin: 0 auto;
	display: flex;
	justify-content: center;
`;
const innerContainerCSS = css`
	padding: 3rem 0;
	width: 49rem;
`;

const projectCardCSS = css`
	padding: 1.06rem 1.5rem;
	border: 1px solid #dddddd;
	box-sizing: border-box;
	border-radius: 8px;
	display: flex;
	margin-bottom: 2.5rem;
`;
const iconCSS = css`
	margin-right: 1.75rem;
`;
const projectNameCSS = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.2rem;
	line-height: 1.2rem;
	margin-bottom: 0.75rem;
`;
const projectMetaCSS = css`
	display: flex;
	font-size: 1rem;
	color: #2b2b39;
`;
const projectTestCSS = css`
	margin-right: 1rem;
`;
const addProjectTestCSS = css`
	text-decoration: underline;
	cursor: pointer;
`;
const projectRightSectionCSS = css`
	margin-left: auto;
	flex-direction: column;
	display: flex;
	align-items: flex-end;
`;
const projectDeleteButtonCSS = css`
	color: #e43756;
	font-size: 0.86rem;
	font-weight: 600;
	margin-top: 1rem;
	cursor: pointer;
`;

export default withSession(WithSidebarLayout(ProjectTestsList));
