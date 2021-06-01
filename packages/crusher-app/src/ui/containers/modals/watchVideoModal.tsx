import React from "react";
import Modal from "react-modal";
import { css } from "@emotion/core";
import CrossIcon from "../../../../public/svg/modals/cross.svg";

interface iWatchModalProps {
	isOpen: boolean;
	onClose: any;
}

const WatchVideoModal = (props: iWatchModalProps) => {
	const { isOpen, onClose } = props;

	const handleVideoFinishedCallback = () => {
		console.log("Video has finished playing");
	};

	return (
		<Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Example Modal">
			<span onClick={onClose} css={crossIconCSS}>
				<CrossIcon />
			</span>
			<div css={backgroundCSS}>
				<h2 css={titleCSS}>Watch a short 2 minute video on how Crusher works</h2>
				<h3
					css={css`
						font-family: Gilroy;
						font-size: 1rem;
						margin-top: 0;
						line-height: 1.125rem;
						font-weight: 300;
						text-align: center;
						color: #0c0c0c;
					`}
				>
					Companies save 50% more time after watching the video
				</h3>
				<video css={videoPlayerCSS} src="/assets/video/onboarding.mp4" onEnded={handleVideoFinishedCallback} controls></video>
				<button css={buttonCSS} onClick={onClose}>
					{"I've watched the video"}
				</button>
			</div>
		</Modal>
	);
};

const crossIconCSS = css`
	position: absolute;
	right: 2.25rem;
	top: 1.5rem;
	cursor: pointer;
`;

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		width: "64rem",
		height: "38rem",
	} as React.CSSProperties,
	overlay: {
		background: "rgb(0, 0, 0, 0.85)",
		zIndex: 9999,
	},
};

const backgroundCSS = css`
	background: white;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 1rem;
	width: 70%;
	margin: 1rem;
	padding-top: 1.5rem;
`;

const videoPlayerCSS = css`
	width: 43.5rem;
	height: 26.25rem;
	border-radius: 0.6rem;
	margin: 0 auto;
	margin-top: 0.9rem;
	margin-bottom: 3rem;
`;

const titleCSS = css`
	font-family: Gilroy;
	font-weight: bold;
	font-size: 1.125rem;
`;

const buttonCSS = css`
	text-align: center;
	height: 2rem;
	width: 12rem;
	background: #ffffff;
	border: 1.5px solid #1c191a;
	box-sizing: border-box;
	border-radius: 6px;
	font-family: Gilroy;
	font-size: 1rem;
	line-height: 1rem;
	font-weight: bold;
`;

export { WatchVideoModal };
