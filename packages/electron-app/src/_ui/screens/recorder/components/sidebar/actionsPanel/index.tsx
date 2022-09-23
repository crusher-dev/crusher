import React from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getSelectedElement, isInspectElementSelectorModeOn, isInspectModeOn as _isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { InputFocusHint } from "electron-app/src/_ui/components/inputs/inputFocusHint";
import { InspectModeBanner } from "../inspectModeBanner";
import { ElementActions } from "./elementActions";
import { PageActions } from "./pageActions";
import { CodeAction } from "./codeAction";

interface IProps {
    className?: string;
};

const ActionsPanel = ({className, ...props}: IProps) => {
    const isInspectModeOn = useSelector(_isInspectModeOn);
    const isElementSelectorInspectModeOn = useSelector(isInspectElementSelectorModeOn);

    const selectedElement = useSelector(getSelectedElement);
    const content = React.useMemo(() => {
            return (<>
                <PageActions defaultExpanded={true} css={topBorderCss} />
                <ElementActions />
                <CodeAction/>
            </>)
    }, []);

    return (
        <div className={`${className}`} css={containerCss}>
            <div css={headerCss}>
                <InputFocusHint hint={"⌘ + k"} placeholder={"search actions"}/>
            </div>
            <div css={contentCss} className="custom-scroll">
                {isInspectModeOn || isElementSelectorInspectModeOn ? (
                    <InspectModeBanner/>
                ) : content}
            </div>
        </div>
    );
};


const topBorderCss = css`
    border-top-width: 0.5px;
    border-top-style: solid;
    border-top-color: #1B1B1B;
`;
const containerCss = css`
	flex: 1;
	display: grid;
	overflow: hidden;
	grid-template-rows: 60rem;
`;
const headerCss = css`
	display: flex;
	align-items: center;
	padding: 0rem 14rem;
	justify-content: space-between;
`;

const contentCss = css`
	height: 100%;
	padding-top: 10rem;
	overflow-y: auto;
`;

export { ActionsPanel };