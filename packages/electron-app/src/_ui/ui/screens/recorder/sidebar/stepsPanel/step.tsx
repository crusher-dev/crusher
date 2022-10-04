import React from "react";
import { css } from "@emotion/react";
import { getStepInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector } from "react-redux";
import { GreenCheckboxIcon, LoadingIcon, PointerArrowIcon } from "electron-app/src/_ui/constants/old_icons";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { TextHighlighter } from "./helper";
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";
import { StepEditor } from "./stepEditor";
import { FailedStepCard } from "./failedCard";
import { stepHoverAtom } from "electron-app/src/_ui/store/jotai/steps";
import { useAtom } from "jotai";
import { editInputAtom } from "electron-app/src/_ui/store/jotai/testsPage";
import { Conditional } from "@dyson/components/layouts";

interface IProps {
	className?: string;
	stepId?: string;
	isActive: boolean;
	setIsActive: any;
	onClick?: any;
	onContextMenu?: any;
	isLast: boolean;

	shouldOpenEditor?: boolean;
	step?: any;
}

const Step = ({ className, isActive, disabled, onContextMenu, shouldOpenEditor, step, onClick, setIsActive, isLast, ...props }: IProps) => {
	const { stepId } = props;
	const [stepHoverId, setStepHoverId] = useAtom(stepHoverAtom);
	const [editInputId] = useAtom(editInputAtom);
	const [isEditCardOpen, setIsEditorCardOpen] = React.useState(false);
	const stepInfo = useSelector(getStepInfo(stepId));

	const title = TextHighlighter({ text: stepInfo.name });
	const hasFailed = stepInfo.isFailed;

	React.useEffect(() => {
		if (!editInputId && stepHoverId) {
			setStepHoverId(null);
		}
	}, [editInputId === `${stepId}-stepName`]);

	const handleHoverCallback = React.useCallback((shouldShow: boolean) => {
		if(shouldShow) {
			setStepHoverId(stepId);
		} else if(!shouldShow && stepHoverId === stepId) {
			setStepHoverId(null);
		}
	}, [stepHoverId]);
	return (
		<HoverCard
			disabled={disabled || (hasFailed && !stepHoverId)  || (stepHoverId && stepHoverId !== stepId)}
			disableStateManagement={true}
			autoHide={true}
			state={stepHoverId === stepId}

			callback={handleHoverCallback}
			wrapperCss={css`
				z-index: 123123123 !important;
				box-shadow: none;
			`}
			css={css`
				padding: 0rem !important;
			
			`}
			tooltipCSS={css`
				border-radius: 16px;
				overflow: hidden !important;
				border: .5px solid #1C1C1C;
			`}
			content={<StepEditor stepId={stepId} />}
			placement="right"
			type="hover"
			padding={8}
			offset={0}
		>
			<div onContextMenu={onContextMenu} onClick={onClick} css={[containerCss(hasFailed || disabled), isActive ? activeItemCss : undefined]}>
				<div className={"card"} css={contentCss}>
					{stepInfo.isRunning ? <PointerArrowIcon css={runningPointerIconCss} /> : ""}
					<div css={stepTextCss} className="flex flex-col justify-center">
						<TextBlock css={[stepNameCss, stepInfo.isFailed ? failedTextNameCss : null, stepInfo.isRunning ? runningTextNameCss : null, disabled ? css`color: rgba(255, 255, 255, 0.85);` : null]}>
							{title}
						</TextBlock>
						<Conditional showIf={!!stepInfo?.description}>
							<TextBlock css={stepDescriptionCss}>{stepInfo?.description?.substring(0, 40)}</TextBlock>
						</Conditional>
					</div>
					{stepInfo.isRunning && !disabled ? <LoadingIcon style={{}} css={runningIconCss} /> : ""}
					{stepInfo.isCompleted && !disabled ? <GreenCheckboxIcon css={[completedIconCss, !isLast ? inActiveIconCss : null]} /> : ""}
				</div>
				{hasFailed ? <FailedStepCard stepId={stepId} /> : ""}
			</div>
		</HoverCard>
	);
};

const inActiveIconCss = css`
	path {
		fill: rgba(99, 99, 99, 0.91);
	}
`;
const containerCss = (isDisabled) => css`
	border-top: 0.5px solid #1c1b1b;
	border-bottom: 0.5px solid #1c1b1b;

	&:not(:first-child) {
		border-top: none;
	}
	border-top: .5px solid transparent !important;
	:hover {
		background: ${isDisabled ? `inherit` : `rgba(199, 81, 255, 0.14)`};
	}
`;
const activeItemCss = css`
	background: rgba(199, 81, 255, 0.1);
	border-top: .5px solid #582B98 !important;
	border-bottom: .5px solid #582B98;
`;
const contentCss = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	box-sizing: border-box;
	border-left: none;
	border-right: none;
	padding: 10rem 20rem;
	padding-right: 16rem;
	position: relative;
`;
const runningPointerIconCss = css`
	width: 6rem;
	height: 9rem;
	position: absolute;
	left: 8rem;
	top: 10rem;
`;
const stepTextCss = css`
	flex: 1 0 50%;
	word-break: break-all;
`;
const stepNameCss = css`
	font-family: Gilroy !important;
	font-style: normal !important;
	font-weight: 500 !important;
	font-size: 12.4rem !important;
	line-height: 13rem !important;
	color: #DADADA !important;
	user-select: none !important;
	margin-top: 1rem;
`;
const failedTextNameCss = css`
	font-weight: 800;
`;
const runningTextNameCss = css`
	color: #a056ff !important;
`;
const stepDescriptionCss = css`
	font-family: Gilroy !important;
	font-style: normal !important;
	font-weight: 400;
	font-size: 10rem !important;
	line-height: 10rem !important;
	color: #4B4B52 !important;
	user-select: none !important;
	margin-top: 8rem;
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

export { Step };
