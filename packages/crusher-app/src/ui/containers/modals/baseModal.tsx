import React from "react";
import Modal from "react-modal";
import { css } from "@emotion/core";
import { Conditional } from "@ui/components/common/Conditional";

interface iBaseModalProps {
	isOpen: boolean;
	heading: string;
	subHeading?: string;
	closeIcon?: any;
	illustration?: string;
	width?: any;
	height?: any;
	css?: {
		container?: any;
		mainContainer?: any;
		backgroundIllustrationContainer?: any;
		topArea?: any;
		content?: any;
		heading?: any;
		desc?: any;
	};
	onClose: () => void;
	children?: any;
}

const BaseModal = (props: iBaseModalProps) => {
	const { heading, subHeading, illustration, closeIcon: CloseIcon, css, onClose, children, isOpen, width, height } = props;

	const customCSS = css || {};

	return (
		<Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyle(width, height)} contentLabel="Base Modal">
			<div css={[containerCSS, customCSS.container]}>
				<div css={[modalContainerCSS, customCSS.mainContainer]}>
					<div css={[topContainerCSS, customCSS.topArea]}>
						<div className={"modalHeading"} css={customCSS.heading}>
							{heading}
						</div>
						<div className={"modalDesc"} css={customCSS.desc}>
							{subHeading}
						</div>
						<Conditional If={CloseIcon}>
							<div css={closeModalCSS} onClick={onClose}>
								<CloseIcon />
							</div>
						</Conditional>
						<Conditional If={illustration}>
							<div css={[illustrationContainerCSS, customCSS.backgroundIllustrationContainer]}>
								<img src={illustration} />
							</div>
						</Conditional>
					</div>
					<div css={[bodyContainerCSS, customCSS.container]}>{children}</div>
				</div>
			</div>
		</Modal>
	);
};

const containerCSS = css`
	z-index: 1001;
`;

const modalContainerCSS = css`
	width: 100%;
	overflow: hidden;
`;

const illustrationContainerCSS = css`
	position: absolute;
	top: -0.8rem;
	right: -0.5rem;
	img {
		width: 15.15rem;
	}
`;

const topContainerCSS = css`
	color: #24292d;
	background: #edf8ff;
	padding: 1.6rem 1.75rem 2.25rem 1.75rem;
	position: relative;
	font-family: Cera Pro;
	.modalHeading {
		font-weight: 900;
		font-size: 1.75rem;
	}
	.modalDesc {
		font-size: 1.25rem;
		margin-top: -0.25rem;
		margin-bottom: 0.5rem;
	}
`;

const bodyContainerCSS = css`
	width: 100%;
	padding: 1.5rem 1.75rem 2rem 1.75rem;
	margin-bottom: 1.5rem;
	font-family: Gilroy;
	color: #2e2e2e;
`;

const closeModalCSS = css`
	position: absolute;
	top: 1.5rem;
	right: 2rem;
	cursor: pointer;
	z-index: 2;
`;

const customModalStyle = (width: any, height: any) => ({
	content: {
		width: width || "33.33rem",
		height: height || "auto",
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		transform: "translate(-50%, -50%)",
		margin: 0,
		borderRadius: 8,
		borderWidth: 0,
		padding: 0,
		overflow: "auto",
		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
		zIndex: 100000,
		background: "#fff",
	},
	container: {
		padding: 0,
	},
	overlay: {
		zIndex: 100000,
		background: "rgba(22, 21, 21, 0.95)",
	},
});

export { BaseModal };
