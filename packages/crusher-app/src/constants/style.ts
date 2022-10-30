import { css } from "@emotion/react";



export const plainButtonCSS = css`
	padding: 0 10rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: #cd60ff !important;
	border: 1px solid #7d41ad !important;;
	border-radius: 8px !important;;

	:hover {
		background: #cd60ff;
		filter: brighntess(0.7);
		border: 1px solid #7d41ad;
	}
`;


export const underlineLink = css`
	:hover {
		text-decoration: underline !important;
	}
`;