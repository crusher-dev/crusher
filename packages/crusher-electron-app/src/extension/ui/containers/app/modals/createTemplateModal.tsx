import React, { useState } from "react";
import ReactModal from "react-modal";
import { FONT_WEIGHT, POSITION } from "../../../../interfaces/css";
import { COLOR_CONSTANTS } from "../../../colorConstants";
import { pxToRemValue } from "../../../../utils/helpers";
import { ModalTopBar } from "./index";
import { AdvancedURL } from "../../../../utils/url";

interface iStartupModalProps {
	isOpen: boolean;
	onClose: (templateName: string) => void;
}

const CreateTemplatesModal = (props: iStartupModalProps) => {
	const { isOpen, onClose } = props;
	const [templateName, setTemplateName] = useState();

	const handleTemplateNameChange = (event: any) => {
		setTemplateName(event.target.value);
	};

	const createTemplate = () => {
		if (templateName && templateName !== "") {
			if (!(window as any).electron) {
				onClose(templateName);
				throw new Error("Cannot find exposed electron API");
			}
			onClose(templateName);
		}
	};

	const handleKeyPress = (e: any) => {
		if (e.key === "Enter") {
			createTemplate();
		}
	};

	const handleClose = (e: any) => {
		onClose(null);
	};

	return (
		<ReactModal isOpen={isOpen} onRequestClose={handleClose} contentLabel="Startup Modal" style={customModalStyles} overlayClassName="overlay">
			<ModalTopBar title={"Create template"} desc={"For re-using across tests"} closeModal={onClose} />
			<div style={formContainerStyle}>
				<div style={inputContainerStyle}>
					<div>Set name for template</div>
					<input style={inputStyle} autoFocus={true} value={templateName} onKeyPress={handleKeyPress} onChange={handleTemplateNameChange} />
				</div>
				<div style={submitFormContainerStyle}>
					<button style={buttonStyle} onClick={createTemplate}>
						{"Create Template"}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

const formContainerStyle = {
	marginTop: pxToRemValue(54),
};
const submitFormContainerStyle = {
	width: "100%",
	display: "flex",
	marginTop: pxToRemValue(36),
};
const buttonStyle = {
	backgroundColor: COLOR_CONSTANTS.BUTTON_BLUE,
	padding: 9,
	minWidth: 170,
	borderRadius: 4,
	color: "#fff",
	fontWeight: FONT_WEIGHT.BOLD,
	fontSize: pxToRemValue(15),
	marginLeft: "auto",
	border: 0,
	cursor: "pointer",
};
const inputStyle = {
	background: "#1A1A1C",
	borderRadius: 6,
	border: "1px solid #43434F",
	padding: "11px 20px",
	fontFamily: "DM Sans",
	fontSize: 15,
	minWidth: 358,
	color: "#fff",
	outline: "none",
	marginLeft: "auto",
};
const inputContainerStyle = {
	display: "flex",
	fontFamily: "DM Sans",
	alignItems: "center",
	color: "#fff",
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
		padding: "36px 40px",
		background: "rgb(17,18,19)",
		zIndex: 100000,
	},
	overlay: {
		background: "rgba(0,0,0,0.5)",
		position: POSITION.ABSOLUTE,
		left: 0,
		top: 0,
		height: "100%",
		width: "100%",
		zIndex: 100000,
	},
};
export { CreateTemplatesModal };
