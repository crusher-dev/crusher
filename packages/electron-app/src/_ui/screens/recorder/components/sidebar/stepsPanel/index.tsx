import React from 'react';
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { ConsoleIcon } from 'electron-app/src/ui/icons';
import { useSelector } from "react-redux";
import { getIsStatusBarVisible, getSavedSteps } from 'electron-app/src/store/selectors/recorder';
import { Step } from './step';
import { useSelectableList } from 'electron-app/src/_ui/hooks/list';
import { OnOutsideClick } from '@dyson/components/layouts/onOutsideClick/onOutsideClick';
import { RightClickMenu } from '@dyson/components/molecules/RightClick/RightClick';
import { useStore } from "react-redux";
import { deleteRecordedSteps } from 'electron-app/src/store/actions/recorder';
import { performVerifyTest } from 'electron-app/src/ui/commands/perform';

interface IProps {
    className?: string;
}
const menuItems = [
    {id: "rename", label: "Rename", shortcut: <div>Enter</div>},
    {id: "delete", label: 'Delete', shortcut: <div>⌘+D</div>}
];
const StepsPanel = ({ className, ...props}: IProps) => {
    const { isItemSelected, selectedList, resetSelected, toggleSelectItem, selectItem, toggleSelectAll } = useSelectableList();
	const recordedSteps = useSelector(getSavedSteps);
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);
    const store = useStore();

    const toggleStatusBar = React.useCallback(() => {
        
    }, []);

    const handleStepClick = React.useCallback((stepId) => {
        toggleSelectItem(stepId);
    }, [toggleSelectItem]);

    const steps = React.useMemo(() => {
        return recordedSteps.map((step, index) => {
            return (
                <Step
                    onContextMenu={selectItem.bind(this, index)}
                    onClick={handleStepClick.bind(this, index)}
                    isActive={isItemSelected(index)}
                    setIsActive={selectItem.bind(this, index)}
                    stepId={index}
                />
            )
        })
    }, [selectedList, selectItem, handleStepClick, recordedSteps]);

    React.useEffect(() => {
		const testListContainer: any = document.querySelector("#steps-list-container");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	}, [recordedSteps.length]);


    const handleOutSideClick = React.useCallback(() => {
        // @Note: setTimeOut is here as an hack, to
        // allow selectedList to be sent to contextMenu onClick
        setTimeout(() => {
            resetSelected();
        }, 100);
    }, [resetSelected]);

    const handleMenuOpenChange = () => {}

    const handleCallback = React.useCallback((id) => {
        switch(id) {
            case "delete":
                store.dispatch(deleteRecordedSteps(selectedList));
                break;
        }
    }, [selectedList]);

    const menuItemsComponent = React.useMemo(() => {
        return menuItems.map((item) => {
            return {
                type: "menuItem",
                value: item.label,
                rightItem: item.shortcut,
                onClick: handleCallback.bind(this, item.id)
            }
        });
    }, [handleCallback]);

    React.useEffect(() => {
        const keyPressListener = function (e: Event) {
            if (e.key === "Delete") {
                store.dispatch(deleteRecordedSteps(selectedList));
                performVerifyTest(false);
            } else if (e.key === "a" && e.ctrlKey) {
                toggleSelectAll(recordedSteps.map((item, index) => index));
            }
        };
        window.addEventListener("keyup", keyPressListener, false);
        return () => {
            window.removeEventListener("keyup", keyPressListener, false);
        }
    }, [recordedSteps, selectedList]);

    return (
        <div css={containerCss} className={`${className}`}>
            <div css={headerCss}>
                <Text css={sectionHeadingCss}>{recordedSteps.length} Steps</Text>
                <div css={sectionActionsCss}>
                    <ConsoleIcon onClick={toggleStatusBar} css={[consoleIconCss, isStatusBarVisible ? consoleActiveIconCss : null]} />
                </div>
            </div>
            <OnOutsideClick className={"custom-scroll"} id={"steps-list-container"}  css={css`height: 100%; overflow-y: overlay;`} onOutsideClick={handleOutSideClick}>
                <RightClickMenu onOpenChange={handleMenuOpenChange} menuItems={menuItemsComponent}>
                    <div className={`custom-scroll`} css={contentCss}>
                            {steps}
                    </div>
                </RightClickMenu>
            </OnOutsideClick>
        </div>
    )
}

const containerCss = css`
    border-radius: 4px 4px 0px 0px;
    border-top: 0.5rem solid #141414;
    height: 369rem;
    padding-bottom: 0rem;
    display: flex;
    flex-direction: column;
`;
const headerCss = css`
    display: flex;
    align-items: center;
    padding: 14rem 18rem;
    padding-top: 19rem;
`;
const sectionHeadingCss =  css`
    font-family: Gilroy;
    font-style: normal;
    font-weight: 500;
    font-size: 12rem;
    color: #FFFFFF;
`;
const sectionActionsCss = css`
    margin-left: auto;
`;
const consoleIconCss = css`
    width: 11.7rem;
    height: 12.3rem;
    path {
        fill: rgba(255, 255, 255, 1);
    }
    :hover {
        opacity: 0.7
    };
`;
const consoleActiveIconCss = css`
    path {
        fill: rgba(255, 255, 255, 0.35);
    }
`;
const contentCss = css`
    padding-top: 0rem;
    height: 100%;
    padding-bottom: 0rem;
`;

export { StepsPanel };