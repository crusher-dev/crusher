import { Modal } from "@ui/containers/modals/modal";
import { useState } from "react";
import React from "react";
import { ModalInput } from "@ui/components/modal/input";
import { css } from "@emotion/core";
import { ModalButton } from "@ui/components/modal/button";

interface iProps {
	onClose: any;
}

const CreateTestModal = (props: iProps) => {
	const { onClose } = props;
	const [url, setURL] = useState("");

	const handleSubmit = () => {
		return true;
	};

	const handleURLChange = (event: any) => {
		setURL(event.target.value);
	};


	return (
		<Modal
			heading={"Create a test"}
			subHeading={"Experience power of no-code testing"}
			illustration={"/assets/img/illustration/women_running.png"}
			onClose={onClose}
			headingCss={modalHeadingCss}
			descCss={modalDescCss}
			topAreaCSS={topAreaCSS}
		>
			<div css={bodyContainerCss}>
				<ModalInput
					id={"url"}
					title={"Enter url"}
					placeholder={"Enter host url"}
					value={url}
					onChange={handleURLChange}
				/>
				{/*<ModalInput*/}
				{/*	id={"url"}*/}
				{/*	title={"Enter url"}*/}
				{/*	placeholder={"Enter host url"}*/}
				{/*	value={url}*/}
				{/*	onChange={handleURLChange}*/}
				{/*/>*/}

				<ModalButton
					containerCss={buttonCss}
					title={"Start Recording"}
					onClick={handleSubmit}
				/>
			</div>
		</Modal>
	);
};

const topAreaCSS = css`
	background: #EDF8FF;
	border-bottom: 2px solid #0a1215;
`;

const modalHeadingCss = css`
		color: #261F18;
`;

const modalDescCss = css`
		color: #2E2E2E;
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

export { CreateTestModal };
