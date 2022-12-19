import React from "react";
import { css } from "@emotion/react";

const ErrorDialog = () => {
    return (
        <div css={containerCss}>
            Something went wrong while performing this action.
            Time to wrap it up
        </div>
    )
};

const containerCss = css`
    background: green;
    position: fixed;
    bottom: 20rem;
    left: 60%;
    transform: translateX(-50%);
    z-index: 10000;
    padding: 6rem;
    border-radius: 8rem;
    color: #fff;
    font-family: Gilroy;
    padding-left: 20rem;
    padding-right: 20rem;
    font-weight: bold;
    font-size: 16rem;
`;

export default ErrorDialog;