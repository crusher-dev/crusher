import { css } from "@emotion/react";
import { MouseIcon } from "electron-app/src/ui/icons";
import React from "react";
import { ActionsList, ActionsListItem } from "./actionsList";
import { turnOnInspectMode } from "../../../../../../ui/commands/perform";
import { useTour } from "@reactour/tour";

const InspectModeAction = ({ className, ...prosp }: any) => {
	const { isOpen, setCurrentStep } = useTour();

	const handleTurnOnInspectMode = () => {
		if (isOpen) {
			setCurrentStep(2);
		}
		turnOnInspectMode();
	};

	return (
		<ActionsList className={`${className}`}>
			<ActionsListItem id={"select-element-action"} onClick={handleTurnOnInspectMode}>
				<div id={"select-an-element-action"} css={actionItemContainerStyle}>
					<span>Select an element</span>
					<MouseIcon css={mouseIconStyle} />
				</div>
			</ActionsListItem>
		</ActionsList>
	);
};

const actionItemContainerStyle = css`
	display: flex;
	padding: 0rem 4rem;
	align-items: center;
`;

const mouseIconStyle = css`
	margin-left: auto;
	width: 12rem;
`;

export { InspectModeAction };
