import { css } from "@emotion/react";

export const newButtonStyle = css`
	border-radius: 8px;
	background: #b341f9 !important;
	border: 0.5px solid #b341f9 !important;
	border-radius: 8rem !important;
	min-width: fit-content !important;
`;

export const hoverStyle = css`
	color: #909090;
	:hover{
		color: #fff;
		path{
			stroke: #fff;
		}
	}
`;


export const underlineOnHover = css`
	:hover{
		text-decoration: underline;
	}
	text-underline-offset: 2px;
`;
