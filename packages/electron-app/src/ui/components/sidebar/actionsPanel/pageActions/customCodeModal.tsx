import React, { RefObject, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { Modal } from "@dyson/components/molecules/Modal";
import { ModalTopBar } from "../../../modals/topBar";
import { Button } from "@dyson/components/atoms/button/Button";
import { performCustomCode } from "electron-app/src/ui/commands/perform";

interface iElementCustomScriptModalContent {
	isOpen: boolean;
    handleClose: () => void;
}
const CustomCodeModal = (props: iElementCustomScriptModalContent) => {
    const { isOpen } = props;
	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);

	const handleLoad = React.useCallback(() => {
		if (codeTextAreaRef.current) {
			console.log("writing hte value");
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
	}, [codeTextAreaRef.current]);

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

	const isThereScriptOutput = true;

	const isThereScriptError = false;

    if(!isOpen) return null;

	return (
        <Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
            <ModalTopBar title={"Custom code"} desc={"Write your own code for custom functionality"} closeModal={props.handleClose} />
            
            <div css={css`padding: 26rem 34rem;`}>
                <textarea id={"custom_script"} css={css`width: 100%; height: 400rem; color: #000; font-size: 14rem;`} ref={codeTextAreaRef}></textarea>

                <div css={bottomBarStyle}>
                    <Button css={saveButtonStyle} onClick={runCustomCode}>Save</Button>
                </div>
            </div>


			<style>{`
					.CodeMirror {
						font-size: 14rem;
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
