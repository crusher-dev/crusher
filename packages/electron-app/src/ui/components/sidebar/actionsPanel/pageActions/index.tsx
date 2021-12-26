import React from "react";
import {css} from "@emotion/react";
import { ActionsList, ActionsListItem } from "../actionsList";
import { performTakePageScreenshot } from "electron-app/src/ui/commands/perform";
import { WaitModal } from "./waitModal";
import { RunAfterTestModal } from "./runAfterTestModal";
import { CustomCodeModal } from "./customCodeModal";

enum TTopLevelActionsEnum {
    VIEWPORT_SCREENSHOT = "TAKE_VIEWPORT_SCREENSHOT",
    WAIT = "WAIT",
    SHOW_SEO_MODAL = "SHOW_SEO_MODAL",
    CUSTOM_CODE = "CUSTOM_CODE",
    RUN_AFTER_TEST = "RUN_AFTER_TEST"
};

const topActionsList = [
	{
		id: TTopLevelActionsEnum.VIEWPORT_SCREENSHOT,
		title: "Take viewport screenshot"
	},
	{
		id: TTopLevelActionsEnum.WAIT,
		title: "Wait for seconds"
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

const PageActions = ({className, ...props}: {className?: any}) => {
	const [currentModal, setCurrentModal] = React.useState(null);

    const handleActionSelected = (id: TTopLevelActionsEnum) => {
        switch(id) {
			case TTopLevelActionsEnum.VIEWPORT_SCREENSHOT:
				performTakePageScreenshot();
				break;
			case TTopLevelActionsEnum.WAIT:
				setCurrentModal(TTopLevelActionsEnum.WAIT);
				break;
			case TTopLevelActionsEnum.SHOW_SEO_MODAL:
				setCurrentModal(TTopLevelActionsEnum.SHOW_SEO_MODAL);
				break;
			case TTopLevelActionsEnum.CUSTOM_CODE:
				setCurrentModal(TTopLevelActionsEnum.CUSTOM_CODE);
				break;
			case TTopLevelActionsEnum.RUN_AFTER_TEST:
				setCurrentModal(TTopLevelActionsEnum.RUN_AFTER_TEST);
				break;
			default:
				break;
		}
    };

	const items = topActionsList.map((action) => {
		return <ActionsListItem key={action.id} onClick={handleActionSelected.bind(this, action.id)}>{action.title}</ActionsListItem>;
	});

	const closeModal = (completed?: boolean) => {
		setCurrentModal(null);
	}


    return (
		<>
        	<ActionsList className={`${className}`} css={containerStyle} title="Page List">{items}</ActionsList>
			<WaitModal isOpen={currentModal === TTopLevelActionsEnum.WAIT} handleClose={closeModal} />
			<RunAfterTestModal isOpen={currentModal === TTopLevelActionsEnum.RUN_AFTER_TEST} handleClose={closeModal} />
			<CustomCodeModal isOpen={currentModal === TTopLevelActionsEnum.CUSTOM_CODE} handleClose={closeModal} />
		</>
    )
};

const containerStyle = css``
;
export { PageActions };