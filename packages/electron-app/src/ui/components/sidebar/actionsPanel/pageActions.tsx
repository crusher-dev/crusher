import React from "react";
import {css} from "@emotion/react";
import { ActionsList, ActionsListItem } from "./actionsList";

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

    const handleActionSelected = (id: TTopLevelActionsEnum) => {
        alert("Selected this, " + id);
    };

	const items = topActionsList.map((action) => {
		return <ActionsListItem key={action.id} onClick={handleActionSelected.bind(this, action.id)}>{action.title}</ActionsListItem>;
	});


    return (
        <ActionsList className={`${className}`} css={containerStyle} title="Page List">{items}</ActionsList>
    )
};

const containerStyle = css``
;
export { PageActions };