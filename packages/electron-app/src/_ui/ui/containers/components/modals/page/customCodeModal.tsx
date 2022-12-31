import { Input } from "@dyson/components/atoms";
import { Button } from "@dyson/components/atoms/button/Button";
import { Conditional } from "@dyson/components/layouts";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { css, Global } from "@emotion/react";
import Editor, { loader, Monaco } from "@monaco-editor/react";
import { iAction } from "@shared/types/action";
import { ipcRenderer, remote, shell } from "electron";
import { updateRecordedStep, updateRecorderState } from "electron-app/src/store/actions/recorder";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { getRecorderState } from "electron-app/src/store/selectors/recorder";
import {
	deleteCodeTemplate,
	getCodeTemplates,
	performCustomCode,
	performUndockCode,
	saveCodeTemplate,
	updateCodeTemplate,
} from "electron-app/src/ipc/perform";
import { DownIcon } from "electron-app/src/_ui/constants/old_icons";
import { MenuItem } from "electron-app/src/_ui/ui/components/dropdown/menuItems";
import { LinkPointer } from "electron-app/src/_ui/ui/components/LinkPointer";
import * as fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as path from "path";
import React, { useRef } from "react";
import { useStore } from "react-redux";
import { sendSnackBarEvent } from "../../toast";
import { ModalTopBar } from "../topBar";
import { newTheme } from "./monaco.theme";
import Tour from "@reactour/tour";
import { ShepherdTourContext } from "react-shepherd";

function ensureFirstBackSlash(str) {
	return str.length > 0 && str.charAt(0) !== "/" ? "/" + str : str;
}

function uriFromPath(_path) {
	const pathName = path.resolve(_path).replace(/\\/g, "/");
	return encodeURI("file://" + ensureFirstBackSlash(pathName));
}

loader.config({
	paths: {
		vs: uriFromPath(path.join(remote.app.getAppPath(), "static/monaco-editor/min/vs")),
	},
});

interface iElementCustomScriptModalContent {
	isOpen: boolean;
	handleClose: any;
	stepIndex?: number;
	stepAction?: iAction;
}

const DropdownOption = ({ label }) => {
	return <div css={{ padding: "7rem 8rem", width: "100%", cursor: "default" }}>{label}</div>;
};

function DropwdownContent({ setShowActionMenu, callback, selectedTemplate }) {
	const handleDeteach = () => {
		setShowActionMenu(false);
		callback("detach");
		sendSnackBarEvent({ type: "success", message: "Detached from template" });
	};
	const handleSaveNewTemplate = () => {
		setShowActionMenu(false);
		callback("save-new-template");
	};

	const handleUpdateTemplate = () => {
		setShowActionMenu(false);
		callback("update-template");
		sendSnackBarEvent({ type: "success", message: "Updated template" });
	};

	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				<Conditional showIf={selectedTemplate}>
					<MenuItem onClick={handleDeteach} label={"Detach template"} className={"close-on-click"} />
					<MenuItem onClick={handleUpdateTemplate} label={"Update template"} className={"close-on-click"} />
				</Conditional>
				<MenuItem onClick={handleSaveNewTemplate} label={"Save new template"} className={"close-on-click"} />
			</div>
		</div>
	);
}

const initialCodeTemplate = `/*
	Docs: https://docs.crusher.dev/sdk 
*/
async function validate(crusherSdk: CrusherSdk, ctx: any) {
	const { page } = crusherSdk;

    // await page.goto("https://news.ycombinator.com/login?goto=news");
	// const input = await page.waitForSelector("input[name=acct]");
	// await input.type(await page.url());
    // expect(await input.inputValue()).toBe(await page.url());
}`;

const onboardingCodeTemplate = `/*
	Docs: https://docs.crusher.dev/sdk
*/
async function validate(crusherSdk: CrusherSdk, ctx: any) {
	const { page } = crusherSdk;

	await page.click("div");
}`;

const CustomCodeModal = (props: iElementCustomScriptModalContent) => {
	const { isOpen } = props;
	const store = useStore();
	const [codeTemplates, setCodeTemplates] = React.useState([]);
	const [selectedTemplate, setSelectedTemplate] = React.useState(null);
	const [, setSavingTemplateState] = React.useState({ state: "input" });
	const [needName, setNeedName] = React.useState(false);
	const [modalName] = React.useState("ts:modal.ts");
	const [showActionMenu, setShowActionMenu] = React.useState(false);

	const monacoRef: React.Ref<Monaco> = React.useRef(null);
	const editorMainRef = React.useRef(null);

	const codeTextAreaRef = useRef(null as null | HTMLTextAreaElement);
	const tour = React.useContext(ShepherdTourContext);

	React.useEffect(() => {
		const handleListener = () => {
			if (editorMainRef.current) {
				const topbar = document.querySelector("#top-bar");
				if (!topbar) return;
				const rect = topbar.parentElement.getBoundingClientRect();
				const containerNode = (editorMainRef.current as monaco.editor.IStandaloneCodeEditor).getContainerDomNode();
				const mainContainerNode = containerNode.parentNode.parentNode;

				const { childNodes } = mainContainerNode.parentNode;
				let occupiedHeight = 0;
				for (let childNode of Array.from(childNodes)) {
					if (childNode !== mainContainerNode) {
						occupiedHeight += (childNode as HTMLElement).getBoundingClientRect().height;
					}
				}

				(editorMainRef.current as monaco.editor.IStandaloneCodeEditor).layout({ width: rect.width, height: rect.height - occupiedHeight - 20 });
			}
		};

		window["resizeCustomCode"] = handleListener;

		window.addEventListener("resize", handleListener);

		return () => {
			window["resizeCustomCode"] = undefined;
			window.removeEventListener("resize", handleListener);
		};
	}, []);
	React.useEffect(() => {
		if (isOpen) {
			setCodeTemplates([]);
			setSelectedTemplate(null);
			setSavingTemplateState({ state: "input" });
			setNeedName(false);
			getCodeTemplates().then((res) => {
				const templatesArr = res.map((a) => ({ id: a.id, code: a.code, name: a.name }));
				setCodeTemplates(templatesArr);
			});
		}
	}, [isOpen]);

	const handleCustomClose = React.useCallback(
		(shouldUpdate: boolean = true) => {
			const recorderState = getRecorderState(store.getState());
			if (shouldUpdate && recorderState.payload && (recorderState.payload as any).previousState) {
				store.dispatch(updateRecorderState((recorderState.payload as any).previousState.type, (recorderState.payload as any).previousState.payload));
			}
			props.handleClose();
		},
		[props.handleClose],
	);

	const runCustomCode = React.useCallback(() => {
		store.dispatch(updateRecorderState(TRecorderState.PERFORMING_ACTIONS, {}));

		performCustomCode(monacoRef.current.editor.getModel(modalName).getValue(), selectedTemplate);
		handleCustomClose(false);
	}, [selectedTemplate, codeTextAreaRef, handleCustomClose]);

	const updateCustomCode = React.useCallback(() => {
		if (props.stepAction) {
			props.stepAction.payload.meta.script = monacoRef.current.editor.getModel(modalName).getValue();
			props.stepAction.payload.meta.templateId = selectedTemplate;
			store.dispatch(updateRecordedStep(props.stepAction, props.stepIndex));
			sendSnackBarEvent({ type: "success", message: "Custom code updated" });
			handleCustomClose();
		}
	}, [props.stepAction, selectedTemplate, codeTextAreaRef, handleCustomClose]);

	const handleSaveAsTemplate = () => {
		setNeedName(true);
		setTimeout(() => {
			document.querySelector("#template-name-input")?.focus();
		}, 5);
	};

	const handleUpdateTemplate = async () => {
		if (selectedTemplate) {
			const templateRecord = codeTemplates.find((a) => a.id === selectedTemplate);
			await updateCodeTemplate(selectedTemplate, templateRecord.name, monacoRef.current.editor.getModel(modalName).getValue());
			templateRecord.code = monacoRef.current.editor.getModel(modalName).getValue();
			setCodeTemplates(codeTemplates.slice());
			sendSnackBarEvent({ type: "success", message: "Custom code template updated" });
		}
	};

	const handleDetach = () => {
		if (selectedTemplate) {
			setSelectedTemplate(null);
			sendSnackBarEvent({ type: "success", message: "Detached from template. Just click on Save to continue..." });
		}
	};


	if (!isOpen) return null;


	const handleOnMount = (editor: any) => {
		editorMainRef.current = editor;

		if (props.stepAction) {
			editor.getModel(modalName).setValue(props.stepAction.payload.meta.script);

			getCodeTemplates().then((res) => {
				const templatesArr = res.map((a) => ({ id: a.id, code: a.code, name: a.name }));
				setCodeTemplates(templatesArr);
				console.log("Step action is", props.stepAction);
				const template =
					props.stepAction && props.stepAction.payload.meta.templateId
						? templatesArr.find((a) => props.stepAction && a.id === props.stepAction.payload.meta.templateId)
						: null;
				if (template) {
					setSelectedTemplate(template.id);
				}
			});
		}

		if(tour.isActive()) {
			editor.getModel(modalName).setValue(onboardingCodeTemplate);
		}
	};

	(window as any).updateCodeEditorValue = (value: string) => {
		if (editorMainRef.current) {
			editorMainRef.current.getModel(modalName).setValue(value);
		}
	};

	const handleEditorWillMount = (monaco: Monaco) => {
		monacoRef.current = monaco;

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ESNext,
			module: monaco.languages.typescript.ModuleKind.ESNext,
			allowSyntheticDefaultImports: true,
			allowNonTsExtensions: true,
		});

		const libUri = "ts:filename/sdk.d.ts";
		let types = fs.readFileSync(path.resolve(remote.app.getAppPath(), "static/types.txt"), "utf8");
		const ctx = ipcRenderer.sendSync("get-var-context");
		types += `\n declare const ctx: { ${Object.keys(ctx)
			.map((a) => {
				return `${a}: ${ctx[a]};`;
			})
			.join("")} | any };`;
		monaco.languages.typescript.typescriptDefaults.addExtraLib(types, libUri);

		monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
			diagnosticCodesToIgnore: [1375],
		});

		monaco.editor.defineTheme("my-theme", {
			base: "vs-dark",
			inherit: true,
			rules: newTheme.rules.slice(),
			colors: {
				...newTheme.colors,
				"editor.background": "#080808",
			},
		});
	};

	const handleCreateTemplate = (name) => {
		if (!name || !name.length) {
			sendSnackBarEvent({ type: "error", message: "Error: Enter some name for the template" });
			return;
		}
		const currentCode = monacoRef.current.editor.getModel(modalName).getValue();
		saveCodeTemplate({ name: name, code: currentCode })
			.then((res) => {
				setCodeTemplates([...codeTemplates, { id: res.id, code: res.code, name: res.name }]);
				setSelectedTemplate(res.id);
				setNeedName(false);
				setSavingTemplateState({ state: "saved" });
				sendSnackBarEvent({ type: "success", message: "Template saved" });
			})
			.catch(() => {
				sendSnackBarEvent({ type: "error", message: "Error template saved" });
			});
	};

	const handleUnDock = () => {
		performUndockCode(props.stepIndex);
		props.handleClose();
	};

	const handleReadDocs = React.useCallback(() => {
		shell.openExternal("https://docs.crusher.dev");
	}, []);

	return (
		<div
			id="current-modal"
			className="custom-code-modal"
			css={css`
				background: #09090a;
				height: 100%;
				display: flex;
				flex-direction: column;
			`}
		>
			<ModalTopBar
				css={css`
					padding-bottom: 20rem;
					border-bottom: 0.25px solid rgb(255, 255, 255, 0.08);
				`}
				actions={
					<UnDockIcon
						onClick={handleUnDock}
						css={css`
							width: 14rem;
							height: 14rem;
							:hover {
								opacity: 0.8;
							}
						`}
					/>
				}
				title={
					<>
						<span>Code block</span>
						<LinkPointer
							onClick={handleReadDocs}
							css={css`
						letter-spacing: .4px;
						
						margin-left: 8rem;
						margin-top: -4rem; font-size: 13px; font-weight: 400; 	color: rgba(255, 255, 255, 0.5);`}>docs</LinkPointer>

					</>
				}
				closeModal={() => {
					handleCustomClose();
				}}
			/>

			<div
				css={css`
					height: auto;
					padding: 12rem 34rem;
					background: #080808;
					padding-left: 4rem;
					border-bottom-left-radius: 12px;
					border-bottom-right-radius: 12px;
					flex: 1;
				`}
			>
				<Editor
					path={"ts:modal.ts"}
					height="100%"
					defaultLanguage="typescript"
					beforeMount={handleEditorWillMount}
					onMount={handleOnMount}
					theme={"my-theme"}
					options={{ minimap: { enabled: false }, automaticLayout: true }}
					defaultValue={initialCodeTemplate}
				/>

				{needName && (
					<div
						css={css`
							position: fixed;
							display: flex;
							align-items: center;
							margin-top: 10rem;
							margin-bottom: 12rem;
						`}
					>
						<div
							css={css`
								display: flex;
								align-items: center;
							`}
						>
							<Input
								id="template-name-input"
								css={[
									inputStyle,
									css`
										margin-left: auto;
										min-width: 118rem;
									`,
								]}
								placeholder={"Enter template name"}
								pattern="[0-9]*"
								size={"medium"}
								onReturn={handleCreateTemplate}
							/>
							<Button
								css={[
									saveButtonStyle,
									css`
										width: 118rem;
										border-right-width: 6rem;
										border-top-right-radius: 6rem;
										border-bottom-right-radius: 6rem;
										margin-left: 18rem;
										height: 34rem;
									`,
								]}
								onClick={() => {
									const name = (document.querySelector("#template-name-input") as HTMLInputElement).value;
									handleCreateTemplate(name);
								}}
							>
								{"Create"}
							</Button>
						</div>
					</div>
				)}
			</div>
			<div css={bottomBarStyle}>
				<div
					css={css`
						display: flex;
						gap: 20rem;
						align-items: center;
					`}
				></div>
				<div
					css={css`
						display: flex;
						align-items: center;
						margin-left: auto;
					`}
				>
					<Dropdown
						initialState={showActionMenu}
						component={
							<DropwdownContent
								callback={(method) => {
									if (method === "save-new-template") {
										handleSaveAsTemplate();
									} else if (method === "detach") {
										handleDetach();
									} else if (method === "update-template") {
										handleUpdateTemplate();
									}
								}}
								selectedTemplate={selectedTemplate}
								setShowActionMenu={setShowActionMenu.bind(this)}
							/>
						}
						callback={setShowActionMenu.bind(this)}
						css={css`
							margin-left: auto;
							.showOnClick {
								display: flex;
								align-items: center;
							}
						`}
						dropdownCSS={css`
							left: 0rem !important;
							width: 162rem;
							z-index: 123123123123123;
							left: -2rem !important;
							top: auto;
							bottom: calc(100% + 4rem);
						`}
					>
						<Button
							id="save-code-button"
							css={saveButtonStyle}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if(tour.isActive()) {
									tour.next();
								}
								if (props.stepAction) {
									updateCustomCode();
								} else {
									runCustomCode();
								}
							}}
						>
							{props.stepAction ? "Save step" : "Save and run"}
						</Button>
						<div css={buttonSideBar}>
							<DownIcon
								fill={"#fff"}
								css={css`
									width: 9rem;
								`}
							/>
						</div>
					</Dropdown>
				</div>
			</div>
		</div>
	);
};

const UnDockIcon = (props) => (
	<svg viewBox={"0 0 16 16"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M15.311 0H5.105a.684.684 0 0 0-.682.682v3.744H.683A.684.684 0 0 0 0 5.108v10.21c0 .375.307.682.682.682h10.21a.684.684 0 0 0 .682-.682V11.57h3.744a.684.684 0 0 0 .682-.682V.682A.694.694 0 0 0 15.311 0ZM10.21 14.665H1.328V5.784h3.098v5.105c0 .375.307.682.682.682h5.105v3.094h-.003Zm0-4.455H5.784V5.784h4.422v4.426h.004Zm4.455 0h-3.097V5.105a.684.684 0 0 0-.683-.682H5.784V1.328h8.881v8.882Z"
			fill="#737373"
		/>
	</svg>
);

const inputStyle = css`
	background: #1a1a1c;
	border-radius: 6rem;
	border: 1rem solid #43434f;

	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: none;
`;

const bottomBarStyle = css`
	display: flex;
	align-items: center;
	padding: 12rem 28rem;
	background: #080808;
`;
const saveButtonStyle = css`
	font-size: 14rem;
	box-sizing: border-box;
	border-radius: 8px;
	background: #b341f9 !important;
	border: 0.5px solid #b341f9 !important;
	border-radius: 8rem 0 0 8rem !important;
	height: 36rem;
	padding: 0 8rem !important;
`;

const buttonSideBar = css`
	background: #b341f9;
	display: flex;
	align-items: center;
	padding: 0rem 9rem;
	border-top-right-radius: 6rem;
	border-bottom-right-radius: 6rem;
	border-left-color: #8b37bd;
	border-left-width: 1rem;
	border-left-style: solid;

	align-self: stretch;
`;

export { CustomCodeModal };
