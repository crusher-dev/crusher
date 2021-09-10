import React, { RefObject, useEffect, useRef } from "react";
import { Button } from "../../../components/app/button";
import { POSITION, TEXT_ALIGN } from "../../../../interfaces/css";
import { executeScriptInFrame, turnOffInspectModeInFrame } from "../../../../messageListener";
import { getActionsRecordingState, getLastElementCustomScriptOutput } from "../../../../redux/selectors/recorder";
import { useSelector } from "react-redux";
import { Conditional } from "../../../components/conditional";
import { getStore } from "../../../../redux/store";
import { turnOffRecorder, turnOnRecorder, updateActionsRecordingState, updateAutoRecorderSetting } from "../../../../redux/actions/recorder";
import { ACTIONS_RECORDING_STATE } from "../../../../interfaces/actionsRecordingState";
import { recordAction } from "../../../../redux/actions/actions";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iElementInfo } from "@shared/types/elementInfo";
import { recordActionWithHoverNodes } from "crusher-electron-app/src/extension/redux/utils/actions";

interface iElementCustomScriptModalContent {
	onClose?: any;
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}
const CustomCodeModalContent = (props: iElementCustomScriptModalContent) => {
	const { onClose, deviceIframeRef } = props;
	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);

	useEffect(() => {
		if (codeTextAreaRef.current) {
			codeTextAreaRef.current!.value =
				"async function validate(){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n}";
			const editor = (window as any).CodeMirror.fromTextArea(codeTextAreaRef.current!, {
				mode: "javascript",
				theme: "mdn-like",
			});

			editor.on("change", handleScriptChange);

			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 1 }, { readOnly: true, inclusiveLeft: true });
			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 2 }, { readOnly: true, inclusiveLeft: true });

			editor.getDoc().markText({ line: 3, ch: 0 }, { line: 3, ch: 1 }, { readOnly: true, inclusiveLeft: true, inclusiveRight: true });
		}
	}, [codeTextAreaRef]);

	const handleClose = async () => {
		const store = getStore();
		store.dispatch(
			recordAction({
				type: ActionsInTestEnum.CUSTOM_CODE,
				payload: {
					selectors: null,
					meta: {
						script: codeTextAreaRef.current!.value,
					},
				},
				screenshot: null,
				url: "",
			}),
		);
		store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.PAGE));
		onClose();

		store.dispatch(turnOffRecorder());
		try {
			await (window as any).electron.executeCustomCodeScript(codeTextAreaRef.current!.value);
		} catch (e) {}
		store.dispatch(turnOnRecorder());
	};

	const handleScriptChange = async (cm: any, change: any) => {
		const script = cm.getValue();
		codeTextAreaRef.current!.value = script;
	};

	const isThereScriptOutput = true;

	const isThereScriptError = false;

	return (
		<div style={containerCSS}>
			<textarea id={"custom_script"} ref={codeTextAreaRef}></textarea>

			<div style={bottomBarStyle}>
				<div style={validationStatusContainerCSS}>
					<Conditional If={isThereScriptOutput && !isThereScriptError}>
						<img src={chrome.runtime.getURL("/icons/correct.svg")} style={{ marginLeft: "0.85rem" }} />
					</Conditional>
					<Conditional If={!(isThereScriptOutput || !isThereScriptError)}>
						<img src={chrome.runtime.getURL("/icons/cross.svg")} style={{ marginLeft: "0.85rem" }} />
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

export { CustomCodeModalContent };
