import { css } from "@emotion/react";
import { Text } from "dyson/src/components/atoms";
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
			className={`flex justify-between items-center px-8 py-6 ${className}`}
			{...otherProps}
		>
			<Text className="name capitalize" weight={600}>{label}</Text>
			<Text className="shortcut capitalize" fontSize={12}>{rightLabel}</Text>
		</div>
	);
}

const highlightHoverStyle = css`
	:hover {
		background: #bb26ff !important;
	}
`;

const isSelectedStyle = css`
	background: rgba(32, 35, 36, 0.62);
	:hover {
		background: #bb26ff;
	}
`;

const dropDownItem = css`
	height: 28rem;
	width: 176rem;
	border-radius: 6rem;

	transition: all 0ms;
	.name {
		color: #e7e7e8;
		letter-spacing: .4px;
	}

	.shortcut {
		color: #7b7b7b;
	}

	:hover {
		background: #a82be2;
		path {
			stroke: white;
			transition: all 0ms;
		}
	}
`;
