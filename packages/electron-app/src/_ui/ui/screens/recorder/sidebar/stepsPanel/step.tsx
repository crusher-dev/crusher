import React from "react";
import { css } from "@emotion/react";
import { getStepInfo } from "electron-app/src/store/selectors/recorder";
import { useSelector, shallowEqual } from "react-redux";
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
import { StepTimeout } from "./components/steps/timeout";

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
	const isHovered = stepId === stepHoverId

	const [editInputId] = useAtom(editInputAtom);
	const stepInfo = useSelector(getStepInfo(stepId), shallowEqual);
	const { isFailed, isRunning, isCompleted } = stepInfo

	React.useEffect(() => {
		if (!editInputId && stepHoverId) {
			setStepHoverId(null);
		}
	}, [editInputId === `${stepId}-stepName`]);

	const handleHoverCallback = React.useCallback((shouldShow: boolean) => {
		if (shouldShow) {
			setStepHoverId(stepId);
		} else if (!shouldShow && stepHoverId === stepId) {
			setStepHoverId(null);
		}
	}, [stepHoverId]);

	const statusType = React.useMemo(() => {
		if (stepInfo.isRunning && !disabled) {
			return "running"
		}
		if (stepInfo.isCompleted && !disabled) {
			return "completed"
		}

		if (stepInfo.isFailed && !disabled) {
			return "failed"
		}
		return null
	}, [isRunning, isFailed, isCompleted]);

	const title = React.useMemo(() => TextHighlighter({ text: stepInfo.name }), [stepInfo.name]);
	const timeout = React.useMemo(() => (statusType === "running" ? <StepTimeout timeout={30} /> : null), [statusType === "running"]);
	const content = React.useMemo(() => (
		<div className={"step-list-item"} onContextMenu={onContextMenu} onClick={onClick} css={[containerCss(statusType === "failed" || disabled), isActive ? activeItemCss : undefined]}>
			<div className={"card"} css={contentCss}>
				{statusType === "running" ? <PointerArrowIcon css={runningPointerIconCss} /> : ""}
				<div css={stepTextCss} className="flex flex-col justify-center">
					<TextBlock css={[stepNameCss, statusType === "failed" ? failedTextNameCss : null, statusType === "running" ? runningTextNameCss : null, disabled ? css`color: rgba(255, 255, 255, 0.85);` : null]}>
						{title}
					</TextBlock>

					<Conditional showIf={!!stepInfo?.description}>
						<TextBlock css={stepDescriptionCss}>{stepInfo?.description?.substring(0, 40)}</TextBlock>
					</Conditional>
				</div>
				{timeout}
				{statusType === "completed" && !disabled ? <GreenCheckboxIcon css={[completedIconCss, !isLast ? inActiveIconCss : null]} /> : ""}
			</div>
			{statusType === "failed" ? <FailedStepCard stepId={stepId} /> : ""}
		</div>
	), [stepInfo, isActive, isLast, disabled, statusType, title, timeout]);

	return (
		<HoverCard
			supportPadding={<div css={css`position: absolute; background: transparent; width: 20rem; height: 100%; z-index: 999; margin-left: -24rem;`}></div>}
			disabled={disabled || (statusType === "failed" && !stepHoverId) || (stepHoverId && stepHoverId !== stepId)}
			autoHide={true}
			state={stepHoverId === stepId}
			callback={handleHoverCallback}
			wrapperCss={css`
			z-index: 123123123 !important;
			box-shadow: none;
			background: #0F0F0F;
		`}
			css={css`
			padding: 0rem !important;
			margin-left: -4rem;
		`}
			tooltipCSS={css`
			border-radius: 12px;
			overflow: hidden !important;
			background: #0F0F0F;
			border: 1px solid #1C1C1C;
		`}
			content={isHovered ? <StepEditor stepId={stepId} /> : null}
			placement="right"
			type="hover"
			padding={8}
			offset={0}
		>
			{content}
		</HoverCard>
	)
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
		background: ${isDisabled ? `inherit` : `rgba(66, 66, 66, 0.14)`};
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
	top: 12.5rem;
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
