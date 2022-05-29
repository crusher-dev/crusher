import { css } from "@emotion/react";
import { iAction } from "@shared/types/action";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { CrossIcon } from "electron-app/src/ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { ActionSpecificInfo } from "./actionSpecificInfo";

function getSelectors(action: iAction) {
	if (!action.payload.selectors) return "";

	return action.payload.selectors
		.map((selector, index) => {
			return selector.value;
		})
		.join("\n");
}
const StepInfoEditor = ({ action, isPinned, setIsPinned, actionIndex, ...props }: { action: iAction; actionIndex: number }) => {
	const [isOptional, setIsOptional] = React.useState(!!action.payload.isOptional);
	const [isStepNameEditable, setIsStepNameEditable] = React.useState(false);
	const [stepName, setStepName] = React.useState(action.name ? action.name : "Enter step name");
	const stepNameRef: React.Ref<HTMLInputElement> = React.useRef(null);

	const dispatch = useDispatch();

	const updateStepName = () => {
		setIsStepNameEditable(false);
		dispatch(
			updateRecordedStep(
				{
					...action,
					name: stepNameRef.current.value,
				},
				actionIndex,
			),
		);
	};

	const handleOptionalToggle = (state) => {
		setIsOptional.bind(this, state);

		dispatch(
			updateRecordedStep(
				{
					...action,
					payload: {
						...action.payload,
						isOptional: state,
					},
				},
				actionIndex,
			),
		);
	};

	const handleNameDoubleClick = () => {
		setIsStepNameEditable(true);
		setTimeout(() => {
			stepNameRef.current.focus();
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) {
			updateStepName();
		}
	};

	return (
		<div
			className={"step-info-editor"}
			onClick={setIsPinned!.bind(this, true)}
			css={[containerStyle, scrollBarStyle, isPinned ? pinnedContainerStyle : null]}
		>
			<div className={"font-600 text-15 flex p-12 pt-8 pb-8 pl-8 mt-6"}>
				<div onDoubleClick={handleNameDoubleClick.bind(this)}>
					<input
						ref={stepNameRef}
						css={[stepNameStyle, isStepNameEditable ? editableStepNameStyle : null]}
						value={stepName}
						onBlur={updateStepName}
						onChange={(e) => setStepName(e.target.value)}
						onKeyDown={handleKeyDown.bind(this)}
						disabled={!isStepNameEditable}
					/>
				</div>
				<CrossIcon
					onClick={(e: React.MouseEvent<HTMLOrSVGElement>) => {
						e.stopPropagation();
						setIsPinned!(false);
					}}
					css={crossIconStyle}
				/>
			</div>

			<div css={actionInfoContainerStyle} className={"p-12"}>
				<ActionSpecificInfo setIsPinned={setIsPinned!.bind(this)} action={action} actionIndex={actionIndex} />
			</div>
		</div>
	);
};
const containerStyle = css`
	min-width: 325rem;
	padding-bottom: 8rem;
	position: fixed;
	border-radius: 8rem;
	background: #111213;
	border: 1px solid #272727;
	transform: translateX(calc(100% + 12rem));
	font-family: Cera Pro;
	bottom: 0%;
	min-height: 274rem;
	max-height: 274rem;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
`;
const pinnedContainerStyle = css`
	z-index: 100;
`;

const stepNameStyle = css`
	font-size: 13.75rem;
	padding: 4rem 4rem;
	border: none;
	background: transparent;
	font-weight: 400;
	border: 1px solid transparent;
	:hover {
		opacity: 0.9;
	}
`;
const editableStepNameStyle = css`
	border: 1px solid rgba(196, 196, 196, 0.2);
`;

const crossIconStyle = css`
	width: 10rem;
	margin-left: auto;
	margin-top: 4rem;
`;

const actionInfoContainerStyle = css`
	font-family: Gilroy;
	font-size: 12.8rem;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const scrollBarStyle = css`
	::-webkit-scrollbar {
		display: none;
	}
`;

export { StepInfoEditor };
