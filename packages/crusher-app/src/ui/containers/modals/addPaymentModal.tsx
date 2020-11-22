import { Modal } from "@ui/containers/modals/modal";
import { useState } from "react";
import React from "react";
import { ModalInput } from "@ui/components/modal/input";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";
import { addProject } from "@services/projects";
import { addProjectInRedux } from "@redux/actions/action";

import { store } from "@redux/store";
import { StripePaymentBox } from "@ui/components/common/payment.tsx";

interface iProps {
	onClose: any;
}

const AddPaymentModel = (props: iProps) => {
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
			heading={"Add payment method"}
			subHeading={"Add a credit card"}
			illustrationSVG={"/assets/img/illustration/women_running.png"}
			onClose={onClose}
			topAreaCSS={topAreaCSS}
			illustrationContainerCSS={illustrationContainerCss}
		>
			<div css={bodyContainerCss}>
				<div css={modalMoto}>You will be charged on 20Nov.</div>
				<StripePaymentBox />
			</div>
		</Modal>
	);
};

const illustrationContainerCss = css`
	top: 1.2rem;
	right: -0.5rem;
`;

const topAreaCSS = css`
	background: #e8ecff;
	// border-bottom: 2px solid #E8ECFF;
	color: #2b2b39;
	div > img {
	}
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
	margin-top: 10rem;
	background: #23232f;
`;

export { AddPaymentModel };
