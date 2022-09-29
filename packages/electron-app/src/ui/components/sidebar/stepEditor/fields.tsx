import React from "react";
import { Toggle } from "@dyson/components/atoms/toggle/toggle";
import Switch, { ToggleProps } from "@dyson/components/atoms/toggle/switch";
import { Input } from "@dyson/components/atoms";
import { InputProps } from "@dyson/components/atoms/input/Input";
import { css } from "@emotion/react";
import { InspectElementIcon } from "../../../icons";
import { turnOnElementSelectorInspectMode } from "electron-app/src/_ui/commands/perform";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { Button, ButtonProps } from "@dyson/components/atoms/button/Button";

type IFieldInputProps = InputProps & {
	label: string;

	// Applies to the component's container
	className?: string;
	inputStyleCSS?: any;
};

const FieldInput = (props: IFieldInputProps) => {
	const { className, label } = props;

	const inputProps = React.useMemo(() => {
		const clonedProps = { ...props };
		delete clonedProps.label;
		delete clonedProps.className;
		return clonedProps;
	}, [props]);

	return (
		<div className={`flex ${className}`} css={fieldContainerStyle}>
			<span css={labelCss}>{label}</span>
			<Input
				css={
					[
						inputStyle,
						css`
							min-width: auto;
							max-width: 125rem;
						`,
						props.inputStyleCSS,
					] as any
				}
				{...inputProps}
			/>
		</div>
	);
};

const labelCss = css`
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	color: rgba(215, 223, 225, 0.6);
`;
type IToggleProps = ToggleProps & {
	label: string;

	// Applies to the component's container
	className?: string;
};

const FieldToggle = (props: IToggleProps) => {
	const { className } = props;

	const toggleProps = React.useMemo(() => {
		const clonedProps = { ...props };
		delete clonedProps.label;
		delete clonedProps.className;

		return clonedProps;
	}, [props]);

	return (
		<div className={`flex ${className}`} css={fieldContainerStyle}>
			<span>{props.label}</span>
			<Switch css={toggleStyle} {...toggleProps} />
		</div>
	);
};

type IFieldSelectorPickerProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label: string;
	initialValue?: string;
	// Applies to the component's container
	className?: string;
	onSelectorsPicked: (selectors: Array<iSelectorInfo>) => any;
};
const FieldSelectorPicker = React.forwardRef((props: IFieldSelectorPickerProps, ref: React.Ref<HTMLTextAreaElement>) => {
	const { className } = props;
	const currentRef = ref ? ref : React.createRef(null);

	const selectorsInputProps = React.useMemo(() => {
		const clonedProps = { ...props };
		delete clonedProps.label;
		delete clonedProps.className;
		delete clonedProps.initialValue;

		return clonedProps;
	}, [props]);

	const handleElementSelectorClick = () => {
		turnOnElementSelectorInspectMode();
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

	return (<InspectElementIcon className={className} onClick={handleElementSelectorClick} css={inspectElementIconStyle} />);
});

type IFieldEditModeButtonProps = Omit<ButtonProps, "children"> & {
	label: string;

	// Applies to the component's container
	className?: string;
};

const FieldEditModeButton = (props: IFieldEditModeButtonProps) => {
	const { className } = props;

	const buttonProps = React.useMemo(() => {
		const clonedProps = { ...props };
		delete clonedProps.label;
		delete clonedProps.className;

		return clonedProps;
	}, [props]);

	return (
		<div className={`${className}`}>
			<span>{props.label}</span>
			<div className={"mt-24"} css={buttonContainerStyle}>
				<Button {...buttonProps}>
					<span css={buttonTextStyle}>Open Edit Modal</span>
				</Button>
			</div>
		</div>
	);
};

const buttonTextStyle = css`
	font-size: 12.25rem;
	padding: 0 14rem;
`;
const buttonContainerStyle = css`
	flex: 1;
	margin-top: 24rem;
	position: relative;
	display: flex;
	justify-content: center;
`;

const textAreaStyle = css`
	width: 100%;
	height: 100rem;
	background: rgba(0, 0, 0, 0.34);
	border: 1px solid rgba(196, 196, 196, 0.2);
	border-radius: 4rem;
	resize: none;
	padding: 4rem 8rem;
	line-height: 20rem;
	font-size: 12rem;
`;

const scrollBarStyle = css`
	::-webkit-scrollbar {
		display: none;
	}
`;

const selectorPickerContainerStyle = css`
	flex: 1;
	position: relative;
	textarea {
		font-size: 12rem;
	}
`;
const selectorPickerLabelStyle = css`
	align-self: start;
	margin-top: 4rem;
`;

const fieldContainerStyle = css`
	display: flex;
	align-items: center;
`;
const inputStyle = css`
	background: rgba(177, 79, 254, 0.04);
	border: 0.5px solid transparent;
	border-radius: 8rem;


	min-width: 358rem;
	outline: none;
	margin-left: 7rem;
	input {
		font-family: 'Gilroy' !important;
		font-style: normal !important;
		font-weight: 400 !important;
		font-size: 13rem !important;
		color: rgba(255, 255, 255, 0.93) !important;
		padding: 7rem 9rem !important;
	}

	:hover {
		border: 0.5px solid #B14FFE;
	}
`;

const toggleStyle = css`
	margin-left: auto;
`;

const inspectElementIconStyle = css`
	width: 16rem;
	height: 16rem;

	:hover {
		opacity: 0.8;
	}
`;

export { FieldInput, FieldToggle, FieldSelectorPicker, FieldEditModeButton };
