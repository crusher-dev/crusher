import { Modal } from "@ui/containers/modals/modal";
import { useState } from "react";
import React from "react";
import { ModalInput } from "@ui/components/modal/input";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";
import { addProject } from "@services/projects";

import { addProjectInRedux } from "@redux/actions/project";

import { store } from "@redux/store";

interface iProps {
	onClose: any;
}

const CreateProjectModal = (props: iProps) => {
	const { onClose } = props;
	const [projectName, setProjectName] = useState("");

	const handleSubmit = () => {
		if (projectName && projectName.replace(/\s/g, "").length) {
			createNewProject(projectName);
		} else {
			alert("Invalid project name");
		}
	};

	const handleChange = (event: any) => {
		setProjectName(event.target.value);
	};

	const createNewProject = (projectName: string) => {
		addProject(projectName).then(async (projectId) => {
			await store.dispatch(addProjectInRedux(projectName, projectId));
			onClose();
			window && window.location.reload();
		});
	};

	return (
		<Modal
			heading={"Create a project"}
			illustration={"/assets/img/illustration/create_project_illustration.png"}
			subHeading={"in your team"}
			onClose={onClose}
			topAreaCSS={topAreaCSS}
		>
			<div css={bodyContainerCss}>
				<div css={modalMoto}>Organize your test in different projects</div>
				<ModalInput
					id={"project_name"}
					title={"Project Name"}
					placeholder={"Enter project name"}
					value={projectName}
					onChange={handleChange}
				/>
				<div css={membersInputCss}>
					<div>
						<label>Members of this project</label>
					</div>
					<div css={membersDescCss}>
						Everyone gets project update. Change this in project settings.
					</div>
				</div>

				<ModalButton
					containerCss={buttonCss}
					title={"Create a new Project"}
					onClick={handleSubmit}
				/>
			</div>
		</Modal>
	);
};

const topAreaCSS = css`
	background: linear-gradient(
		-184deg,
		#262f39 16.9%,
		#242d37 35.74%,
		#112128 79.28%
	);
	border-bottom: 2px solid #0a1215;
`;

const modalMoto = css`
	font-size: 1rem;
	margin-bottom: 1.25rem;
`;

const bodyContainerCss = css`
	display: flex;
	flex-direction: column;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
	}
	min-height: 21rem;
`;

const membersInputCss = css`
	margin-top: 2rem;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
		line-height: 1.1rem;
	}
`;

const membersDescCss = css`
	font-size: 0.95rem;
	margin-top: 0.675rem;
`;

const buttonCss = css`
	margin-top: auto;
	margin-top: 11rem;
`;

export { CreateProjectModal };
