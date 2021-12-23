import { css } from "@emotion/react";
import { MouseIcon } from "electron-app/src/ui/icons";
import React from "react";
import { ActionsList, ActionsListItem } from "./actionsList";

const InspectModeAction = ({className, ...prosp} : any) => {
	const turnOnInspectMode = ()=>{
        alert("Turning on inspect mode now");
    };

    return (
        <ActionsList className={`${className}`}>
            <ActionsListItem onClick={turnOnInspectMode}>
                <div css={actionItemContainerStyle}>
                    <span>Select an element</span>
                    <MouseIcon css={mouseIconStyle}/>
                </div>
            </ActionsListItem>
        </ActionsList>
    )
};

const actionItemContainerStyle = css`
    display: flex;
    padding: 0rem 4rem;
    align-items: center;
`;

const mouseIconStyle = css`
    margin-left: auto;
    width: 12rem;
`;

export { InspectModeAction };