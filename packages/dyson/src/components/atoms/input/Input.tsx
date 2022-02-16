/* eslint-disable */
import React, { ReactElement, useCallback, useEffect, useRef } from "react";
import { css, SerializedStyles } from "@emotion/react";
import { Conditional } from "../../layouts";

export type InputProps = {
	/**
	 * Size of the component
	 */
	size?: "small" | "medium" | "large";

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

	rightIcon?: ReactElement;

	onReturn?: (value: string) => void;

	className?: string;

	forwardRef?: React.Ref<HTMLInputElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, any>;

/**
 * Unified button component for Dyson UI system
 */
export const Input: React.FC<InputProps> = ({
	initialValue = "",
	forwardRef,
	size = "large",
	className,
	rightIcon,
	isError = false,
	onReturn,
	children,
	...props
}) => {
	// tslint:disable-next-line: no-empty
	const ref = forwardRef ? forwardRef : useRef<HTMLInputElement>(null);

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
			]}
			className={`relative ${className}`}
		>
			<input ref={ref} css={[inputBox(sizeStyle), isError && errorState]} {...props} onKeyUp={onKeyUp} />
			<Conditional showIf={!!rightIcon}>
				<div css={rightIconStyle} className="input__rightIconContainer">
					{rightIcon}
				</div>
			</Conditional>
		</div>
	);
};

const rightIconStyle = css`
	position: absolute;
	top: 50%;
	right: 16px;
	transform: translateY(-50%);
`;
const inputBox = (sizeStyle: { height: number }) => css`
	background: linear-gradient(0deg, #0e1012, #0e1012);
	border: 1px solid #2a2e38;
	box-sizing: border-box;
	border-radius: 4px;
	height: ${sizeStyle.height}rem;
	padding-top: 3rem;
	font-size: ${sizeStyle.fontSize}rem;
	padding-left: 16rem;
	color: #fff;

	width: 100%;

	:focus {
		border-color: #8860de;
		//box-shadow: rgba(104, 147, 231, 0.11) 0px 0px 10px 10px;
	}
`;

const errorState = css`
	border-color: #ff4583;
	:focus {
		border-color: #ff4583;
	}
`;

function getSizePropery(size: InputProps["size"]) {
	switch (size) {
		case "small":
			return { height: 26, fontSize: 12 };
			break;
		case "large":
			return { height: 42, fontSize: 14 };
			break;
		default:
			return { height: 34, fontSize: 13 };
			break;
	}
}
