import React from "react";
import { css } from "@emotion/react";
import { ActionsList, ActionsListItem } from "./actionsList";
import { performTakePageScreenshot } from "electron-app/src/ui/commands/perform";
import { emitShowModal } from "../../modals";
import { getRecorderState } from "electron-app/src/store/selectors/recorder";
import { useStore } from "react-redux";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { sendSnackBarEvent } from "../../toast";

export enum TTopLevelActionsEnum {
	VIEWPORT_SCREENSHOT = "TAKE_VIEWPORT_SCREENSHOT",
	WAIT = "WAIT",
	SHOW_SEO_MODAL = "SHOW_SEO_MODAL",
	CUSTOM_CODE = "CUSTOM_CODE",
	RUN_AFTER_TEST = "RUN_AFTER_TEST",
}

const topActionsList = [
	{
		id: TTopLevelActionsEnum.VIEWPORT_SCREENSHOT,
		title: "Take viewport screenshot",
	},
	{
		id: TTopLevelActionsEnum.WAIT,
		title: "Wait for seconds",
	},
	{
		id: TTopLevelActionsEnum.SHOW_SEO_MODAL,
		title: "Add SEO checks",
	},
	{
		id: TTopLevelActionsEnum.CUSTOM_CODE,
		title: "Custom Code",
	},
	{
		id: TTopLevelActionsEnum.RUN_AFTER_TEST,
		title: "Run after test",
	},
];

const PageActions = ({ className, ...props }: { className?: any }) => {
	const [currentModal, setCurrentModal] = React.useState(null);
	const store = useStore();

	const handleActionSelected = (id: TTopLevelActionsEnum) => {
		const recorderState = getRecorderState(store.getState());
		if (recorderState.type !== TRecorderState.RECORDING_ACTIONS) {
			sendSnackBarEvent({ type: "error", message: "A action is in progress. Wait and retry again" });
			return;
		}

		switch (id) {
			case TTopLevelActionsEnum.VIEWPORT_SCREENSHOT:
				performTakePageScreenshot();
				break;
			case TTopLevelActionsEnum.WAIT:
				emitShowModal({ type: TTopLevelActionsEnum.WAIT });
				break;
			case TTopLevelActionsEnum.SHOW_SEO_MODAL:
				emitShowModal({ type: TTopLevelActionsEnum.SHOW_SEO_MODAL });
				break;
			case TTopLevelActionsEnum.CUSTOM_CODE:
				emitShowModal({ type: TTopLevelActionsEnum.CUSTOM_CODE });
				break;
			case TTopLevelActionsEnum.RUN_AFTER_TEST:
				emitShowModal({ type: TTopLevelActionsEnum.RUN_AFTER_TEST });
				break;
			default:
				break;
		}
	};

	const items = topActionsList.map((action) => {
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
		<>
			<ActionsList className={`${className}`} css={containerStyle} title="common">
				{items}
			</ActionsList>
		</>
	);
};

const containerStyle = css``;
export { PageActions };
