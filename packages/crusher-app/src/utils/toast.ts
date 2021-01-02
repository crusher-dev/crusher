import { emitter } from "@utils/mitt";
import { TOAST_TYPE, iToastInfo } from "@interfaces/toast";

export class Toast {
	static showSuccess(message: string) {
		emitter.emit("TOAST", {
			type: TOAST_TYPE.SUCCESS,
			message: message,
		} as iToastInfo);
	}

	static showError(message: string) {
		emitter.emit("TOAST", {
			type: TOAST_TYPE.ERROR,
			message: message,
		} as iToastInfo);
	}

	static showInfo(message: string) {
		emitter.emit("TOAST", {
			type: TOAST_TYPE.INFO,
			message: message,
		} as iToastInfo);
	}
}
