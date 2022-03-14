import React, { RefObject, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { Modal } from "@dyson/components/molecules/Modal";
import { ModalTopBar } from "../topBar";
import { Button } from "@dyson/components/atoms/button/Button";
import { deleteCodeTemplate, getCodeTemplates, performCustomCode, saveCodeTemplate, updateCodeTemplate } from "electron-app/src/ui/commands/perform";
import { iAction } from "@shared/types/action";
import { useStore } from "react-redux";
import { setSelectedElement, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { sendSnackBarEvent } from "../../toast";
import { Checkbox } from "@dyson/components/atoms/checkbox/checkbox";
import { Input } from "@dyson/components/atoms";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
interface iElementCustomScriptModalContent {
	isOpen: boolean;
	handleClose: () => void;

	// For editing
	stepIndex?: number;
	stepAction?: iAction;
}

const DropdownOption = ({ label }) => {
	return <div css={{ padding: "7rem 8rem", width: "100%", cursor: "default" }}>{label}</div>;
};

const sampleCodeList = [
	{
		id: 1,
		name: "Sample 1",
		code: "async function validate(crusherSdk, ctx){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n console.log('test1')\n\n}",
	},
	{
		id: 2,
		name: "Sample 2",
		code: "async function validate(crusherSdk, ctx){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n console.log('test2')\n\n}",
	},
	{
		id: 3,
		name: "Sample 3",
		code: "async function validate(crusherSdk, ctx){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n console.log('test3')\n\n}",
	},
];

const CustomCodeModal = (props: iElementCustomScriptModalContent) => {
	const { isOpen } = props;
	const store = useStore();
	const [codeTemplates, setCodeTemplates] = React.useState([]);
	const [selectedTemplate, setSelectedTemplate] = React.useState(null);
	const [savingTemplateState, setSavingTemplateState] = React.useState({ state: "input" });
	const [needName, setNeedName] = React.useState(false);
	const editorRef = React.useRef(null);

	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);
	const handleLoad = React.useCallback(() => {
		if (codeTextAreaRef.current) {
			codeTextAreaRef.current!.value =
				"async function validate(crusherSdk, ctx){\n  /* Write your custom code here. For more infromation \n     checkout SDK docs here at, https://docs.crusher.dev/sdk */\n\n\n}";

			if (props.stepAction) {
				codeTextAreaRef.current!.value = props.stepAction.payload.meta.script;
			}
			const editor = (window as any).CodeMirror.fromTextArea(codeTextAreaRef.current!, {
				mode: "javascript",
				lineNumbers: true,
				extraKeys: { "Ctrl-Space": "autocomplete" },
				theme: "material",
			});

			editorRef.current = editor;

			editor.on("change", handleScriptChange);

			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 1 }, { readOnly: true, inclusiveLeft: true });
			editor.getDoc().markText({ line: 0, ch: 0 }, { line: 2 }, { readOnly: true, inclusiveLeft: true });

			editor.getDoc().markText({ line: 5, ch: 0 }, { line: 5, ch: 1 }, { readOnly: true, inclusiveLeft: true, inclusiveRight: true });
		}
	}, [props.stepAction, codeTextAreaRef.current]);

	React.useEffect(() => {
		handleLoad();
		if (isOpen) {
			setCodeTemplates([]);
			setSelectedTemplate(null);
			setSavingTemplateState({ state: "input" });
			setNeedName(false);
			getCodeTemplates().then((res) => {
				setCodeTemplates(res.map((a) => ({ id: a.id, code: a.code, name: a.name })));
			});
		}
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

	const handleSaveAsTemplate = async () => {
		setNeedName(true);
	};

	const handleUpdateTemplate = async () => {
		if (selectedTemplate) {
			const templateRecord = codeTemplates.find((a) => a.id === selectedTemplate);
			await updateCodeTemplate(selectedTemplate, templateRecord.name, codeTextAreaRef?.current.value);
			templateRecord.code = codeTextAreaRef?.current.value;
			setCodeTemplates([...codeTemplates]);
			sendSnackBarEvent({ type: "success", message: "Custom code template updated" });
		}
	};

	const handleDeleteTemplate = async () => {
		if (selectedTemplate) {
			await deleteCodeTemplate(selectedTemplate);
			setCodeTemplates([...codeTemplates.filter((a) => a.id !== selectedTemplate)]);
			setSelectedTemplate(null);
			sendSnackBarEvent({ type: "success", message: "Custom code template deleted" });
		}
	}

	const transformListToSelectBoxValues = (codeTemplates) => {
		return codeTemplates.map((test) => ({
			value: test.id,
			label: test.name,
			component: <DropdownOption label={test.name} />,
		}));
	};

	if (!isOpen) return null;

	const getSelectedOption = (arr, id) => {
		return arr.find((a) => a.value === id);
	};

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Custom code"} desc={"Write your own code for custom functionality"} closeModal={props.handleClose} />

			<Conditional showIf={needName}>
				<div
					css={css`
						display: flex;
						padding: 0rem 34rem;
						align-items: center;
					`}
				>
					<span
						css={css`
							font-size: 14rem;
							color: #fff;
						`}
					>
						Name of template
					</span>
					<Input
						css={[
							inputStyle,
							css`
								margin-left: auto;
							`,
						]}
						placeholder={"Enter template name"}
						pattern="[0-9]*"
						size={"medium"}
						onReturn={(name) => {
							const currentCode = codeTextAreaRef.current!.value;
							saveCodeTemplate({ name: name, code: currentCode })
								.then((res) => {
									setCodeTemplates([...codeTemplates, { id: res.id, code: res.code, name: res.name }]);
									setNeedName(false);
									setSavingTemplateState({ state: "saved" });
									sendSnackBarEvent({ type: "success", message: "Template saved" });
								})
								.catch((err) => {
									sendSnackBarEvent({ type: "error", message: "Error template saved" });
								});
						}}
					/>
				</div>
			</Conditional>

			<div
				css={css`
					padding: 8rem 34rem;
					display: flex;
				`}
			>
				<SelectBox
					isSearchable={true}
					dropDownHeight={"auto"}
					css={css`
						font-family: Gilroy;
						input {
							outline: none;
							width: 80%;
						}
						.selectBox {
							height: 34rem;
						}
						.select-dropDownContainer {
							max-height: 200rem;
							overflow-y: scroll;
							::-webkit-scrollbar {
								background: transparent;
								width: 8rem;
							}
							::-webkit-scrollbar-thumb {
								background: white;
								border-radius: 14rem;
							}
						}
						.selectBox__value {
							margin-right: 10rem;
							font-size: 13rem;
						}
						width: 250rem;
						.dropdown-box .dropdown-label {
							padding-top: 4rem !important;
							padding-bottom: 4rem !important;
						}
						.dropdown
					`}
					placeholder={"Select a template"}
					size={"large"}
					selected={selectedTemplate ? [getSelectedOption(transformListToSelectBoxValues(codeTemplates), selectedTemplate)] : undefined}
					values={transformListToSelectBoxValues(codeTemplates)}
					callback={(selectedValue) => {
						const value = selectedValue[0];
						setSelectedTemplate(selectedValue[0]);
						const codeTemplate = codeTemplates.find((item) => item.id === value);
						editorRef.current.getDoc().setValue(codeTemplate.code);
						editorRef.current.getDoc().markText({ line: 0, ch: 0 }, { line: 1 }, { readOnly: true, inclusiveLeft: true });
						editorRef.current.getDoc().markText({ line: 0, ch: 0 }, { line: 2 }, { readOnly: true, inclusiveLeft: true });

						editorRef.current
							.getDoc()
							.markText({ line: 5, ch: 0 }, { line: 5, ch: 1 }, { readOnly: true, inclusiveLeft: true, inclusiveRight: true });
					}}
				/>
				<Conditional showIf={selectedTemplate}>
					<div
						onClick={handleDeleteTemplate}
						css={css`
							align-self: center;
							margin-left: 20rem;
							font-size: 14rem;
							color: #fff;
							:hover {
								opacity: 0.8;
							}
						`}
					>
						Delete
					</div>
				</Conditional>
			</div>
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
					<Conditional showIf={selectedTemplate}>
						<div
							onClick={handleUpdateTemplate}
							css={css`
								position: relative;
								top: 50%;
								transform: translateY(55%);
								margin-right: 26rem;
								font-size: 14rem;
								color: #fff;
								:hover {
									opacity: 0.8;
								}
							`}
						>
							{"Update template"}
						</div>
					</Conditional>
					<div
						onClick={handleSaveAsTemplate}
						css={css`
							position: relative;
							top: 50%;
							transform: translateY(55%);
							margin-right: 26rem;
							font-size: 14rem;
							color: #fff;
							:hover {
								opacity: 0.8;
							}
						`}
					>
						{savingTemplateState.state === "input" ? "Save as template" : savingTemplateState.state === "saved" ? "Save as new template" : ""}
					</div>
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

const inputStyle = css`
	background: #1a1a1c;
	border-radius: 6rem;
	border: 1rem solid #43434f;
	font-family: Gilroy;
	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: none;
`;

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
