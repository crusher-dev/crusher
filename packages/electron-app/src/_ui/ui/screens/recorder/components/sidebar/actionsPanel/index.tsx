import React from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getSelectedElement, isInspectElementSelectorModeOn, isInspectModeOn as _isInspectModeOn } from "electron-app/src/store/selectors/recorder";
import { InputFocusHint } from "electron-app/src/_ui/ui/components/inputs/inputFocusHint";
import { InspectModeBanner } from "../inspectModeBanner";
import { ElementActions } from "./elementActions";
import { PageActions } from "./pageActions";
import { CodeAction } from "./codeAction";
import { GoBackIcon, InfoIcon, ResetIcon } from "electron-app/src/_ui/constants/icons";
import { enableJavascriptInDebugger, performVerifyTest } from "electron-app/src/_ui/commands/perform";
import { setSelectedElement } from "electron-app/src/store/actions/recorder";
import { useStore } from "react-redux";
import { filterActionsItems } from "./helper";

interface IProps {
    className?: string;
};

const ActionsPanel = ({className, ...props}: IProps) => {
    const [searchFilter, setSearchFilter] = React.useState(null);

    const isInspectModeOn = useSelector(_isInspectModeOn);
    const isElementSelectorInspectModeOn = useSelector(isInspectElementSelectorModeOn);
    const store = useStore();

    const selectedElement = useSelector(getSelectedElement);
    const turnOffElementMode = React.useCallback(async () => {
        await enableJavascriptInDebugger();
        store.dispatch(setSelectedElement(null));
    }, []);
    const content = React.useMemo(() => {
        const filteredList = searchFilter?.length ? filterActionsItems(searchFilter) : null;

            if(selectedElement) {
                return (<>
                        <div className={"ml-16 mb-18"} css={elementSelectedInfoCss}>
                            <div onClick={turnOffElementMode} className={"flex items-center"}>
                                <GoBackIcon css={goBackIconCss}/>
                                <span className={"ml-7"} css={goBackCss}>go back</span>
                            </div>
                            <div className={"flex items-center mt-7 pl-17"}>
                                <span css={elementSelectedTextCss}>Element selected, choose an action</span>
                                <InfoIcon className={"ml-auto mr-22"} css={infoIconCss}/>
                            </div>
                        </div>
                        <ElementActions filteredList={filteredList} defaultExpanded={true} css={[topBorderCss, focusedListCss]}/>
                    </>
                )
            }

            return (<>
                <PageActions filteredList={filteredList} defaultExpanded={searchFilter || true} css={topBorderCss} />
                <ElementActions filteredList={filteredList} defaultExpanded={searchFilter || true} />
                <CodeAction filteredList={filteredList}/>
            </>)
    }, [searchFilter, selectedElement]);

    const handleOnChange = (event) => {
        setSearchFilter(event.target.value);
    };
    const handleResetTest = () => performVerifyTest(false);
    return (
        <div className={`${className}`} css={containerCss}>
            <div css={headerCss}>
                <InputFocusHint onChange={handleOnChange} hint={`⌘ + k`} placeholder={"search actions"}/>
                <ResetIcon onClick={handleResetTest} css={[resetIconCss]}/>
            </div>
            <div css={contentCss} className="custom-scroll">
                {isInspectModeOn || isElementSelectorInspectModeOn ? (
                    <InspectModeBanner/>
                ) : content}
            </div>
        </div>
    );
};

const goBackCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12rem;

    letter-spacing: 0.02em;

    color: #ADADAD;
`;
const goBackIconCss = css`
    width: 10rem;
`;
const elementSelectedTextCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 14rem;


    color: rgba(255, 255, 255, 0.79);
`;
const infoIconCss = css`
    width: 12.75rem;
    height: 12.75rem;
    :hover {
        opacity: 0.8;
    }
`;
const elementSelectedInfoCss = css``;
const focusedListCss = css`
    .action-item-header {
        background: rgba(214, 98, 255, 0.056);
        border-width: 0.5px 0px;
        border-style: solid;
        border-color: #D662FF;
    }
`;
const resetIconCss  = css`
    width: 13rem;
    height: 13rem;
    margin-left: 12rem;
    :hover {
        opacity: 0.8;
    }
`;
const topBorderCss = css`
    border-top-width: 0.5px;
    border-top-style: solid;
    border-top-color: #1B1B1B;
`;
const containerCss = css`
	flex: 1;
	overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-top: 18rem;
`;
const headerCss = css`
	display: flex;
	align-items: center;
	padding: 0rem 14rem;
`;

const contentCss = css`
	height: 100%;
    padding-top: 16rem;
    overflow-y: auto;
`;

export { ActionsPanel };