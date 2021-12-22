import React from "react";
import { css } from "@emotion/react";

const Sidebar = ({className, ...props}: any) => {
    return (
        <div css={containerStyle} className={`${className}`}>

        </div>
    )
};

const containerStyle = css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
`;

export { Sidebar }