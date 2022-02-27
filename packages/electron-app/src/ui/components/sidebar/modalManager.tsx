import React from "react";
import { TElementActionsEnum } from "./actionsPanel/elementActions";
import { AssertElementModal } from "./actionsPanel/elementActions/assertElementModal";
import { TTopLevelActionsEnum } from "./actionsPanel/pageActions";
import { CustomCodeModal } from "./actionsPanel/pageActions/customCodeModal";
import { RunAfterTestModal } from "./actionsPanel/pageActions/runAfterTestModal";
import { SeoModalContent } from "./actionsPanel/pageActions/seoModal";
import { WaitModal } from "./actionsPanel/pageActions/waitModal";
import mitt from "mitt";

const modalEmitter = mitt();

const emitShowModal = (event: { type: any; stepIndex?: any }) => {
	modalEmitter.emit("show-modal", event);
};

const ModalManager = () => {
	const [currentModal, setCurrentModal] = React.useState({ type: null, stepIndex: null });

	React.useEffect(() => {
		modalEmitter.on("show-modal", ({ type, stepIndex }: { type: TElementActionsEnum | TTopLevelActionsEnum; stepIndex?: number }) => {
			setCurrentModal({ type, stepIndex });
		});
		return () => {
			modalEmitter.off("show-modal");
		};
	}, []);

	const closeModal = () => {
		setCurrentModal({ type: null, stepIndex: null });
	};

	return (
		<>
			<AssertElementModal isOpen={currentModal.type === TElementActionsEnum.SHOW_ASSERT_MODAL} handleClose={closeModal} />
			<WaitModal stepIndex={currentModal.stepIndex} isOpen={currentModal.type === TTopLevelActionsEnum.WAIT} handleClose={closeModal} />
			<RunAfterTestModal isOpen={currentModal.type === TTopLevelActionsEnum.RUN_AFTER_TEST} handleClose={closeModal} />
			<CustomCodeModal isOpen={currentModal.type === TTopLevelActionsEnum.CUSTOM_CODE} handleClose={closeModal} />
			<SeoModalContent isOpen={currentModal.type === TTopLevelActionsEnum.SHOW_SEO_MODAL} handleClose={closeModal} />
		</>
	);
};

export { ModalManager, emitShowModal };
