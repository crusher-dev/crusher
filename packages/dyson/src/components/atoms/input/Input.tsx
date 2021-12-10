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
} & React.DetailedHTMLProps<any, any>;

/**
 * Unified button component for Dyson UI system
 */
export const Input: React.FC<InputProps> = ({ initialValue = "", size = "large", rightIcon, isError = false, onReturn, children, className, ...props }) => {
	const ref = useRef<HTMLInputElement>(null);

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
			css={css`
				position: relative;
			`}
			className={"relative"}
		>
			<input ref={ref} css={[inputBox(sizeStyle), isError && errorState, props.CSS]} {...props} className={String(className || "")} onKeyUp={onKeyUp} />
			<Conditional showIf={!!rightIcon}>
				<div css={rightIconStyle}>{rightIcon}</div>
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
	font-size: 13rem;
	padding-left: 16rem;
	color: #fff;

	width: 100%;

	:focus {
		border-color: #6893e7;
		//box-shadow: rgba(104, 147, 231, 0.11) 0px 0px 10px 10px;
	}
`;

const errorState = css`
	border-color: #ff4583; ;
`;

function getSizePropery(size: InputProps["size"]) {
	switch (size) {
		case "small":
			return { height: 20 };
		case "large":
			return { height: 46 };
		default:
			return { height: 34 };
	}
}
