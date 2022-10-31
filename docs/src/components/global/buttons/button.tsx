import React from "react";
import { css } from "@emotion/css";

export const LinkButton = ({href, blank, children, className, ...props}) => {
    return (
        <a href={href} target={blank ? "_blank" : undefined}>
            <div className={containerCss + " flex items-center justify-center " + className} {...props}>
                {children}
            </div>
        </a>
    )
}


const containerCss = css`
    padding: 4px 12px;
    width: fit-content;
    :hover {
        opacity: 0.7;
    }
`;
