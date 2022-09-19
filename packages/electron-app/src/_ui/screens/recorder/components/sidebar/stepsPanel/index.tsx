import React from 'react';
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { ConsoleIcon } from 'electron-app/src/ui/icons';
import { useSelector } from "react-redux";
import { getIsStatusBarVisible, getSavedSteps } from 'electron-app/src/store/selectors/recorder';
import { Step } from './step';

interface IProps {
    className?: string;
}

const StepsPanel = ({ className, ...props}: IProps) => {
	const recordedSteps = useSelector(getSavedSteps);
	const isStatusBarVisible = useSelector(getIsStatusBarVisible);

    const toggleStatusBar = React.useCallback(() => {
        
    }, []);
    const steps = React.useMemo(() => {
        return recordedSteps.map((step, index) => {
            return (
                <Step
                    stepId={index}
                />
            )
        })
    }, [recordedSteps]);

    React.useEffect(() => {
		const testListContainer: any = document.querySelector("#steps-list-container");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	}, [recordedSteps.length]);

    return (
        <div css={containerCss} className={`${className}`}>
            <div css={headerCss}>
                <Text css={sectionHeadingCss}>{recordedSteps.length} Steps</Text>
                <div css={sectionActionsCss}>
                    <ConsoleIcon onClick={toggleStatusBar} css={[consoleIconCss, isStatusBarVisible ? consoleActiveIconCss : null]} />
                </div>
            </div>
            <div id={"steps-list-container"} className={`custom-scroll`} css={contentCss}>
                    {steps}
            </div>
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
    overflow-y: overlay;
    padding-top: 0rem;
    height: 100%;
    padding-bottom: 0rem;
`;

export { StepsPanel };