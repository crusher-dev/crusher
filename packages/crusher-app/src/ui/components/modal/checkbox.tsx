import React from "react";
import TickCheckbox from "../../../../public/svg/modals/tick_checkbox.svg";
import UnTickCheckbox from "../../../../public/svg/modals/untick_checkbox.svg";
import { css } from "@emotion/core";

const ModalCheckbox = (props: any) => {
	const { enabled, containerCss, title, onToggle } = props;
	return (
		<div css={[containerCssS, containerCss]}>
			<div onClick={onToggle}>{enabled ? <TickCheckbox /> : <UnTickCheckbox />}</div>
			<div css={titleCss}>{title}</div>
		</div>
	);
};

const containerCssS = css`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const titleCss = css`
	color: #7e7e7e;
	font-family: Gilroy;
	font-size: 0.75rem;
	margin-left: 0.8125rem;
`;

export { ModalCheckbox };
