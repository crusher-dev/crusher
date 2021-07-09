/** @jsxImportSource @emotion/react */

import React from 'react';
import { css, jsx, SerializedStyles } from "@emotion/core"

export interface BlankBaseProps {
    children: React.ReactNode;
}

/**
 * Just a Dark container
 */
export const BlankBase: React.FC<BlankBaseProps> = ({
    children,
}) => {

    return (
        <div css={myStyle}>
            {children}
        </div>
    );
};


const myStyle = css`
background: linear-gradient(180deg, #12161B 10.44%, #0C0D0E 100%);
color:white;
height:100vh;
width:100%;
`