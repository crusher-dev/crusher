import React from "react";
import { css } from "@emotion/react";
import { ActionsList, ActionsListItem } from "./actionsList";
import { Text } from "@dyson/components/atoms/text/Text";
import { useSelector, useStore } from "react-redux";
import { getRecorderState, getSelectedElement } from "electron-app/src/store/selectors/recorder";
import {
	enableJavascriptInDebugger,
	peformTakeElementScreenshot,
	performAssertElementVisibility,
	performClick,
	performHover,
	turnOffInspectMode,
} from "electron-app/src/ui/commands/perform";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { useTour } from "@reactour/tour";
import { emitShowModal } from "../../modals";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { sendSnackBarEvent } from "../../toast";

export enum TElementActionsEnum {
	CLICK = "CLICK",
	HOVER = "HOVER",
	SCREENSHOT = "SCREENSHOT",
	SHOW_ASSERT_MODAL = "SHOW_ASSERT_MODAL",
	SHOW_CUSTOM_SCRIPT_MODAL = "SHOW_CUSTOM_SCRIPT_MODAL",
	ASSERT_VISIBILITY = "ASSERT_VISIBILITY",
}

const elementActionsList = [
	{
		id: TElementActionsEnum.CLICK,
		title: "Click",
	},
	{
		id: TElementActionsEnum.HOVER,
		title: "Hover",
	},
	{
		id: TElementActionsEnum.SCREENSHOT,
		title: "Screenshot",
	},
	{
		id: TElementActionsEnum.SHOW_ASSERT_MODAL,
		title: "Add Checks",
	},
	{
		id: TElementActionsEnum.ASSERT_VISIBILITY,
		title: "Assert visibility",
	},
	// {
	// 	id: TElementActionsEnum.SHOW_CUSTOM_SCRIPT_MODAL,
	// 	title: "Code",
	// },
];

const ElementActions = ({ className, ...props }: { className?: any }) => {
	const selectedElement = useSelector(getSelectedElement);
	const store = useStore();

	const { isOpen, setCurrentStep } = useTour();

	const handleActionSelected = async (id: TElementActionsEnum) => {
		const recorderState = getRecorderState(store.getState());
		if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) {
			sendSnackBarEvent({ type: "error", message: "A action is in progress. Wait and retry again" });
			return;
		}

		if ([TElementActionsEnum.CLICK, TElementActionsEnum.HOVER, TElementActionsEnum.SCREENSHOT].includes(id)) {
			if (isOpen) {
				setCurrentStep(5);
			}
		}
		switch (id) {
			case TElementActionsEnum.CLICK:
				await enableJavascriptInDebugger();
				performClick(selectedElement);
				store.dispatch(setSelectedElement(null));
				break;
			case TElementActionsEnum.HOVER:
				await enableJavascriptInDebugger();
				performHover(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
			case TElementActionsEnum.SCREENSHOT:
				await enableJavascriptInDebugger();
				peformTakeElementScreenshot(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
			case TElementActionsEnum.SHOW_ASSERT_MODAL:
				emitShowModal({ type: TElementActionsEnum.SHOW_ASSERT_MODAL });
				setCurrentStep(4);
				break;
			case TElementActionsEnum.SHOW_CUSTOM_SCRIPT_MODAL:
				emitShowModal({ type: TElementActionsEnum.SHOW_ASSERT_MODAL });
				setCurrentStep(4);
				break;
			case TElementActionsEnum.ASSERT_VISIBILITY:
				await enableJavascriptInDebugger();
				performAssertElementVisibility(selectedElement, store);
				store.dispatch(setSelectedElement(null));
				break;
		}
	};

	const items = elementActionsList
		.filter((e) => ![TElementActionsEnum.CLICK, TElementActionsEnum.HOVER].includes(e.id))
		.map((action) => {
			return (
				<ActionsListItem key={action.id} onClick={handleActionSelected.bind(this, action.id)}>
					{action.title}
				</ActionsListItem>
			);
		});

	const closeModal = (completed?: boolean) => {
		setCurrentModal(null);
	};

	return (
		<ActionsList id={"element-actions-list"} className={`${className}`} css={containerStyle}>
			<div css={actionTabStyle}>
				<Text css={[clickActionStyle, hoverTextStyle]} onClick={handleActionSelected.bind(this, TElementActionsEnum.CLICK)}>
					Click
				</Text>
				<Text css={hoverTextStyle} onClick={handleActionSelected.bind(this, TElementActionsEnum.HOVER)}>
					Hover
				</Text>
			</div>
			<>
				{items.map((child, index) =>
					React.cloneElement(child, {
						style: { ...child.props.style, borderBottom: index < (items as any).length - 1 ? "1rem solid #323636" : "none" },
					}),
				)}
			</>
		</ActionsList>
	);
};

const containerStyle = css``;
const actionTabStyle = css`
	display: flex;
	justify-content: stretch;
`;

const clickActionStyle = css`
	border-right-style: solid;
	border-right-color: #323636;
	border-right-width: 1rem;
`;

const hoverTextStyle = css`
	padding: 8rem 4rem;
	font-family: Gilroy;
	font-size: 13rem;
	text-align: center;
	flex: 1;

	:hover {
		background-color: #32363678;
	}
`;

export { ElementActions };
