import React from "react";
import { css } from "@emotion/react";
import { InspectElementIcon } from "../../../../../constants/old_icons";
import { turnOnElementSelectorInspectMode } from "electron-app/src/_ui/commands/perform";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import {  ButtonProps } from "@dyson/components/atoms/button/Button";


type IFieldSelectorPickerProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label: string;
	initialValue?: string;
	stepId: any;
	// Applies to the component's container
	className?: string;
	children?: any;
	onSelectorsPicked: (selectors: iSelectorInfo[]) => any;
};
const FieldSelectorPicker = React.forwardRef((props: IFieldSelectorPickerProps) => {
	const { className, stepId, children } = props;

	const handleElementSelectorClick = () => {
		turnOnElementSelectorInspectMode({stepId});
	};

	React.useEffect(() => {
		const handleMessage = (event) => {
			const { type, selectedElementInfo } = JSON.parse(event.data);
			if (type === "selected-element-for-selectors") {
				props.onSelectorsPicked(selectedElementInfo.selectors);
			}
		};
		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	if(children) {
		return (
			<div onClick={handleElementSelectorClick}>
				{children}
			</div>
		)
	}
	return <InspectElementIcon className={className} onClick={handleElementSelectorClick} css={inspectElementIconStyle} />;
});

type IFieldEditModeButtonProps = Omit<ButtonProps, "children"> & {
	label: string;

	// Applies to the component's container
	className?: string;
};


const inspectElementIconStyle = css`
	width: 16rem;
	height: 16rem;

	:hover {
		opacity: 0.8;
	}
`;

export { FieldSelectorPicker };
