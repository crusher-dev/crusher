import { Modal } from "@ui/containers/modals/modal";
import { useState } from "react";
import React from "react";
import { ModalInput } from "@ui/components/modal/input";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";

interface iProps {
	onSubmit: any;
	onClose: any;
}
const CreateProjectModal = (props: iProps) => {
	const { onSubmit, onClose } = props;
	const [projectName, setProjectName] = useState("");

	const handleSubmit = () => {
		if (projectName && projectName.replace(/\s/g, "").length) {
			if (onSubmit) {
				onSubmit(projectName);
			}
		} else {
			alert("Invalid project name");
		}
	};

	const handleChange = (event: any) => {
		setProjectName(event.target.value);
	};

	return (
		<Modal
			heading={"Create a project"}
			subHeading={"in your team"}
			illustrationSVG={"/assets/img/illustration/create_project_illustration.png"}
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
						All members get notification. You can modify this from project settings.
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
`;

const modalMoto = css`
	font-size: 1rem;
	margin-bottom: 2rem;
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
	margin-top: 8.3rem;
`;

export { CreateProjectModal };
