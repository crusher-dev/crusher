import { ILog, ILoggerReducer } from "electron-app/src/store/reducers/logger";
import React from "react";
import { useSelector, useStore } from "react-redux";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { getLogs } from "electron-app/src/store/selectors/logger";
import { MiniCrossIcon, PlayIconV2, UpMaximiseIcon } from "../../icons";
import { ObjectInspector, TableInspector, chromeDark, ObjectRootLabel, ObjectLabel } from "react-inspector";
import { BrowserButton } from "../buttons/browser.button";
import { CustomCodeModal } from "../modals/page/customCodeModal";
import { modalEmitter } from "../modals";
import { TElementActionsEnum } from "../sidebar/actionsPanel/elementActions";
import { TTopLevelActionsEnum } from "../sidebar/actionsPanel/pageActions";
import { getRecorderState, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { updateRecorderState } from "electron-app/src/store/actions/recorder";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { now } from "electron-app/src/main-process/now";

function formatLogs(logs: Array<ILoggerReducer["logs"][0]>): Array<ILoggerReducer["logs"][0]> {
	logs = logs.map((log, index) => {
		return { ...log, diff: index == 0 ? "0" : (log.time - logs[index - 1].time).toFixed(2) };
	});
	const noParentLogs = logs.filter((log: ILoggerReducer["logs"][0]) => !log.parent);
	return noParentLogs.map((log) => {
		return { ...log, children: logs.filter((_log: ILoggerReducer["logs"][0]) => _log.parent === log.id) };
	});
}

interface ITabButtonProps {
	title: string;
	selected: boolean;
	count?: number;
	className?: string;
	callback?: any;
}
const TabButton = (props: ITabButtonProps) => {
	const { title, className, selected, callback, count } = props;

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
			<UpMaximiseIcon
				css={css`
					width: 10rem;
					height: 12rem;
					margin-left: auto;
					:hover {
						opacity: 0.7;
					}
				`}
			/>
			<span
				css={css`
					margin-left: 8rem;
				`}
			>
				{title}
			</span>
			<div>
				<Conditional showIf={count != null}>
					<span className="ml-4" css={logsCountStyle}>
						{count}
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

const FIGMA_SAMPLE_CONTEXT = {
	string: "this is a test ...",
	integer: 42,
	array: [1, 2, 3, "test", null],
	float: 3.141592653589793,
	undefined: undefined,
	object: {
		"first-child": true,
		"second-child": false,
		"last-child": null,
	},
	string_number: "1234",
};

const defaultNodeRenderer = ({ depth, name, data, isNonenumerable, expanded }) =>
	depth === 0 ? <ObjectRootLabel name={name} data={data} /> : <ObjectLabel name={name} data={data} isNonenumerable={isNonenumerable} />;


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
	  
const StatusBar = (props: any) => {
	const [currentModal, setCurrentModal] = React.useState({ type: null, stepIndex: null });
	const store = useStore();

	const [clicked, setClicked] = React.useState(false);
	const [selectedTab, setSelectedTab] = React.useState(TabsEnum.LOGS);
	const logsScrollRef: React.Ref<HTMLDivElement> = React.useRef(null);
	const logs: ILoggerReducer["logs"] = useSelector(getLogs);

	React.useEffect(() => {
		if(clicked && window["resizeCustomCode"]) {
			setTimeout(() => window["resizeCustomCode"](), 150);
		}
	}, [clicked]);
	React.useEffect(() => {
		modalEmitter.on("show-modal", ({ type, stepIndex }: { type: TElementActionsEnum | TTopLevelActionsEnum; stepIndex?: number }) => {
			if (type === TTopLevelActionsEnum.CUSTOM_CODE) {
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

	const closeModal = (isDocking: boolean = false) => {
		const recorderState = getRecorderState(store.getState());
		setCurrentModal({ type: null, stepIndex: null });
		window["openLogTime"] = performance.now();
	};

	React.useEffect(() => {
		if (logs && logs.get("_").length > 0) {
			const listContainer: any = document.querySelector("#logs-list");
			if (listContainer) {
				const elementHeight = listContainer.scrollHeight;
				listContainer.scrollBy(0, elementHeight);
			}
		}
	}, [logs]);

	const LogItem = (props: {
		log: ILog & { children: Array<ILog>; diff: string };
		diff: string;
		className?: string;
		shouldShowChildren;
	}) => {
		const { log, shouldShowChildren } = props;
		const [showChildrens, setShowChildrens] = React.useState(shouldShowChildren);

		const hasChildrens = React.useMemo(() => (log.children && log.children.length), [log]);

		return (
			<div className={`${props.className}`}>
				<div
					css={css`
						padding-top: 16rem;
						display: flex;
					`}
				>
					{hasChildrens ? (
							<ArrowRightIcon onClick={setShowChildrens.bind(this, !showChildrens)} css={[css`width: 8rem; fill: #797979; margin-right: 4rem; :hover { opacity: 0.8 }`, showChildrens ? css`transform: rotate(90deg)` : undefined]}/>
					) : "" }
					<div>
						<span
							css={css`
								font-size: 14rem;
								color: ${log.type === "error" ? "#C2607D" : "#9FC370"};
								font-family: Gilroy;
							`}
						>
							{log.type}
						</span>
						<span
							css={css`
								font-size: 14rem;
								color: #717171;
								font-family: Gilroy;
								word-break: break-all;
							`}
							className={"ml-20"}
						>
							{log.message}
						</span>
					</div>
					{/* <div
						css={css`
							margin-left: auto;
						`}
					>
						<span
							css={css`
								color: #525252;
								font-size: 12.5rem;
								font-family: Gilroy;
							`}
						>
							+{props.diff} ms
						</span>
					</div> */}
				</div>
					{showChildrens && log.children && log.children.length ? 
						log.children.map((child: ILog & { children: Array<ILog>; diff: string }) => {
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
						}) : ""}
			</div>
		);
	};

	const handleTabSelection = (tabType: TabsEnum) => {
		setSelectedTab(tabType);
	};

	const handleMaximiseClick = () => {
		setClicked(true);
	};

	const lastLogMessage = logs && logs.get("_").length ? logs.get("_")[logs.get("_").length - 1].message : "";
	const stepAction = React.useMemo(() => {
		if (currentModal && typeof currentModal.stepIndex !== "undefined") {
			const savedSteps = getSavedSteps(store.getState() as any);
			return savedSteps[currentModal.stepIndex];
		}
		return null;
	}, [currentModal]);

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
				currentModal && currentModal.type === TTopLevelActionsEnum.CUSTOM_CODE
					? css`
							height: 100%;
					  `
					: undefined,
			]}
		>
			{currentModal && currentModal.type === TTopLevelActionsEnum.CUSTOM_CODE ? (
				<div
					css={css`
						flex: 1;
						height: 100%;
						width: 100%;
						display: flex;
						flex-direction: column;
						overflow: hidden;
						z-index: 23424234;
					`}
				>
					<CustomCodeModal
						stepAction={stepAction as any}
						stepIndex={currentModal.stepIndex}
						isOpen={currentModal.type === TTopLevelActionsEnum.CUSTOM_CODE}
						handleClose={closeModal}
					/>
					{/* <div css={css`height: 100%; width: 100%; background :red;`}></div> */}
				</div>
			) : (
				""
			)}
			<div
				id={`logsTab`}
				className={`${clicked ? "expandBar" : ""}`}
				css={[
					statusBarContainerStyle,
					clicked
						? css`
								height: 341rem;
						  `
						: undefined,
				]}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						height: 100%;
						max-height: 32rem;
						padding: 0rem 14rem;
						:hover {
							background: #1d1e1f;
						}
					`}
				>
					<TabButton
						selected={selectedTab === TabsEnum.LOGS}
						title="Logs"
						count={logs && logs.get("_").length}
						callback={() => {
							window["openLogTime"] = performance.now();
							setClicked(true);
							handleTabSelection(TabsEnum.LOGS);
						}}
					/>

					<Conditional showIf={!clicked}>
						<div css={logTextStyle} className={"ml-20"}>
							{lastLogMessage.length > 100 ? lastLogMessage.substr(0, 100) + "..." : lastLogMessage}
						</div>
					</Conditional>

					<Conditional showIf={clicked}>
						<div
							css={css`
								margin-left: auto;
							`}
						>
							<div
								onClick={setClicked.bind(this, !clicked)}
								css={css`
									padding: 4rem 5rem;
									:hover {
										svg {
											opacity: 0.7;
										}
										background: rgba(0, 0, 0, 0.2);
										opacity: 0.8;
									}
								`}
							>
								<MiniCrossIcon
									css={css`
										width: 10rem;
										height: 10rem;
										opacity: 0.44;
									`}
								/>
							</div>
						</div>
					</Conditional>
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
								height: calc(100% - 32rem);
								overflow-y: auto;
							`}
							className={"custom-scroll"}
						>
							{logs && logs.get("_").length
								? logs.get("_").map((log: ILog, index: number) => {
									// console.log("Log time", log.time,  window["openLogTime"]/1000, log.time - (window["openLogTime"]/1000) );
										return <LogItem diff={"0"} shouldShowChildren={log.time - (window["openLogTime"]) >= 0 && index == logs.get("_").length -1} log={{...log, children: logs.get(log.id)}} key={log.id} />;
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
							<div
								css={css`
									color: #fff;
									font-size: 14rem;
									padding: 0rem 16rem;
									padding-top: 12rem;
									padding-bottom: 8rem;
									height: calc(100% - 32rem);
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
											// OBJECT_VALUE_NUMBER_COLOR: "#47ad43",
											OBJECT_VALUE_STRING_COLOR: "rgb(227, 110, 236)",
											OBJECT_NAME_COLOR: "white",
											// OBJECT_VALUE_BOOLEAN_COLOR: "#f5be18",
											// OBJECT_VALUE_NULL_STYLE: {
											// 	background: "#303030",
											// 	color: "#f5be18",
											// 	textTransform: "uppercase",
											// 	fontWeight: "bold",
											// 	padding: "0.5rem 2rem",
											// },
											// ARROW_COLOR: '#499ffa',
											TREENODE_FONT_SIZE: "13.25rem",
											TREENODE_LINE_HEIGHT: "18rem",
											BASE_BACKGROUND_COLOR: "linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #0F1010",
										},
									}}
									data={SAMPLE_CONTEXT}
								/>
							</div>
							<BrowserButton
								size={"x-small"}
								css={css`
									background: #8860de;
									margin-right: 18rem;
									padding: 0rem 16rem;
									border: 0.5px solid #8860de;
									margin-left: auto;
								`}
							>
								Re-Run with custom context
							</BrowserButton>
						</div>
					</Conditional>
				</Conditional>
			</div>

			<style>
				{`
			.expandBar {
				max-height: 341rem;
			}
		`}
			</style>
		</div>
	);
};

const logTextStyle = css`
	color: #717171;
	font-size: 13.5rem;
	font-family: Gilroy;
`;
const logsCountStyle = css`
	background: rgba(196, 196, 196, 0.1);
	border-radius: 6rem;
	font-size: 12rem;
	font-family: Cera Pro;
	color: rgba(255, 255, 255, 0.7);
	padding: 4rem 6rem;
`;

const statusBarTabStyle = css`
	font-size: 14rem;
	font-family: Cera Pro;
	color: rgba(255, 255, 255, 0.7);
	display: flex;
	align-items: center;
	:hover {
		opacity: 0.8;
	}
`;
const statusBarContainerStyle = css`
	background: #0f1010;
	border: 1px solid #272d2d;
	border-left: 0;
	border-right: 0;
	width: 100%;
	height: 32rem;
	transition: max-height 0.1s, height 0.1s;
	z-index: 999;
	margin-top: auto;
`;

export { StatusBar };
