import React from "react";
import { css } from "@emotion/react";
import { CloudIcon, ConsoleIcon, DocsIcon, NotepadIcon } from "../icons";
import { Link } from "./Link";

interface IProps {
    className?: string;
};
const StickyFooter = ({className, ...props}: IProps) => {
    return (
        <div css={containerCss} className={`${className}`}>
            <div css={contentCss}>
                <div css={notificationContainerCss}>
                    <div css={notificationContentCss}>
                        <ConsoleIcon css={consoleIconCss}/>
                        <span css={notificationTextCss}>2: Last build has passed</span>
                    </div>
                    <div css={notificationActionCss}>
                        <Link css={linkCss}>view report</Link>
                    </div>
                </div>
                <div css={contextContainerCss}>
                    <CloudIcon css={[cloudIconCss, clickableCss]} shouldAnimateGreen={true}/>
                    <NotepadIcon css={[notepadIconCss, clickableCss]}/>
                </div>
            </div>
            <div css={docsButtonCss}>
                <DocsIcon css={docsIconCss}/>
                <span css={docsButtonTextCss}>Docs & help</span>
            </div>
        </div>
    )
};

const containerCss = css`
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)), linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), #161617;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const docsButtonCss = css`
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), #0F1010;
    border-left: 1px solid #242424;
    font-family: 'Cera Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;

    color: #FFFFFF;
    width: 124px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    border-left: 1px solid #242424;

    :hover {
        opacity: 0.8;
    }
`;
const docsIconCss = css`
    width: 16px;
    height: 16px;
`;
const docsButtonTextCss = css`
    margin-left: 7px;
`;

const contextContainerCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-left: auto;
`;
const notepadIconCss = css`
    width: 14px;
    height: 14px;
`;
const notificationContainerCss = css`
    flex: 1;
    display: flex;
    align-items: center;
`;
const contentCss = css`
    flex: 1;
    display: flex;
    padding-left: 27px;
    padding-right: 13px;
`;
const cloudIconCss = css`
    width: 16px;
    height: 11px;
`;
const clickableCss = css`
    :hover {
        opacity: 0.8;
    }
`;
const consoleIconCss = css`
    width: 11px;
    height: 11px;
`;
const notificationContentCss = css`
    display: flex;
    align-items: center;
`;
const notificationTextCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.027em;
    margin-left: 8px;
    color: rgba(255, 255, 255, 0.69);
`;
const notificationActionCss = css`
    margin-left: auto;
    padding-right: 12px;
`;
const linkCss = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.03em;

    color: rgba(255, 255, 255, 0.43);

`;
export { StickyFooter };