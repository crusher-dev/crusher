import React, { RefObject, useMemo } from "react";
import ReactModal from "react-modal";
import { SeoModalContent } from "./seoModalContent";
import { BrowserIcon, CloseModalIcon } from "../../../../assets/icons";
import { Conditional } from "../../../components/conditional";
import { getModalState } from "../../../../redux/selectors/recorder";
import { useSelector } from "react-redux";
import { getStore } from "../../../../redux/store";
import { updateActionsModalState, updateLastElementCustomScriptOutput } from "../../../../redux/actions/recorder";
import { ACTIONS_MODAL_STATE } from "../../../../interfaces/actionsModalState";
import { FRAME_MESSAGE_TYPES } from "../../../../scripts/inject/responseMessageListener";
import { AssertElementModalContent } from "./assertElementModalContent";
import { ElementCustomScriptModalContent } from "./elementCustomScriptModalContent";
import { HowToUseVideoModal } from "./howToUseVideoModal";
import { POSITION } from "../../../../interfaces/css";

interface iModalTopBarProps {
	title: string;
	desc: string;
	closeModal: () => void;
}

const ModalTopBar = (props: iModalTopBarProps) => {
	const { title, desc, closeModal } = props;

	return (
		<div id="top-bar" style={topBarStyle}>
			<div id="left-section" style={topLeftSectionStyle}>
				<BrowserIcon height={37} width={37} style={topBarBrowserIcon} />
				<div className="heading_container" style={headingContainerStyle}>
					<div className={"heading_title"} style={headingStyle}>
						{title}
					</div>
					<div className={"heading_sub_title"} style={subHeadingStyle}>
						{desc}
					</div>
				</div>
			</div>
			<div id="close-button" onClick={closeModal} style={closeButtonStyle}>
				<CloseModalIcon />
			</div>
		</div>
	);
};

const topBarStyle = {
	display: "flex",
	justifyContent: "space-between",
	marginBottom: "1rem",
	background: "rgb(17,18,19)",
};
const topLeftSectionStyle = {
	display: "flex",
};
const headingContainerStyle = {
	marginLeft: 32,
};
const headingStyle = {
	fontStyle: "normal",
	fontWeight: 800,
	fontSize: "22",
	marginBottom: 8,
	color: "#FFFFFF",
};
const subHeadingStyle = {
	fontStyle: "normal",
	fontSize: "1.06rem",
	color: "#FFFFFF",
};
const topBarBrowserIcon = {
	marginRight: 20,
};
const closeButtonStyle = {
	cursor: "pointer",
};

interface iModalManagerProps {
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}
const ModalManager = (props: iModalManagerProps) => {
	const { deviceIframeRef } = props;
	const modalState = useSelector(getModalState);
	const shouldShowModal = modalState !== null;

	const handleCloseModal = () => {
		const store = getStore();
		store.dispatch(updateActionsModalState(null));
	};

	useMemo(() => {
		if (modalState === ACTIONS_MODAL_STATE.SEO_VALIDATION) {
			if (!deviceIframeRef.current) throw new Error("Iframe not available yet from ref context");

			(window as any).electron.webview.postMessage(
				{
					type: FRAME_MESSAGE_TYPES.REQUEST_SEO_META,
				},
			);
		}
	}, [modalState]);

	const handleCloseElementCustomScriptModal = () => {
		const store = getStore();
		store.dispatch(updateLastElementCustomScriptOutput(null));
		handleCloseModal();
	};

	const isHowToUseVideoModal = modalState === ACTIONS_MODAL_STATE.HOW_TO_USE_VIDEO;

	return (
		<ReactModal
			isOpen={shouldShowModal}
			contentLabel="onRequestClose Example"
			onRequestClose={isHowToUseVideoModal ? undefined : handleCloseModal}
			style={customModalStyles(modalState)}
			overlayClassName="overlay"
		>
			<Conditional If={modalState === ACTIONS_MODAL_STATE.SEO_VALIDATION}>
				<>
					<ModalTopBar title={"SEO Checks"} desc={"These are run when page is loaded"} closeModal={handleCloseModal} />

					<SeoModalContent onClose={handleCloseModal} />
				</>
			</Conditional>
			<Conditional If={modalState === ACTIONS_MODAL_STATE.ASSERT_ELEMENT}>
				<>
					<ModalTopBar title={"Assert element"} desc={"These are used to assert the selected element"} closeModal={handleCloseModal} />

					<AssertElementModalContent deviceIframeRef={deviceIframeRef} onClose={handleCloseModal} />
				</>
			</Conditional>
			<Conditional If={modalState === ACTIONS_MODAL_STATE.ELEMENT_CUSTOM_SCRIPT}>
				<>
					<ModalTopBar
						title={"Element custom script"}
						desc={"Write your own custom script to validate this element"}
						closeModal={handleCloseElementCustomScriptModal}
					/>

					<ElementCustomScriptModalContent deviceIframeRef={deviceIframeRef} onClose={handleCloseElementCustomScriptModal} />
				</>
			</Conditional>
			<Conditional If={modalState === ACTIONS_MODAL_STATE.HOW_TO_USE_VIDEO}>
				<HowToUseVideoModal onClose={handleCloseModal} />
			</Conditional>
		</ReactModal>
	);
};

const customModalStyles = (modalState: ACTIONS_MODAL_STATE | null) => {
	const isHowToUseVideoModal = modalState === ACTIONS_MODAL_STATE.HOW_TO_USE_VIDEO;

	return {
		content: {
			top: isHowToUseVideoModal ? "45%" : "50%",
			left: "50%",
			right: "auto",
			bottom: "auto",
			marginRight: "-50%",
			transform: "translate(-50%, -50%)",
			maxHeight: isHowToUseVideoModal ? "42rem" : "33.75rem",
			margin: 0,
			borderRadius: 8,
			borderWidth: 0,
			width: isHowToUseVideoModal ? 770 : 760,
			overflow: "auto",
			boxShadow: isHowToUseVideoModal ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.1)",
			padding: "36px 40px",
			background: isHowToUseVideoModal ? "rgb(0,0,0,0)" : "rgb(17,18,19)",
			zIndex: 100000,
		},
		overlay: {
			background: isHowToUseVideoModal ? "#1f1f20" : "rgba(0,0,0,0.5)",
			position: POSITION.ABSOLUTE,
			left: 0,
			top: 0,
			height: "100%",
			width: "100%",
			zIndex: 100000,
		},
	};
};

export { ModalManager, ModalTopBar };
