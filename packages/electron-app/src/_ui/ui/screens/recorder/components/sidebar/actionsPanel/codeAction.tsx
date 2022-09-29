import React from "react";
import { performTakePageScreenshot } from "electron-app/src/_ui/commands/perform";
import { emitShowModal } from "electron-app/src/_ui/ui/containers/components/modals";
import { ActionsList } from "./actionsList";
import { getItemsFromActionsData } from "./helper";
import { CodeIcon, PageIcon } from "electron-app/src/_ui/constants/icons";
import { css } from "@emotion/react";

const actionsData = require("./actions.json");
interface IProps {
    className?: string;
    filteredList: any;
}; 

const CodeAction = ({className, filteredList, ...props}: IProps) => {
    const handleCallback = React.useCallback((id) => {
        emitShowModal({ type: "CUSTOM_CODE" });
    }, []);

    const isCodePresent = filteredList ? filteredList["CODE"] : actionsData["CODE"];
    if(!isCodePresent) return null;

    return (
        <ActionsList
            onClick={handleCallback}
            className={`${className}`}
            title={"code"}
			icon={<CodeIcon css={codeIconCss}/>}
            callback={handleCallback}
        />
    )
};

const codeIconCss = css`
	width: 10.5rem;
	height: 10.5rem;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
	path { fill: rgba(255, 255, 255, 0.8); }
`;

export { CodeAction };