import React from "react";
import { css } from "@emotion/react";
import { Text } from "@dyson/components/atoms/text/Text";
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip";
import { Button } from "@dyson/components/atoms";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";
import { getRecorderState, getSavedSteps, getStepInfo } from "electron-app/src/store/selectors/recorder";
import { continueRemainingSteps } from "electron-app/src/ui/commands/perform";
import { useStore, useSelector } from "react-redux";
import { ActionStatusEnum } from "@shared/types/action";
import { GreenCheckboxIcon, LoadingIcon, PointerArrowIcon, WarningIcon } from "electron-app/src/ui/icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { RightClickMenu } from "@dyson/components/molecules/RightClick/RightClick";
import { TextHighlighter } from "./helper";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";
import { HelpContent } from "electron-app/src/_ui/components/stickyFooter";
import { StepInfoEditor } from "electron-app/src/ui/components/sidebar/stepEditor";
import { StepEditor } from "./stepEditor";

interface IProps {
    className?: string;
    stepId?: string;
    isActive: boolean;
    setIsActive: any;
    onClick?: any;
    onContextMenu?: any;
    isLast: boolean;

    step?: any;
};

const menuItems = [
    {id: "rename", label: "Rename", shortcut: <div>Enter</div>},
    {id: "delete", label: 'Delete', shortcut: <div>⌘+D</div>}
];


const Step = ({className, isActive, onContextMenu, step, onClick, setIsActive, isLast, ...props}: IProps) => {
    const { stepId } = props;
    const [isEditorCardOpen, setIsEditorCardOpen] = React.useState(false);
    const stepInfo = useSelector(getStepInfo(stepId));
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const store = useStore();

    const handleMenuOpenChange = React.useCallback((isOpen) => {
        setIsActive(isOpen);
    }, [setIsActive]);

    const title = TextHighlighter({text: stepInfo.name});
    
    return (
        <HoverCard callback={setIsEditorCardOpen.bind(this)} wrapperCss={css`z-index: 123123123 !important;`} css={css`padding: 0rem !important; background: rgb(5, 5, 5) !important; margin-left: -22rem !important; overflow: hidden !important;`} content={<StepEditor stepId={stepId} />} placement="right" type="hover" padding={8} offset={0}>
            <div onContextMenu={onContextMenu} onClick={onClick} css={[containerCss, isActive  || isEditorCardOpen ? activeItemCss : null]}>
                    <div className={"card"} css={contentCss}>
                        {stepInfo.isRunning ? (
                            <PointerArrowIcon css={runningPointerIconCss}/>
                        ) : ""}
                        <div css={stepTextCss}>
                            <TextBlock
                                css={[
                                    stepNameCss,
                                    stepInfo.isFailed ? failedTextNameCss : null,
                                    stepInfo.isRunning ? runningTextNameCss : null
                            ]}>
                                {title}
                            </TextBlock>
                            <TextBlock css={stepDescriptionCss}>{stepInfo.description}</TextBlock>
                        </div>
                        {stepInfo.isRunning ? (
                            <LoadingIcon style={{}} css={runningIconCss}/>
                        ) : ""}
                        {stepInfo.isCompleted ? (
                            <GreenCheckboxIcon css={[completedIconCss, !isLast ? inActiveIconCss : null]}/>
                        ): ""}
                        {stepInfo.isFailed ? (
                            <TextBlock css={failedStepTaglineCss}>
                                <WarningIcon css={failedIconCss}/>
                                <span css={failedWarningTextCss}>&nbsp; This step failed</span>
                            </TextBlock>
                        ): ""}
                    </div>
                    {stepInfo.isFailed ? (
                        <FailedStepCard stepId={stepId}/>
                    ) : ""}
                </div>
            </HoverCard>
    )
};

const inActiveIconCss = css`
    path {
        fill: rgba(99, 99, 99, 0.91);
    }
`;
const containerCss = css`
    padding-right: 11rem;
    border-radius: 2rem;
    border-width: 0.5px 0px;
    border-style: solid;
    border-color: #1C1B1B;
    &:not(:first-child){
        border-top: none;
    }
    :hover {
        background:  rgba(199, 81, 255, 0.14);
    }
`;
const activeItemCss = css`
    background:  rgba(199, 81, 255, 0.14);
`;
const contentCss = css`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    box-sizing: border-box;
    border: 1.5rem solid rgba(255, 255, 255, 0);
    border-left: none;
    border-right: none;
    padding: 10rem 15rem;
    padding-right: 5rem;
    position: relative;
`;
const runningPointerIconCss = css`
    width: 6rem;
    height: 9rem;
    position: absolute;
    left: 8rem;
    top: 8rem;
`;
const stepTextCss = css`
    margin-left: 6rem;
    flex: 1 0 50%;
    word-break: break-all;
`;
const stepNameCss = css`
    font-family: Gilroy !important;
    font-style: normal !important;
    font-weight: 500 !important;
    font-size: 12rem !important;
    line-height: 13rem !important;
    color: #FFFFFF !important;
    user-select: none !important;
    margin-bottom: 2rem !important;
`;
const failedTextNameCss = css`
    font-weight: 800;
`;
const runningTextNameCss =css`
    color: #A056FF !important;
`;
const stepDescriptionCss = css`
    font-family: Gilroy !important;
    font-style: normal !important;
    font-weight: 400;
    font-size: 10rem !important;
    line-height: 10rem !important;
    margin-top: 4.9rem !important;
    color: #79929a !important;
    user-select: none !important;
`;
const runningIconCss = css`
    width: 16rem;
    height: 16rem;
    margin-left: 4rem;
`;
const completedIconCss = css`
    width: 14rem;
    height: 14rem;
`;
const failedStepTaglineCss = css`
    display: flex;
    align-items: center;
    flex: 0 1 100%;
    font-family: Gilroy;
    font-style: normal;
    font-weight: 600;
    font-size: 13rem;
    line-height: 13rem;
    color: #de3d76;
    padding: 6rem;
    margin-top: 8rem;
    margin-bottom: 10rem;
`;
const failedIconCss = css`
    height: 13rem;
`;
const failedWarningTextCss = css`
    margin-left: 4rem;
    padding-top: 2rem;
`;

interface IFailedStepCardProps {
    stepId: any;
    className?: string;
};

const FailedStepCard = ({className, ...props}: IFailedStepCardProps) => {
    const { stepId } = props;
    const store = useStore();

    const handleRetryStep = React.useCallback(() => {
		const savedSteps = getSavedSteps(store.getState());
		const step = savedSteps[stepId];
		store.dispatch(deleteRecordedSteps([stepId]));

		continueRemainingSteps([
			{
				...step,
				status: ActionStatusEnum.STARTED,
			},
		]);
	}, [stepId]);

    const handleDeleteAndContinue = React.useCallback(() => {
		const recorderState = getRecorderState(store.getState());

		store.dispatch(deleteRecordedSteps([stepId]));
		continueRemainingSteps();
	}, [stepId]);

    return (
        <div css={failedContainerCss} className={`${className}`}>
            <div css={failedHeadingCss}>
                <Text css={failedHeadingTextCss}>What to do?</Text>
            </div>
            <div css={failedContentCss}>
                <TooltipButton
                    onClick={handleRetryStep}
                    tooltip={
                        <div css={toolTipTextCss}>
                            Runs this step again,<br/>
                            usually after modifying it
                        </div>
                    }>
                    Retry step
                </TooltipButton>
                <TooltipButton
                    onClick={handleDeleteAndContinue}
                    tooltip={
                        <div css={toolTipTextCss}>
                        	Delete this step, and<br />
							continue on with the test
                        </div>
                    }>
                    Delete & continue
                </TooltipButton>
            </div>
        </div>
    )
};

const failedContainerCss = css`
    padding: 15rem;
    margin: 6rem 0rem;
    background: #0f1011;
    border: 1rem solid rgba(255, 255, 255, 0.12);
    box-sizing: border-box;
    border-radius: 4rem;
`;
const failedHeadingCss = css`
    display: flex;
    flex: 1 1 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8rem;
`;
const failedHeadingTextCss = css`
	font-family: Gilroy;
	font-weight: 800;
	font-size: 12rem;
`;
const failedContentCss = css`
    display: flex;
`;

interface ITooltipButtonProps {
    tooltip: any;
    children?: any;

    className?: string;
    onClick?: any;
};
const TooltipButton = ({className, ...props}: ITooltipButtonProps) => {
    const { tooltip, onClick: callback, children } = props; 
    return (
        <Tooltip
            padding={8}
            type={"hover"}
            placement="top"
            content={tooltip}>
            <Button
                size="small"
                onClick={callback}
                className={`${className}`}
                css={tooltipButtonCss}
                bgColor="tertiary-outline">
                {children}
            </Button>
        </Tooltip>
    );
}

const toolTipTextCss = css`
    padding: 4rem;
`;
const tooltipButtonCss = css`
    margin-right: 9rem;
    background: #ffffff;
    border-radius: 4rem;
    font-size: 12rem !important;
    color: #40383b;
    :hover {
        background: rgba(255, 255, 255, 0.8);
    }
`;
export { Step };