import React from "react";
import { css } from "@emotion/react";
import { InspectElementIcon } from "../../../../../constants/old_icons";
import { turnOnElementSelectorInspectMode } from "electron-app/src/_ui/commands/perform";
import { iSelectorInfo } from "@shared/types/selectorInfo";

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
	const { className, onSelectorsPicked, stepId, children } = props;

	const handleElementSelectorClick = () => {
		turnOnElementSelectorInspectMode({ stepId });
	};

	React.useEffect(() => {
		const handleMessage = (event) => {
			const { type, selectedElementInfo } = JSON.parse(event.data);
			if (type === "selected-element-for-selectors") {
				onSelectorsPicked(selectedElementInfo.selectors);
			}
		};
		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, [onSelectorsPicked]);

	if (children) {
		return <div onClick={handleElementSelectorClick}>{children}</div>;
	}
	return <InspectElementIcon className={className} onClick={handleElementSelectorClick} css={inspectElementIconStyle} />;
});

const inspectElementIconStyle = css`
	width: 16rem;
	height: 16rem;

	:hover {
		opacity: 0.8;
	}
`;

export { FieldSelectorPicker };
