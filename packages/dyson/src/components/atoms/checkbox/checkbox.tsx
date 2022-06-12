import * as React from "react";
import { css } from "@emotion/react";
import { ReactElement } from "react";
import { Conditional } from "../../layouts";

function TickSVG(props: React.SVGAttributes<SVGSVGElement>) {
	return (
		<svg width={12} height={9} viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11.649 2.377L5.317 8.18a1.28 1.28 0 01-1.698 0L.352 5.184a1.037 1.037 0 010-1.557 1.28 1.28 0 011.698 0l2.419 2.218L9.95.82a1.28 1.28 0 011.698 0c.47.43.47 1.127 0 1.557z"
				fill="#fff"
			/>
		</svg>
	);
}

export type CheckboxProps = {
	/**
	 * Emotion CSS style if any
	 */
	isSelected: boolean;
	isSelectAllType: boolean;
	disabled?: boolean;
	label?: ReactElement;
	callback?: (state: boolean) => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<any>, any>;

const RadioDefaultProps = {
	isSelected: true,
	isSelectAllType: false,
	disabled: false,
};

const checkBox = () => css`
	height: 16rem;
	width: 16rem;
	border: 1rem solid #383a41;
	border-radius: 4rem;
	display: flex;
	align-items: center;
	justify-content: center;

	:hover {
		background: #222426;
	}
`;

const normalSelect = (isSelected: boolean) => css`
	svg {
		display: ${isSelected ? "block" : "none"};
	}

	:hover {
		svg {
			display: block;
		}
	}
	background: ${isSelected ? "#9462FF" : "none"};

	:hover {
		background: ${isSelected ? "#8a5ee8" : "#9462FF"};
	}
`;

const selectAll = (isSelected: boolean) => css`
	#tick {
		height: 8rem;
		width: 8rem;
		border-radius: 2rem;
		background: ${isSelected ? "#0a0b0e" : "#9462FF"};
		display: ${isSelected ? "block" : "none"};
	}

	background: ${isSelected ? "#9462FF" : "none"};

	:hover {
		#tick {
			display: block;
		}
		background: ${isSelected ? "#8a5ee8" : "#0a0b0e"};
	}
`;

const disabledCSS = css`
	opacity: 0.5;
	cursor: not-allowed;
`;

export function Checkbox(props: CheckboxProps): ReactElement {
	const { callback, disabled, label, isSelected, isSelectAllType, className } = props;

	const handleClick = () => {
		callback && callback(!isSelected);
	};

	return (
		<div className={`flex items-center ${className}`} onClick={handleClick}>
			<Conditional showIf={isSelectAllType}>
				<div css={[checkBox(), selectAll(isSelected), disabled && disabledCSS]}>
					<div id={"tick"}></div>
				</div>
			</Conditional>

			<Conditional showIf={!isSelectAllType}>
				<div css={[checkBox(), normalSelect(isSelected), disabled && disabledCSS]}>
					<TickSVG height={8} width={8} />
				</div>
			</Conditional>

			<Conditional showIf={!!label}>
				<div className={"text-13 ml-12 font-500 mt-2"}>{label}</div>
			</Conditional>
		</div>
	);
}

Checkbox.defaultProps = RadioDefaultProps;

export default Checkbox;
