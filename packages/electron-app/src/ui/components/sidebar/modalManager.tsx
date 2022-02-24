import React from "react";
import { TElementActionsEnum } from "./actionsPanel/elementActions";
import { AssertElementModal } from "./actionsPanel/elementActions/assertElementModal";
import { TTopLevelActionsEnum } from "./actionsPanel/pageActions";
import { CustomCodeModal } from "./actionsPanel/pageActions/customCodeModal";
import { RunAfterTestModal } from "./actionsPanel/pageActions/runAfterTestModal";
import { SeoModalContent } from "./actionsPanel/pageActions/seoModal";
import { WaitModal } from "./actionsPanel/pageActions/waitModal";

const ModalManager = () => {
	const [currentModal, setCurrentModal] = React.useState(false);

	const closeModal = () => {
		setCurrentModal(null);
	};

	return (
		<>
			<AssertElementModal isOpen={currentModal === TElementActionsEnum.SHOW_ASSERT_MODAL} handleClose={closeModal} />
			<WaitModal isOpen={currentModal === TTopLevelActionsEnum.WAIT} handleClose={closeModal} />
			<RunAfterTestModal isOpen={currentModal === TTopLevelActionsEnum.RUN_AFTER_TEST} handleClose={closeModal} />
			<CustomCodeModal isOpen={currentModal === TTopLevelActionsEnum.CUSTOM_CODE} handleClose={closeModal} />
			<SeoModalContent isOpen={currentModal === TTopLevelActionsEnum.SHOW_SEO_MODAL} handleClose={closeModal} />
		</>
	);
};

export { ModalManager };
