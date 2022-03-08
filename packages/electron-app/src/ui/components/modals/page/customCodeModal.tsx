import React, { RefObject, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { Modal } from "@dyson/components/molecules/Modal";
import { ModalTopBar } from "../topBar";
import { Button } from "@dyson/components/atoms/button/Button";
import { performCustomCode } from "electron-app/src/ui/commands/perform";
import { iAction } from "@shared/types/action";
import { useStore } from "react-redux";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { sendSnackBarEvent } from "../../toast";

interface iElementCustomScriptModalContent {
	isOpen: boolean;
	handleClose: () => void;

	// For editing
	stepIndex?: number;
	stepAction?: iAction;
}
const CustomCodeModal = (props: iElementCustomScriptModalContent) => {
	const { isOpen } = props;
	const store = useStore();

	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);
	const handleLoad = React.useCallback(() => {
		if (codeTextAreaRef.current) {
			codeTextAreaRef.current!.value =
				"async function validate(crusherSdk, ctx){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n}";

			if (props.stepAction) {
				codeTextAreaRef.current!.value = props.stepAction.payload.meta.script;
			}
			const editor = (window as any).CodeMirror.fromTextArea(codeTextAreaRef.current!, {
				mode: "javascript",
				lineNumbers: true,
				extraKeys: { "Ctrl-Space": "autocomplete" },
				theme: "material",
			});

			editor.on("change", handleScriptChange);

			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 1 }, { readOnly: true, inclusiveLeft: true });
			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 2 }, { readOnly: true, inclusiveLeft: true });

			editor.getDoc().markText({ line: 3, ch: 0 }, { line: 3, ch: 1 }, { readOnly: true, inclusiveLeft: true, inclusiveRight: true });
		}
	}, [props.stepAction, codeTextAreaRef.current]);

	React.useEffect(() => {
		handleLoad();
	}, [isOpen]);

	const handleScriptChange = async (cm: any, change: any) => {
		const script = cm.getValue();
		codeTextAreaRef.current!.value = script;
	};

	const runCustomCode = React.useCallback(() => {
		performCustomCode(codeTextAreaRef?.current.value);
		props.handleClose();
	}, [codeTextAreaRef]);

	const updateCustomCode = React.useCallback(() => {
		if (props.stepAction) {
			props.stepAction.payload.meta.script = codeTextAreaRef?.current.value;
			store.dispatch(updateRecordedStep({ ...props.stepAction }, props.stepIndex));
			sendSnackBarEvent({ type: "success", message: "Custom code updated" });
			props.handleClose();
		}
	}, [props.stepAction, codeTextAreaRef]);

	const isThereScriptOutput = true;

	const isThereScriptError = false;

	if (!isOpen) return null;

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Custom code"} desc={"Write your own code for custom functionality"} closeModal={props.handleClose} />

			<div
				css={css`
					padding: 26rem 34rem;
				`}
			>
				<textarea
					id={"custom_script"}
					css={css`
						width: 100%;
						height: 400rem;
						color: #000;
						font-size: 14rem;
					`}
					ref={codeTextAreaRef}
				></textarea>

				<div css={bottomBarStyle}>
					<Button css={saveButtonStyle} onClick={props.stepAction ? updateCustomCode : runCustomCode}>
						{props.stepAction ? "Update" : "Save"}
					</Button>
				</div>
			</div>

			<style>{`
					.CodeMirror {
						font-size: 14rem;
						background-color: #050505 !important;
					}

			.CodeMirror-gutters {
				background: #0a0d0e !important;
				margin-right: 20rem;
			}

			.CodeMirror-line {
				padding-left: 12rem !important;
			}

			.CodeMirror-scroll {
				padding-top: 8rem;
			}

			`}</style>
		</Modal>
	);
};

const modalStyle = css`
	width: 800rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;

const containerCSS = css`
	padding-top: 1rem;
	position: relative;
`;
const validationStatusContainerCSS = css`
	position: absolute;
	right: 0.75rem;
	top: 1.5rem;
`;
const bottomBarStyle = css`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-top: 1.5rem;
`;
const saveButtonStyle = css`
	font-size: 14rem;
	margin-top: 16rem;
	padding: 10rem 32rem;
	text-align: center;
	color: #fff;
`;

export { CustomCodeModal };
