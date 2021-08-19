import * as React from "react";
import { css } from "@emotion/react";
import { ReactElement, useEffect, useState } from "react";
import { Conditional } from "../../layouts";

const toggle = (state) => css`
	// background: ${state ? "#80B05A" : "#E5496E"};
	background: #0a0b0e;
`;
const toggleButton = (state) => css`
	height: 19rem;
	width: 36rem;
	//background: rgba(255, 255, 255, 0.15);
	background: ${state ? "#80B05A" : "#E5496E"};
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 100px;
	display: flex;
	align-items: center;
	padding: 0 1rem;
	cursor: pointer;

	:hover {
		//background: rgba(255, 255, 255, 0.20);
	}
	#ellipsis {
		height: 13rem;
		width: 13rem;
		margin-left: 16rem;
		border-radius: 122px;

		transition: all ease 0.35s;
	}
`;

const disabledToggle = css`
	cursor: not-allowed;
	background: rgba(255, 255, 255, 0.15);
`;

const isOff = css`
	#ellipsis {
		margin-left: 2px;
		opacity: 1;
	}
`;

export type ToggleProps = {
	/**
	 * Emotion CSS style if any
	 */
	isOn: boolean;
	disabled: boolean;
	leftSide?: ReactElement;
	rightSide?: ReactElement;
	callback?: (state: boolean) => void;
} & React.DetailedHTMLProps<any, any>;

const TextDefaultProps = {
	isOn: true,
	disabled: false,
	weight: 700,
	color: "#fff",
};

export function Toggle(props: ToggleProps): ReactElement {
	const [state, toggleState] = useState(props.isOn);

	const { callback, disabled, leftSide, rightSide } = props;

	const handleClick = () => {
		if (disabled) return;
		toggleState(!state);
		callback && callback(!state);
	};

	useEffect(() => {
		toggleState(props.isOn);
	}, [props.isOn]);

	return (
		<div className={"flex items-center "}>
			<Conditional showIf={!!leftSide}>
				<div className={"text-13 mr-12 font-500 mt-2"}>{leftSide}</div>
			</Conditional>
			<div css={[toggleButton(state), !state && isOff, disabled && disabledToggle]} onClick={handleClick}>
				<div id={"ellipsis"} css={toggle(state)}></div>
			</div>
			<Conditional showIf={!!rightSide}>
				<div className={"text-13 ml-12 font-500 mt-2"}>{rightSide}</div>
			</Conditional>
		</div>
	);
}

Toggle.defaultProps = TextDefaultProps;

export default Toggle;
