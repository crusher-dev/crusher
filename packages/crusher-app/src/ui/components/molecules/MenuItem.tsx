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
			className={`flex justify-between items-center px-16 py-12 ${className}`}
			{...otherProps}
		>
			<span className={"name font-500 leading-none font-cera capitalize"}>{label}</span>
			<span className={"text-12 shortcut leading-none"}>{rightLabel}</span>
		</div>
	);
}

const highlightHoverStyle = css`
	:hover {
		background: #687ef2 !important;
	}
`;

const isSelectedStyle = css`
	background: rgba(32, 35, 36, 0.62);
	:hover {
		background: #687ef2;
	}
`;

const dropDownItem = css`
	.name {
		font-size: 12.5rem;
		color: #e7e7e8;
	}

	.shortcut {
		color: #7b7b7b;
	}

	:hover {
		background: rgba(32, 35, 36, 0.62);
	}
`;
