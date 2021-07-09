import React from "react";
import Modal from "react-modal";

interface iAuthModalProps {
	isOpen: boolean;
	onClose: any;
}
const AuthModal = (props: iAuthModalProps) => {
	const { isOpen, onClose } = props;

	return (
		<Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyle} contentLabel="Base Modal">
			<iframe src={"/"} css={{ width: "100%", height: "100%" }} />
		</Modal>
	);
};

const customModalStyle = {
	content: {
		width: "30.33rem",
		height: "40rem",
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
		background: "rgba(22, 21, 21, 0.98)",
	},
};

export { AuthModal };
