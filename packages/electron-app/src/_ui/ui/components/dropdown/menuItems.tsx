import { css } from "@emotion/react";
import { ReactElement } from "react";

type TMenuItem = {
	label: ReactElement | string;
	rightLabel: ReactElement | string;
	showHighlighted: boolean;
	selected: boolean;
} & React.DetailedHTMLProps<any, any>;

export function MenuItem({ label, rightLabel, css, showHighlighted = false, selected = false, className, ...otherProps }: TMenuItem) {
	return (
		<div
			css={[dropDownItem, showHighlighted && highlightHoverStyle, selected && isSelectedStyle, css]}
			className={`flex justify-between items-center px-12 py-6 ${className}`}
			{...otherProps}
		>
			<span className={"name font-500 leading-none font-cera capitalize"}>{label}</span>
			<span className={"text-12 shortcut leading-none"}>{rightLabel}</span>
		</div>
	);
}

const highlightHoverStyle = css`
	:hover {
		background: #a438f8 !important;
	}
`;

const isSelectedStyle = css`
	background: rgba(32, 35, 36, 0.62);
	:hover {
		background: #a438f8;
	}
`;

const dropDownItem = css`
	height: 28rem;
	width: 176rem;
	border-radius: 0em;

	transition: all 0ms;
	.name {
		font-size: 12.5rem;
		color: #e7e7e8;
	}

	.shortcut {
		color: #7b7b7b;
	}

	:hover {
		background: #a438f8;
		path {
			stroke: white;
			transition: all 0ms;
		}
	}
`;
