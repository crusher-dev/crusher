import React, { ReactElement, useCallback, useRef } from "react";
import { css, SerializedStyles } from "@emotion/react";
import { Conditional } from "../../layouts";

export type ButtonProps = {
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
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;

	rightIcon?: ReactElement;

	onReturn?: (string) => void;

	className?: string;
} & React.DetailedHTMLProps<any, any>;

/**
 * Unified button component for Dyson UI system
 */
export const Input: React.FC<ButtonProps> = ({ size = "medium", rightIcon, isError = false, onReturn, children, className, ...props }) => {
	const ref = useRef();

	const onKeyUp = useCallback((e) => {
		if (e.keyCode == 13) {
			onReturn && onReturn(ref.current.value);
		}
	});

	return (
		<div className={"relative"}>
			<input ref={ref} css={[inputBox, isError && errorState]} {...props} className={`${className ? className : ""}`} onKeyUp={onKeyUp} />

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
const inputBox = css`
	width: 348rem;
	background: linear-gradient(0deg, #0e1012, #0e1012);
	border: 1px solid #2a2e38;
	box-sizing: border-box;
	border-radius: 4px;
	height: 46rem;
	padding-top: 3rem;
	font-size: 14rem;
	padding-left: 16rem;
	color: #fff;

	:focus {
		border-color: #6893e7;
		//box-shadow: rgba(104, 147, 231, 0.11) 0px 0px 10px 10px;
	}
`;

const errorState = css`
	border-color: #ff4583; ;
`;
