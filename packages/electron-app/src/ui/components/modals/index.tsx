import React from "react";
import { TElementActionsEnum } from "../sidebar/actionsPanel/elementActions";
import { AssertElementModal } from "./element/assertElementModal";
import { TTopLevelActionsEnum } from "../sidebar/actionsPanel/pageActions";
import { CustomCodeModal } from "./page/customCodeModal";
import { RunAfterTestModal } from "./page/runAfterTestModal";
import { SeoModalContent } from "./page/seoModal";
import { WaitModal } from "./page/waitModal";
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
