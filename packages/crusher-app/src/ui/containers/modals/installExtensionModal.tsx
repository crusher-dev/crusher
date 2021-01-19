import { Modal } from "@ui/containers/modals/modal";
import React from "react";

import { css } from "@emotion/core";

import { ModalButton } from "@ui/components/modal/button";

interface iProps {
	onClose: any;
}

const InstallExtension = (props: iProps) => {
	const { onClose } = props;

	return (
		<Modal
			heading={"Install extension"}
			subHeading={"to create test"}
			illustration={"/assets/img/illustration/orange_bouncy.png"}
			onClose={onClose}
			topAreaCSS={topAreaCSS}
			illustrationContainerCSS={illustrationContainerCss}
		>
			<div css={bodyContainerCss}>
				<div css={modalHeading}>Install extension on chrohme browser</div>
				<ModalButton
					title={"Download & Install"}
					onClick={() => {}}
					containerCss={buttonCss}
				/>
				<div css={skipDiv}>skip & browse project</div>

				<div css={loading}>
					{/*<ExtensionLoadingSVG/>*/}
					<img src={"/svg/modals/extension_loading.svg"} />
				</div>

				<div css={loadingLabel}>
					Waiting for extension installlation. <br />
					This page will refresh automatically.
				</div>
			</div>
		</Modal>
	);
};

const buttonCss = css`
	padding: 0.9rem;
	margin-bottom: 1rem;
`;

const modalHeading = css`
	margin-top: 5.25rem;
	color: #2e2e2e;
	font-weight: 700;
	font-size: 1.25rem;
	text-align: center;
	margin-bottom: 1rem;
`;
const skipDiv = css`
	text-decoration-line: underline;
	text-align: center;
	font-size: 1rem;
	margin-bottom: 0.75rem;
	color: #2e2e2e;
	cursor: pointer;
`;
const loading = css`
	text-align: center;
	img {
		height: 8.2rem;
	}
`;
const loadingLabel = css`
	font-family: Gilroy;
	font-weight: 500;
	text-align: center;

	color: #2e2e2e;
	font-size: 1rem;
	margin-bottom: 2rem;
`;

const illustrationContainerCss = css`
	top: -0.7rem;
	right: -0.5rem;
`;

const topAreaCSS = css`
	background: linear-gradient(356.01deg, #57e5f9 -20.93%, #8bceff 51.33%);
	background: #edf8ff;
	color: #2b2b39;
	// border-bottom: 2px solid #E8ECFF;
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
	min-height: 26rem;
`;

export { InstallExtension };
