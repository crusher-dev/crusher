import { ILog, ILoggerReducer } from "electron-app/src/store/reducers/logger";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { getLogs } from "electron-app/src/store/selectors/logger";
import { MiniCrossIcon } from "../../../../constants/old_icons";
import { ObjectInspector, chromeDark } from "react-inspector";
import { CustomCodeModal } from "../modals/page/customCodeModal";
import { modalEmitter } from "../modals";
import { getRecorderState, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { updateRecorderState } from "electron-app/src/store/actions/recorder";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";
import { DocsIcon, ExportIcon, UpDownSizeIcon } from "electron-app/src/_ui/constants/icons";
import { ExternalIcon, HelpContent } from "electron-app/src/_ui/ui/containers/common/stickyFooter";
import { atom, useAtom } from "jotai";
import { statusBarMaximiseAtom } from "electron-app/src/_ui/store/jotai/statusBar";
import { HoverButton } from "../../../components/hoverButton";
import { remote } from "electron";
import fs from "fs";
import { showToast } from "../../../components/toasts";
import path from "path";
import { EnvironmentStatus } from "../../common/environmentStatus";
import { getCurrentProjectMetadata } from "electron-app/src/store/selectors/projects";
import { getTestContextVariables } from "electron-app/src/ipc/perform";

interface ITabButtonProps {
	title: string;
	selected: boolean;
	text?: string;
	className?: string;
	callback?: any;
}
const TabButton = (props: ITabButtonProps) => {
	const { className, selected, callback, text } = props;
	return (
		<div
			className={className || ""}
			onClick={callback}
			css={[
				statusBarTabStyle,
				selected
					? css`
							color: #8568d5;
					  `
					: null,
			]}
		>
			<div>
				<Conditional showIf={text != null}>
					<span className="ml-4" css={logsCountStyle}>
						{text}
					</span>
				</Conditional>
			</div>
		</div>
	);
};

enum TabsEnum {
	LOGS = "LOGS",
	CONTEXT = "CONTEXT",
	HOOKS = "HOOKS",
}

const SAMPLE_CONTEXT = {
	testId: 71,
	testName: "Booking flow",
	query: "Skip the line guided",
	parentTest: {
		id: 69,
		name: "Login",
	},
	userName: "Itisha Jain",
	userEmail: "itisha.mail@headout.com",
	userPhone: "9876543210",
};

const ArrowRightIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 17.804 17.804"
		style={{
			enableBackground: "new 0 0 17.804 17.804",
		}}
		xmlSpace="preserve"
		{...props}
	>
		<path d="M2.067.043a.4.4 0 0 1 .426.042l13.312 8.503a.41.41 0 0 1 .154.313c0 .12-.061.237-.154.314L2.492 17.717a.402.402 0 0 1-.25.087l-.176-.04a.399.399 0 0 1-.222-.361V.402c0-.152.086-.295.223-.359z" />
	</svg>
);

const cssHighlight = css`
		color: #6eafd4;
`

const normalMessage = css`
		color: #b1b1b1;
`


const modalAtom = atom({ type: null, stepIndex: null })
export const useCustomModelData= ()=>{
	const store = useStore();
	const [currentModal, setCurrentModal] = useAtom(modalAtom);
	const closeModal = () => {
		setCurrentModal({ type: null, stepIndex: null });
		window["openLogTime"] = performance.now();
	};

	const stepAction = React.useMemo(() => {
		if (currentModal && typeof currentModal.stepIndex !== "undefined") {
			const savedSteps = getSavedSteps(store.getState() as any);
			return savedSteps[currentModal.stepIndex];
		}
		return null;
	}, [currentModal]);


	return {currentModal, setCurrentModal,stepAction,closeModal}
}

const StatusBar = () => {
	const {
		currentModal, 
		setCurrentModal,
		stepAction,
		closeModal
	} = useCustomModelData();
	const store = useStore();

	const [clicked, setClicked] = useAtom(statusBarMaximiseAtom);
	const [selectedTab, setSelectedTab] = React.useState(TabsEnum.LOGS);
	const logs: ILoggerReducer["logs"] = useSelector(getLogs);
	
	const [context, setContext] = React.useState({});

	React.useEffect(() => {
		if (clicked && window["resizeCustomCode"]) {
			setTimeout(() => window["resizeCustomCode"](), 150);
		}

		getTestContextVariables().then((res) => {
			setContext(res);
		});
	}, [clicked]);

	React.useEffect(() => {
		modalEmitter.on("show-modal", ({ type, stepIndex }: { type: any; stepIndex?: number }) => {
			if (type === "CUSTOM_CODE") {
				const recorderState = getRecorderState(store.getState());
				if (recorderState.payload && !(recorderState.payload as any).previousState) {
					store.dispatch(
						updateRecorderState(TRecorderState.CUSTOM_CODE_ON, { previousState: { type: recorderState.type, payload: recorderState.payload } }),
					);
				}
				setCurrentModal({ type, stepIndex });
				setClicked(true);
			} else {
				setCurrentModal(null);
			}
		});
	}, []);


	React.useEffect(() => {
		if (logs && logs.get("_").length > 0) {
			const listContainer: any = document.querySelector("#logs-list");
			if (listContainer) {
				const elementHeight = listContainer.scrollHeight;
				listContainer.scrollBy(0, elementHeight);
			}
		}
	}, [logs]);

	const LogItem = (props: { log: ILog & { children: ILog[]; diff: string }; diff: string; className?: string; shouldShowChildren }) => {
		const { log, shouldShowChildren } = props;
		const [showChildrens, setShowChildrens] = React.useState(shouldShowChildren);

		const hasChildrens = React.useMemo(() => log.children?.length, [log]);

		const formattedMessage = React.useMemo(() => {
			const stepName = log.message;
			let squareBracketRegex = /(.*)\[(.*)\]/i;
			let result = stepName.match(squareBracketRegex);

			if (result && !log.parent) {
				return (
					<>
						<span css={normalMessage}>{result[1].trim()}</span>
						<span className="ml-4" css={cssHighlight}>{result[2]}</span>
					</>
				)
			}

			return <span css={normalMessage}>{log.message}</span>;

		}, [log])

		return (
			<div className={String(props.className)}>
				<div
					css={css`
						padding-top: 16rem;
						display: flex;
					`}
				>
					{hasChildrens ? (
						<ArrowRightIcon
							onClick={setShowChildrens.bind(this, !showChildrens)}
							css={[
								css`
									width: 8rem;
									fill: #797979;
									margin-right: 4rem;
									:hover {
										opacity: 0.8;
									}
								`,
								showChildrens
									? css`
											transform: rotate(90deg);
									  `
									: undefined,
							]}
						/>
					) : (
						""
					)}
					<div>
						<span
							css={css`
								font-size: 14rem;
								margin-left:3rem;
								color: ${log.type === "error" ? "#ff4c81" : "#8c8c8c"};
							`}
						>
							{log.type}
						</span>
						<span
							css={css`
								font-size: 14rem;
								color: #717171;
								letter-spacing: .15px;

								word-break: break-all;
							`}
							className={"ml-20"}
						>
							{formattedMessage}
						</span>
					</div>
				</div>
				{showChildrens && log.children && log.children.length
					? log.children.map((child: ILog & { children: ILog[]; diff: string }) => {
						if (child.message.includes("\n")) {
							return (
								<pre className={"mt-12 ml-60 px-16 py-12"} css={rawMessageCss}>{child.message}</pre>
							);
						}
						return (
							<LogItem
								css={css`
										padding-left: 20rem;
									`}
								key={child.id}
								log={child}
								diff={child.diff}
							/>
						);
					})
					: ""}
			</div>
		);
	};

	const handleTabSelection = (tabType: TabsEnum) => {
		setSelectedTab(tabType);
	};

	const lastLogMessage = logs && logs.get("_").length ? logs.get("_")[logs.get("_").length - 1] : null;
	

	const getFormattedMessage = (logMessage) => {
		const upperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

		return (
			<div
				css={css`
					display: flex;
					align-items: center;
					font-family: "Gilroy";

					font-weight: 400;
					font-size: 13.4rem;
				`}
			>
				<span
					css={css`
						color: rgba(90, 196, 255, 1);
						font-weight: 600;
					`}
				>
					{upperCase(logMessage.type)}:
				</span>
				<span className={"ml-4"}>{logMessage.message.length > 100 ? logMessage.message.substr(0, 100) + "..." : logMessage.message}</span>
			</div>
		);
	};

	const handleToggle = React.useCallback(
		(e: any) => {
			e.preventDefault();
			e.stopPropagation();
			setClicked(!clicked);
			handleTabSelection(TabsEnum.LOGS);
		},
		[clicked],
	);

	const handleExportLogs = React.useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();

		// Transform logs to string
		const logsString = logs.get("_").map((log) => {
			let str = `${log.type}: ${log.message}`;
			if (logs.get(log.id)) {
				logs.get(log.id).forEach((child) => {
					str += `\n\t${child.type}: ${child.message}`;
				});
			}
			return str;
		}).join("\n");

		var options = {
			title: "Save file",
			defaultPath: path.resolve(require("os").homedir(), "crusher_logs.txt"),
			buttonLabel: "Save",

			filters: [
				{ name: 'txt', extensions: ['txt'] },
				{ name: 'All Files', extensions: ['*'] }
			]
		};

		remote.dialog.showSaveDialog(null, options).then(({ filePath }) => {
			// alert("Saving to " + filePath);
			fs.writeFileSync(filePath, logsString, 'utf-8');
			showToast({
				type: "normal",
				message: "Logs exported successfully",
			})
		});
	}, [logs]);

	const stopPropagation = (e) => { e.stopPropagation(); };

	return (
		<div
			css={[
				css`
					position: absolute;
					bottom: 0rem;
					width: 100%;
					display: flex;
					flex-direction: column;
				`,
				currentModal && currentModal.type === "CUSTOM_CODE"
					? css`
							height: 100%;
					  `
					: undefined,
			]}
		>

			<div
				id={`logsTab`}
				className={String(clicked ? "expandBar" : "")}
				css={[
					statusBarContainerStyle,
					clicked
						? css`
								height: 369rem;
						  `
						: undefined,
				]}
			>
				<div
					css={[
						css`
							display: flex;
							align-items: center;
							height: 100%;
							max-height: 38rem;
							padding: 0rem 14rem;
							padding-right: 0rem;
						`,
						lastLogMessage
							? css`
									:hover {
										background: rgba(255, 255, 255, 0.02);
									}
							  `
							: undefined,
						clicked
							? css`
									border-bottom: 0.5px solid #242424;
									overflow: hidden;
							  `
							: undefined,
					]}
					onClick={lastLogMessage ? handleToggle : undefined}
				>
					<div
						className={"flex items-center w-full"}
					>
						{lastLogMessage ? <UpDownSizeIcon css={updownSizeIconCss} className={"updownSize-icon mr-7"} /> : ""}
						{logs && logs.get("_").length ? (<TabButton
							selected={selectedTab === TabsEnum.LOGS}
							title="Logs"
							text={logs && logs.get("_").length}
							callback={() => {
								window["openLogTime"] = performance.now();
								setClicked(true);
								handleTabSelection(TabsEnum.LOGS);
							}}
						/>) : ""}
						

						{lastLogMessage ? (
							<div css={logTextStyle} className={"ml-10 mt-2"}>
								{lastLogMessage ? getFormattedMessage(lastLogMessage) : ""}
							</div>
						) : (
							""
						)}

						<Conditional showIf={clicked}>
							<div
								css={css`
									flex: 1;
									display: flex;
									justify-content: flex-end;
									margin-right: 8rem;
								`}
							>
										
								<HoverButton onClick={handleExportLogs} title={"export logs"}>
									<ExportIcon css={css`width: 14rem; height: 14rem;`} />
								</HoverButton>
								<HoverButton
									onClick={handleToggle}
									className="flex items-center justify-center ml-2"
									css={css`
				
										border-radius: 4rem;

										:hover {
											path {
												fill: #fff;
											}
											background: #ffffff14;
										}
									`}
								>
									<MiniCrossIcon
										css={css`
											width: 10rem;
											height: 10rem;
										`}
									/>
								</HoverButton>
							</div>
						</Conditional>
					</div>

			
					<EnvironmentStatus className={"ml-auto mr-12"}/>
					<TabButton
							title="ctx"
							className={"mr-12"}
							text={"ctx"}
							css={css`span { color: #fff; padding: 4rem 8rem;  } :hover { opacity: 0.8; }`}
							callback={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if(!clicked) {
									setClicked(true);
								}
								handleTabSelection(TabsEnum.CONTEXT);
							}}
						/>
					<HoverCard content={<HelpContent onClick={stopPropagation}  />} placement="top" type="hover" padding={8} offset={0}>
						<div
							onClick={stopPropagation}
							css={docsButtonCss}
						>
							<DocsIcon css={docsIconCss} />
							<span css={docsButtonTextCss}>docs & help</span>
						</div>
					</HoverCard>
				</div>

				<Conditional showIf={clicked}>
					<Conditional showIf={selectedTab === TabsEnum.LOGS}>
						<div
							id={"logs-list"}
							css={css`
								color: #fff;
								font-size: 14rem;
								padding: 0rem 14rem;
								padding-bottom: 8rem;
								height: calc(100% - 38rem);
								overflow-y: auto;
							`}
							className={"custom-scroll"}
						>
							{logs && logs.get("_").length
								? logs.get("_").map((log: ILog, index: number) => {
									// console.log("Log time", log.time,  window["openLogTime"]/1000, log.time - (window["openLogTime"]/1000) );
									return (
										<LogItem
											diff={"0"}
											shouldShowChildren={log.time - window["openLogTime"] >= 0 && index === logs.get("_").length - 1}
											log={{ ...log, children: logs.get(log.id) }}
											key={log.id}
										/>
									);
								})
								: ""}
						</div>
					</Conditional>
					<Conditional showIf={selectedTab === TabsEnum.CONTEXT}>
						<div
							css={css`
								display: flex;
								flex-direction: column;
							`}
						>
							<div className={"px-16 mt-8"} onClick={() => {
								setSelectedTab(TabsEnum.LOGS);
							}} css={css`font-size: 14rem;  
    text-decoration-line: underline;
    color: rgba(94, 94, 94, 0.87); :hover { opacity: 0.8 }`}>Logs</div>
							<div
								css={css`
									color: #fff;
									font-size: 14rem;
									padding: 0rem 16rem;
									padding-top: 12rem;
									padding-bottom: 8rem;
									height: calc(100% - 38rem);
									overflow-y: auto;
								`}
								className={"custom-scroll"}
							>
								<ObjectInspector
									expandLevel={99}
									// nodeRenderer={defaultNodeRenderer}
									theme={{
										...chromeDark,
										...{
											OBJECT_VALUE_STRING_COLOR: "rgb(227, 110, 236)",
											OBJECT_NAME_COLOR: "white",
											TREENODE_FONT_SIZE: "13.25rem",
											TREENODE_LINE_HEIGHT: "18rem",
											BASE_BACKGROUND_COLOR: "linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #0F1010",
										},
									}}
									data={context}
								/>
							</div>
						</div>
					</Conditional>
				</Conditional>
			</div>
			<style>
				{`
			.expandBar {
				max-height: 369rem;
			}
		`}
			</style>
		</div>
	);
};


const rawMessageCss = css`
	font-size: 14rem;
	border: 1px solid #fff;
	border-radius: 4rem;
	color: #717171;
	width: fit-content;
	user-select: text;
	cursor: auto;
`;
const docsButtonCss = css`
	font-family: "Cera Pro";

	font-weight: 500;
	font-size: 12px;

	color: #ffffff;
	width: 124px;
	height: 38rem;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	border-left: 1px solid #242424;
	border-top: 0.5px solid #242424;
`;
const docsIconCss = css`
	width: 16px;
	height: 16px;
`;
const docsButtonTextCss = css`
	margin-left: 7px;
`;
const logTextStyle = css`
	color: #717171;
	font-size: 13.5rem;
`;
const logsCountStyle = css`
	padding: 3rem 5rem;
	font-family: "Cera Pro";

	font-weight: 500;
	font-size: 12px;
	text-align: center;
	color: #58575a;
	background: rgba(196, 196, 196, 0.1);
	border-radius: 4rem;
`;

const statusBarTabStyle = css`
	font-size: 14rem;
	font-family: Cera Pro;
	color: rgba(255, 255, 255, 0.7);
	display: flex;
	align-items: center;
`;
const statusBarContainerStyle = css`
	background: rgba(12, 12, 13);
	width: 100%;
	height: 38rem;
	transition: max-height 0.1s, height 0.1s;
	z-index: 999;
	margin-top: auto;
	border-top: 0.5px solid #242424;
	border-right: 0;
	border-bottom: 0;
`;

const updownSizeIconCss = css`
	width: 9.02rem;
`;

export { StatusBar };
