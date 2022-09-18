import React from "react";
import { css } from "@emotion/react";
import { Link } from "./Link";
import { PointerLink } from "./PointerLink";

const Footer = () => {
    return (
        <div css={containerCss}>
           <div css={leftSectionCss}>
                <PointerLink css={resourcesCss}>tutorials</PointerLink>
                <PointerLink css={resourcesCss}>docs</PointerLink>
           </div>
           <div css={rightSectionCss}>
                <Link css={socialLinkCss}>github</Link>
                <Link css={socialLinkCss}>Discord</Link>
           </div>
        </div>
    );
};

const containerCss = css`
    display: flex;
    align-items: center;
    height: 46px;
    padding: 0px 27px;
    padding-left: 22px;
`;
const leftSectionCss = css`
    display: flex;
    gap: 6px;
    align-items: center;
`;
const rightSectionCss = css`
    margin-left: auto;
    display: flex;
    gap: 20px;
    align-items: center;
`;
const socialLinkCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;

    text-decoration-line: underline;
    color: rgba(255, 255, 255, 0.54);
`;
const resourcesCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 13.5px;
text-align: right;

color: #828282;

`;
export { Footer };