import { css } from "@emotion/react";
import { iAction } from "@shared/types/action";
import { updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { CrossIcon } from "electron-app/src/_ui/constants/old_icons";
import React from "react";
import { useDispatch } from "react-redux";
import { ActionSpecificInfo } from "./actionSpecificInfo";

const StepInfoEditor = ({ action, isPinned, actionIndex }: { action: iAction; actionIndex: number }) => {
	const [isStepNameEditable, setIsStepNameEditable] = React.useState(false);
	const [stepName, setStepName] = React.useState(action.name || "Enter step name");
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
			<div className={"font-600 text-15 flex"}>
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
	min-width: 412rem;
	padding: 24rem 20rem;
	border-radius: 8rem;
	border-bottom: 0.5px solid rgba(255, 255, 255, 0.06);
	border-radius: 16px 16px 0px 0px;
	font-family: Cera Pro;
	bottom: 0%;
	min-height: 274rem;
	max-height: 274rem;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	left: -1px;
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
