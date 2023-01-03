import React, { memo } from "react";
import { css } from "@emotion/react";
import {
	getInspectElementSelectorMeta,
	getIsStatusBarVisible,
	getRecorderCrashState,
	getRecorderInfo,
	getRecorderState,
	getSavedSteps,
	getSelectedElement,
	isInspectElementSelectorModeOn,
	isInspectModeOn,
} from "electron-app/src/store/selectors/recorder";
import { useSelector, useStore } from "react-redux";
import { Conditional } from "@dyson/components/layouts";
import { IpcMessageEvent, shell } from "electron";
import {
	disableJavascriptInDebugger,
	performQuitAndRestore,
	turnOffElementSelectorInspectMode,
	turnOffInspectMode,
	turnOnInspectMode,
	turnOnWebviewDevTools,
} from "../../../../../ipc/perform";
import { setSelectedElement, updateRecordedStep, updateRecorderCrashState } from "electron-app/src/store/actions/recorder";
import { saveAutoAction } from "electron-app/src/ipc/perform";
import { TRecorderMessagesType } from "../../../../../lib/recorder/host-proxy";
import { TRecorderCrashState, TRecorderState } from "electron-app/src/store/reducers/recorder";
import { StopIcon } from "../../../../constants/old_icons";
import { Button } from "@dyson/components/atoms";

import { RightClickMenu } from "@dyson/components/molecules/RightClick/RightClick";
import { sendSnackBarEvent } from "../toast";
import { CrashErrorDialog } from "../../../screens/recorder/crashErrorDialog";
import { useAtom } from "jotai";
import { crashAtom } from "electron-app/src/_ui/store/jotai/crashAtom";
import { remote } from "electron";
import { clearToast } from "../../../components/toasts";
import { ShepherdTourContext } from "react-shepherd";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { LinkPointer } from "../../../components/LinkPointer";

const CrashScreen = () => {
	const store = useStore();

	return (
		<div
			css={css`
				width: 100%;
				height: 100%;
				background: transparent;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 998;
				background: rgba(0, 0, 0, 0.96);
				color: #fff;
				font-size: 14rem;
				display: flex;
				color: rgba(255, 255, 255, 0.57);
			`}
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 0rem 54rem;
				`}
			>
				<StopIcon
					css={css`
						width: 24rem;
						height: 24rem;
					`}
				/>
				<div
					className={"mt-18"}
					css={css`
						font-family: Cera Pro;
						color: rgba(255, 255, 255, 0.83);
						font-size: 18rem;
						font-weight: bold;
					`}
				>
					Aw, Snap!
				</div>
				<div className="mt-10">Something went wrong while displaying this page</div>
				<div className="mt-16">ERROR_CODE: RESPONSE_504_ERROR</div>

				<div
					className="mt-44"
					css={css`
						display: flex;
						align-items: center;
					`}
				>
					<Button
						onClick={performQuitAndRestore.bind(this, store)}
						bgColor="tertiary-outline"
						css={[
							buttonStyle,
							css`
								width: fit-content;
							`,
						]}
					>
						Quit & Restore Session
					</Button>
				</div>
			</div>
		</div>
	);
};

const menuItems = [
	{ id: "inspect", label: "Select element" },
	{ id: "devtools", label: "Inspect", shortcut: <div>Ctrl + Shift + I</div> },
];

const DeviceFrame = () => {
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const recorderCrashState = useSelector(getRecorderCrashState);
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);
	const ref = React.useRef<HTMLWebViewElement>(null);
	const store = useStore();
	const [, setCrash] = useAtom(crashAtom);

	const tour = React.useContext(ShepherdTourContext);

	const getPreloadScriptPath = () => {
		return `file://` + remote.app.getAppPath() + "/webview-preload.js";
	};

	React.useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener("ipc-message", (event: IpcMessageEvent) => {
				const recorderState = getRecorderState(store.getState());
				const { channel, args } = event;
				if (channel === "recorder-message" && args[0].type === TRecorderMessagesType["Commands.turnOnElementMode"]) {
					if(tour.getCurrentStep()?.id === "right-click-inspect") {
						setTimeout(() => tour.next(), 100);
					}
					const isInspectMode = isInspectModeOn(store.getState() as any);
					const isInspectElementSelectorMode = isInspectElementSelectorModeOn(store.getState() as any);
					const selectedElement = getSelectedElement(store.getState() as any);

					if (isInspectMode) {
						disableJavascriptInDebugger();
						turnOffInspectMode();
						const { selectedElementInfo } = args[0].payload;
						store.dispatch(setSelectedElement(selectedElementInfo));
					} else if (isInspectElementSelectorMode) {
						turnOffElementSelectorInspectMode();
						if (selectedElement) {
							disableJavascriptInDebugger();
						}
						const { selectedElementInfo } = args[0].payload;
						const elementSelectInspectMetaInfo = getInspectElementSelectorMeta(store.getState() as any);
						if (elementSelectInspectMetaInfo.isOn && elementSelectInspectMetaInfo.stepId) {
							const recordedSteps = getSavedSteps(store.getState() as any);
							const step = recordedSteps[elementSelectInspectMetaInfo.stepId];
							//@ts-ignore
							step.payload.selectors = selectedElementInfo.selectors;
							store.dispatch(updateRecordedStep(step as any, elementSelectInspectMetaInfo.stepId));
							window.postMessage(JSON.stringify({ type: "selected-element-for-selectors", selectedElementInfo }));
							sendSnackBarEvent({ type: "success", message: "Selectors updated" });
						}
					}
				}
				if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) return;

				if (channel === "recorder-message") {
					console.log("Event of message recieved", event);
					const { type, payload } = args[0];
					switch (type) {
						case TRecorderMessagesType["Commands.recordAction"]:
							if(tour.getCurrentStep()?.id === "click-on-blue-button") {
								if(payload.action.type === ActionsInTestEnum.CLICK) {
									tour.next();
									document.querySelector("#highlight-current")?.remove();
									setTimeout(() => {
										saveAutoAction(payload.action, store);
									}, 250);
									break;
								}
							}
							saveAutoAction(payload.action, store);
							break;
						case TRecorderMessagesType["Commands.turnOnInspectMode"]:
							turnOnInspectMode();
							break;
						case TRecorderMessagesType["Commands.turnOffInspectMode"]:
							turnOffInspectMode();
							break;
					}
				}
			});
		}
	}, [ref.current]);

	const handleMenuCallback = React.useCallback((id) => {
		if (id === "devtools") {
			turnOnWebviewDevTools();
		} else if (id === "inspect") {
			turnOnInspectMode();
		}
	}, []);
	const menuItemsComponent = React.useMemo(() => {
		return menuItems.map((item) => {
			return {
				type: "menuItem",
				value: item.label,
				rightItem: item.shortcut,
				onClick: handleMenuCallback.bind(this, item.id),
			};
		});
	}, []);

	const isPageFailedCrash = recorderCrashState && recorderCrashState.type === TRecorderCrashState.PAGE_LOAD_FAILED;

	React.useEffect(() => {
		// if (isPageFailedCrash) {
		// 	setCrash("PAGE_LOAD_FAILED");
		// }
	}, [isPageFailedCrash]);
	// Only when code is shown
	return (
		<div css={[topContainerStyle]}>
			<RightClickMenu menuItems={menuItemsComponent}>
				<div
					css={[
						containerStyle(isStatusBarVisible),
						!recorderInfo.device
							? css`
									background: #070708;
							  `
							: undefined,
					]}
				>
					
					{ !recorderInfo.device ? (
					<div className="flex flex-col items-center" css={css`margin-left: 80px; color: #d2d2d2;`}>
						<div className="text-14 font-500 tracking-wide">
							New to crusher?
						</div>
						<LinkPointer className="text-14 font-500 tracking-wide mt-12 underline">
							Start 2-min onboarding
						</LinkPointer>
						<LinkPointer
						onClick={()=>{
							shell.openExternal("https://docs.crusher.dev")
						}}
						className="text-14 font-500 tracking-wide mt-12 underline">
							or read docs
						</LinkPointer>
					</div>) : null }
					{recorderInfo.device && (
						<div
							style={{
								aspectRatio: `${recorderInfo.device?.width} / ${recorderInfo.device?.height}`,
								maxWidth: `${recorderInfo.device?.width}rem`,
								width: "99%",
								maxHeight: "100%",
								position: "relative",
								borderRadius: "12rem",
								overflow: "hidden"
							}}
						>
							<webview
								ref={ref}
								css={webviewStyle}
								id="device_browser"
								preload={getPreloadScriptPath()}
								title={"crusher-webview"}
								src={"about:blank"}
								partition={"crusherwebview"}
								webpreferences="nativeWindowOpen=yes, contextIsolation=true, sandbox=true"
								allowpopups
								nodeintegration={true}
							/>

							<Conditional showIf={recorderCrashState && recorderCrashState.type === TRecorderCrashState.CRASHED}>
								<CrashScreen />
							</Conditional>
							<CrashErrorDialog />

							<Conditional showIf={[TRecorderState.PERFORMING_ACTIONS, TRecorderState.PERFORMING_RECORDER_ACTIONS].includes(recorderState.type)}>
								<div css={deviceOverlayStyle}></div>
							</Conditional>
						</div>
					)}
				</div>
			</RightClickMenu>
		</div>
	);
};

const buttonStyle = css`
	font-size: 14rem;
	box-sizing: border-box;
	border-radius: 6rem;
	width: 112rem;
	height: 30rem;
`;
const deviceOverlayStyle = css`
	width: 100%;
	height: 100%;
	background: transparent;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 998;
`;

const webviewStyle = css`
	border: none;
	display: inline-flex;
	max-width: 100%;
	width: 100%;
	height: 100%;
	background: #fff;
	opacity: 0.8;
`;
const topContainerStyle = css`
	position: relative;
	overflow: hidden;
	flex: 1;
`;
const containerStyle = (isStatusBarVisible) => css`
	width: 100%;
	height: ${isStatusBarVisible ? "calc(100% - 30rem)" : "100%"};
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	flex: 1;
`;

export { DeviceFrame };

DeviceFrame.whyDidYouRender = true;
export default memo(DeviceFrame);
