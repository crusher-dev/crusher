import React from "react";
import { css } from "@emotion/react";

function CommonFooter() { 
    return (
        <div css={navBarStyle}>
        <div className={"navItem"}>Docs</div>
        <div className="navItem" css={css`margin-left: auto`}>
            Settings
        </div>
    </div>
    )
};

const navBarStyle = css`
display: flex;
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 16px;

color: #FFFFFF;
z-index: 99;
width: 100%;
.navItem {
    :hover {
        opacity: 0.8;
    }
}
`;

export { CommonFooter };