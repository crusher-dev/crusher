import { iAction } from "@shared/types/action";
import { iElementInfo } from "electron-app/src/store/reducers/recorder";

enum TRecorderMessagesType {
	"Commands.recordAction" = "Commands.recordAction",
	"Commands.turnOnElementMode" = "Commands.turnOnElementMode",
	"Commands.turnOnInspectMode" = "Commands.turnOnInspectMode",
	"Commands.turnOffInspectMode" = "Commands.turnOffInspectMode",
	"recorder-ready" = "recorder-ready",
}

const recordAction = (action: iAction) => {
	(window as any).recorder.sendMessage({
		type: "Commands.recordAction",
		payload: { action },
	});
};

const turnOnElementMode = (selectedElementInfo: iElementInfo) => {
	(window as any).recorder.sendMessage({
		type: "Commands.turnOnElementMode",
		payload: { selectedElementInfo },
	});
};

const turnOnInspectMode = () => {
	(window as any).recorder.sendMessage({
		type: "Commands.turnOnInspectMode",
	});
};

const turnOffInspectMode = () => {
	(window as any).recorder.sendMessage({
		type: "Commands.turnOffInspectMode",
	});
};

const sendRecorderReadySignal = () => {
	(window as any).recorder.sendMessage({
		type: "recorder-ready",
	});
};

export { recordAction, turnOnInspectMode, turnOffInspectMode, turnOnElementMode, sendRecorderReadySignal, TRecorderMessagesType };
