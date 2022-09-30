import React from "react";
import { AssertElementModal } from "./element/assertElementModal";
import { RunAfterTestModal } from "./page/runAfterTestModal";
import { SeoModalContent } from "./page/seoModal";
import { WaitModal } from "./page/waitModal";
import mitt from "mitt";
import { useStore } from "react-redux";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";

export const modalEmitter = mitt();

const emitShowModal = (event: { type: any; stepIndex?: any }) => {
	modalEmitter.emit("show-modal", event);
};

const ModalManager = () => {
	const [currentModal, setCurrentModal] = React.useState({ type: null, stepIndex: null });
	const store = useStore();

	React.useEffect(() => {
		modalEmitter.on("show-modal", ({ type, stepIndex }: { type: any; stepIndex?: number }) => {
			setCurrentModal({ type, stepIndex });
		});
		return () => {
			modalEmitter.off("show-modal");
		};
	}, []);

	const closeModal = () => {
		setCurrentModal({ type: null, stepIndex: null });
	};

	const stepAction = React.useMemo(() => {
		if (typeof currentModal.stepIndex !== "undefined") {
			const savedSteps = getSavedSteps(store.getState() as any);
			return savedSteps[currentModal.stepIndex];
		}
		return null;
	}, [currentModal.stepIndex]);

	return (
		<>
			<AssertElementModal
				stepAction={stepAction as any}
				stepIndex={currentModal.stepIndex}
				isOpen={currentModal.type === "SHOW_ASSERT_MODAL"}
				handleClose={closeModal}
			/>
			<WaitModal stepIndex={currentModal.stepIndex} stepAction={stepAction as any} isOpen={currentModal.type === "WAIT"} handleClose={closeModal} />
			<RunAfterTestModal
				stepAction={stepAction as any}
				stepIndex={currentModal.stepIndex}
				isOpen={currentModal.type === "RUN_AFTER_TEST"}
				handleClose={closeModal}
			/>
			<SeoModalContent
				stepAction={stepAction as any}
				stepIndex={currentModal.stepIndex}
				isOpen={currentModal.type === "SHOW_SEO_MODAL"}
				handleClose={closeModal}
			/>
		</>
	);
};

export { ModalManager, emitShowModal };
