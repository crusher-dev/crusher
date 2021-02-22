import React, { useState } from "react";
import ReactModal from "react-modal";

interface iStartupModalProps {
	isOpen: boolean;
}

const StartupModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const [targetURL, setTargetURL] = useState("");

	const handleTargetSiteChange = (event: any) => {
		setTargetURL(event.target.value);
	};

	const startRecording = () => {
		if (targetURL && targetURL !== "") {
			window.location.href = `/test_recorder.html?url=${targetURL}&device=GoogleChromeLargeScreen`;
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			contentLabel="Startup Modal"
			style={customModalStyles}
			overlayClassName="overlay"
		>
			<h2>PLEASE ENTER SOME URL</h2>
			<div>
				<input value={targetURL} onChange={handleTargetSiteChange} />
			</div>
			<button onClick={startRecording}>Submit</button>
		</ReactModal>
	);
};

const customModalStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxHeight: "33.75rem",
		margin: 0,
		borderRadius: 8,
		borderWidth: 0,
		width: 760,
		overflow: "auto",
		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
		padding: "36px 40px",
		background: "#1C1F26",
		zIndex: 100000,
	},
	overlay: {
		background: "rgba(0,0,0,0.5)",
		zIndex: 100000,
	},
};
export { StartupModal };
