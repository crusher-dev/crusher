import React from "react";
import { css } from "@emotion/react";

const HoverIcon = ({onClick, wrapperCss, className, Component}) => {
    return (
        <div
        onClick={onClick}
        className={`flex items-center justify-center`}
        css={[hoverIconCss, wrapperCss]}
    >
        <Component className={`${className}`}/>
    </div>
    )
};

const hoverIconCss = css`
border-radius: 4rem;
padding: 3rem 5rem;
:hover {
    path {
        fill: #fff;
    }
    background: #ffffff14;
}
`;
export { HoverIcon };