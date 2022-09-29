import React from "react";
import { css } from "@emotion/react";
import { linkOpen } from "electron-app/src/utils/url";

export function Link({ children, href, ...props }: any) {
	return (
		<span css={[linkStyle]} onClick={linkOpen.bind(this, href)} {...props}>
			{children}
		</span>
	);
}

const linkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	color: #ffffff;
	:hover {
		opacity: 0.8;
	}

	font-size: 13px;
    path{
        fill: #D1D5DB;
    }
    color: #D1D5DB;
    :hover{
        color: #BC66FF;
        opacity: 1;
        path{
            fill: #BC66FF;
        }
    }
`;
