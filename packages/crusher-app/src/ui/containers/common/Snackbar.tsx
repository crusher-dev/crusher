import React, { useEffect, useState } from "react";

import { Toast } from "dyson/src/components/atoms/toast/Toast";

import mitt from "mitt";

export const snackBarEmitter = mitt();

export type SnackbarEvent = {
	message: string;
	type?: "normal" | "success" | "info" | "error";
};

export const Snackbar = () => {
	const [event, setEvent] = useState<SnackbarEvent | null>(null);
	useEffect(() => {
		snackBarEmitter.on("snackbar-notify", (e) => {
			setEvent(e as SnackbarEvent);

			setTimeout(() => {
				setEvent(null);
			}, 7000);
		});
	}, []);


	if (event === null) return null;

	return (
		<Toast type={event.type} onClose={setEvent.bind(this, null)}>
			{event.message}
		</Toast>
	);
};
