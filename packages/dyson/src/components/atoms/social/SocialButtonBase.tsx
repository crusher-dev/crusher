import React from "react";
import { css } from '@emotion/react';

type SocialBtnBaseProps = {
    children: React.ReactNode
} & Record<any, any>

export const SocialButtonBase = ({children, className, ...props }: SocialBtnBaseProps) => {
    return <div className={`flex items-center justify-between
    rounded-md text-14 py-12 px-15 space-x-20 ${className}`} style={SocialBtnCSS} css={buttonCSS} {...props}>
        {children}
    </div>
};

const SocialBtnCSS: React.CSSProperties = {
    backgroundColor: "#0F1214",
    borderRadius: "9rem",
    border: "1rem solid #292F33",
    color: "white",
    fontSize: "14rem",
    lineHeight: "14rem",
    minWidth: "200rem",
    height: "42rem",
}

const buttonCSS = css`
  background-color:  #0F1214;
 :hover {
     border: 1rem solid rgb(54 65 72);
     background-color: #1b1d1f !important;
 }
`