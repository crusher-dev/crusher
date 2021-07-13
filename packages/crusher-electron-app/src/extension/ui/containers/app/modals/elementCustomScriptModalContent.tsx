import React, { RefObject, useEffect, useRef } from "react";
import { Button } from "../../../components/app/button";
import { POSITION, TEXT_ALIGN } from "../../../../interfaces/css";
import { executeScriptInFrame, turnOffInspectModeInFrame } from "../../../../messageListener";
import { getActionsRecordingState, getLastElementCustomScriptOutput } from "../../../../redux/selectors/recorder";
import { useSelector } from "react-redux";
import { Conditional } from "../../../components/conditional";
import { getStore } from "../../../../redux/store";
import { updateActionsRecordingState } from "../../../../redux/actions/recorder";
import { ACTIONS_RECORDING_STATE } from "../../../../interfaces/actionsRecordingState";
import { recordAction } from "../../../../redux/actions/actions";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { iElementInfo } from "@shared/types/elementInfo";

interface iElementCustomScriptModalContent {
	onClose?: any;
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}
const ElementCustomScriptModalContent = (props: iElementCustomScriptModalContent) => {
	const recordingState = useSelector(getActionsRecordingState);
	const elementInfo: iElementInfo = recordingState.elementInfo as iElementInfo;

	const { onClose, deviceIframeRef } = props;
	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);
	const lastElementOutput = useSelector(getLastElementCustomScriptOutput);

	useEffect(() => {
		if (codeTextAreaRef.current) {
			codeTextAreaRef.current!.value = "async function validate(element){\n  /* Write your logic here, and return true or false */\n}";
			const editor = (window as any).CodeMirror.fromTextArea(codeTextAreaRef.current!, {
				mode: "javascript",
				theme: "mdn-like",
			});

			editor.on("change", handleScriptChange);

			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 1 }, { readOnly: true, inclusiveLeft: true });

			editor.getDoc().markText({ line: 2, ch: 0 }, { line: 2, ch: 1 }, { readOnly: true, inclusiveLeft: true, inclusiveRight: true });
		}
	}, [codeTextAreaRef]);

	const handleClose = () => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ACTIONS_IN_TEST.CUSTOM_ELEMENT_SCRIPT,
				payload: {
					selectors: elementInfo.selectors,
					meta: {
						script: codeTextAreaRef.current!.value,
					},
				},
				url: "",
			}),
		);

		store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.PAGE));
		turnOffInspectModeInFrame(deviceIframeRef);

		onClose();
	};

	const handleScriptChange = async (cm: any, change: any) => {
		const script = cm.getValue();
		codeTextAreaRef.current!.value = script;
		executeScriptInFrame(script, "", deviceIframeRef);
	};

	const isThereScriptOutput = lastElementOutput && lastElementOutput.type === "output" && lastElementOutput.value;

	const isThereScriptError = lastElementOutput && lastElementOutput.type === "error";

	return (
		<div style={containerCSS}>
			<textarea id={"custom_script"} ref={codeTextAreaRef}></textarea>

			<div style={bottomBarStyle}>
				<div style={validationStatusContainerCSS}>
					<Conditional If={lastElementOutput}>
						<Conditional If={isThereScriptOutput}>
							<img src={chrome.runtime.getURL("/icons/correct.svg")} style={{ marginLeft: "0.85rem" }} />
						</Conditional>
						<Conditional If={!isThereScriptOutput || isThereScriptError}>
							<img src={chrome.runtime.getURL("/icons/cross.svg")} style={{ marginLeft: "0.85rem" }} />
						</Conditional>
					</Conditional>
				</div>
				<Button style={saveButtonStyle} title={"Save action"} onClick={handleClose}></Button>
			</div>
		</div>
	);
};

const containerCSS = {
	paddingTop: "1rem",
	position: POSITION.RELATIVE,
};
const validationStatusContainerCSS = {
	position: POSITION.ABSOLUTE,
	right: "0.75rem",
	top: "1.5rem",
};
const bottomBarStyle = {
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	marginTop: "1.5rem",
};
const saveButtonStyle = {
	fontSize: "0.9rem",
	padding: "10px 32px",
	textAlign: TEXT_ALIGN.CENTER,
	color: "#fff",
};

export { ElementCustomScriptModalContent };
