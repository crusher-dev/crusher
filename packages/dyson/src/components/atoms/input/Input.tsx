/* eslint-disable */
import React, { memo, ReactElement, useCallback, useEffect, useRef } from "react";
import { css, SerializedStyles } from "@emotion/react";
import { Conditional } from "../../layouts";

export type InputProps = {
	/**
	 * Size of the component
	 */
	size?: "small" | "tiny" | "x-small" | "small" | "medium" | "big-medium" | "large" | "x-large";

	/**
	 * Is error
	 */
	isError?: boolean;

	/**
	 * Disabled;
	 */
	disabled?: boolean;
	initialValue?: string;
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;
	CSS?: SerializedStyles;

	leftIcon?: ReactElement;
	rightIcon?: ReactElement;

	onReturn?: (value: string) => void;

	className?: string;
	inputCss?: any;
	inputWrapperCss?: any;

	autoComplete?: string;
	value?: string;
	type?: string;
	forwardRef?: React.Ref<HTMLInputElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, any>;

/**
 * Unified button component for Dyson UI system
 */
export const Input: React.FC<InputProps> = React.forwardRef((mainProps, ref) => {
	const { initialValue = "", forwardRef, inputCss, size = "large", className, inputWrapperCss, rightIcon, leftIcon, isError = false, onReturn, children, ...props } = mainProps;
	ref = ref ? ref : useRef<HTMLInputElement>(null);

	const onKeyUp = useCallback(
		(e) => {
			if (e.keyCode === 13) {
				onReturn && onReturn(ref.current?.value);
			}
		},
		[onReturn],
	);

	useEffect(() => {
		ref.current && (ref.current.value = initialValue);
	}, [initialValue]);

	const sizeStyle = getSizePropery(size);

	return (
		<div
			css={[
				css`
					position: relative;
				`,
				style,
				inputWrapperCss
			]}
			className={`relative ${className}`}
		>
			<Conditional showIf={!!leftIcon}>
				<div css={leftIconStyle} className="input__leftIconContainer">
					{leftIcon}
				</div>
			</Conditional>
			<input ref={ref} css={[inputBox(sizeStyle, !!leftIcon), isError && errorState, inputCss]} {...props} onKeyUp={onKeyUp} />
			<Conditional showIf={!!rightIcon}>
				<div css={rightIconStyle} className="input__rightIconContainer">
					{rightIcon}
				</div>
			</Conditional>
		</div>
	);
});


const style = css`

input {
	background: transparent;
	border: 0.5px solid rgba(56, 56, 56, 0.6);
	border-radius: 10rem;
	font-weight: 500;
	:focus {
		background: #121316;
		border: 1px solid #ae47ff;
		border-color: #ae47ff;
	}
	::placeholder {
		color: #808080;
	}
	:hover {
		box-shadow: 0px 0px 0px 3px rgba(28, 28, 28, 0.72);
	}
}

@-webkit-keyframes autofill {
	0%,
	100% {
		color: #666;
		background: transparent;
	}
}

input:-webkit-autofill {
	-webkit-animation-delay: 1s; /* Safari support - any positive time runs instantly */
	-webkit-animation-name: autofill;
	-webkit-animation-fill-mode: both;
}
`
//@ts-ignore
Input.whyDidYouRender = true;

export default memo(Input);

const rightIconStyle = css`
	position: absolute;
	top: 50%;
	right: 16px;
	transform: translateY(-50%);
`;

const leftIconStyle = css`
	position: absolute;
	top: 50%;
	height: 100%;
	left: 0px;
	transform: translateY(-50%);

	display: flex;
	align-items: center;
`;
const inputBox = (sizeStyle: { height: number }, leftIconStyle) => css`
	height: ${sizeStyle.height}rem;
	padding-top: 3rem;
	font-size: ${sizeStyle.fontSize}rem;
	padding-left: calc(12rem + ${leftIconStyle === true ? "12rem" : "0rem"});
	width: 100%;

	:focus {
		border-color: #8860de;
		//box-shadow: rgba(104, 147, 231, 0.11) 0px 0px 10px 10px;
	}
`;

const errorState = css`
	border-color: #ff4583 !important;
	:focus {
		border-color: #ff4583 !important;
	}
`;

function getSizePropery(size: InputProps["size"]) {
	switch (size) {
		case "small":
			return { height: 26, fontSize: 12 };
			break;
		case "tiny":
			return { height: 26, fontSize: 12 };
			break;
		case "x-small":
			return { height: 28, fontSize: 12.5 };
			break;
		case "small":
			return { height: 34, fontSize: 14 };
			break;
		case "medium":
			return { height: 38, fontSize: 14 };
			break;
		case "big-medium":
			return { height: 42, fontSize: 14 };
			break;
		case "large":
			return { height: 46, fontSize: 15 };
			break;
		case "x-large":
			return { height: 54, fontSize: 16 };
			break;
		default:
			return { height: 24, fontSize: 12, fontWeight: 500 };
	}
}
