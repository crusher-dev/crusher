import React from "react";
import { css } from "@emotion/react";
import { Link } from "./Link";
import { LinkPointer } from "./LinkPointer";
import { DiscordSVG, GithubSVG } from "./stickyFooter";
import { linkOpen } from "electron-app/src/utils/url";
import { Tooltip } from "@dyson/components/atoms/tooltip/Tooltip";

const Footer = () => {
    return (
        <div css={containerCss}>
            <div css={leftSectionCss}>
                <Tooltip content={"walkthru"} placement="top" type="hover">
                    <div> <LinkPointer css={resourcesCss} onClick={linkOpen.bind(this, "https://docs.crusher.dev")}>tutorials</LinkPointer></div>
                </Tooltip>
                <Tooltip content={"crusher docs"} placement="top" type="hover">
                    <div><LinkPointer css={resourcesCss} onClick={linkOpen.bind(this, "https://docs.crusher.dev")}>docs</LinkPointer></div>
                </Tooltip>

            </div>
            <div css={rightSectionCss}>
                <Link css={socialIcon} href="https://github.com/crusher-dev/crusher" title="Github">
                    <GithubSVG height={14} width={14} />
                </Link>
                <Link css={socialIcon} href="https://discord.com/invite/dHZkSNXQrg" title="Discord">
                    <DiscordSVG height={16} width={16} />
                </Link>
            </div>
        </div>
    );
};



const containerCss = css`
    display: flex;
    align-items: center;
    height: 46px;
    padding: 0px 24px;
    padding-left: 22px;

    background:  #0D0D0E;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 0.5px solid rgba(255, 255, 255, 0.08);
`;
const leftSectionCss = css`
    display: flex;
    gap: 6px;
    align-items: center;
`;
const rightSectionCss = css`
    margin-left: auto;
    display: flex;
    gap: 12px;
    align-items: center;
`;
const socialIcon = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;

    text-decoration-line: underline;
    color: rgba(255, 255, 255, 0.54);

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
const resourcesCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 13.5px;
text-align: right;

color: #828282;

`;
export { Footer };