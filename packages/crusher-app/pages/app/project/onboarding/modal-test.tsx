import React, {useState} from "react";
import { WatchVideoModal } from "@ui/containers/modals/watchVideoModal";

function modalOverlay() {
	const [showVideoModal, setShowVideoModal] = useState(false);
	function openModal() {
		setShowVideoModal(true);
	}

	function closeModal() {
		setShowVideoModal(false);
	}

	return (
		<div>
			<button onClick={openModal}>Open Modal</button>
			<WatchVideoModal isOpen={showVideoModal} onClose={closeModal} />
		</div>
	);
}

export default modalOverlay;
