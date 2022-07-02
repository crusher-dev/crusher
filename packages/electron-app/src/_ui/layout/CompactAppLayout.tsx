import React from "react";
import { css } from "@emotion/react";
import { Link } from "../components/Link";
import { ExternalLinkIcon } from "electron-app/src/ui/icons";
import { shell } from "electron";

const CompactAppLayout = ({ className, title, footer, children, ...props } : { className?: any; title?: any; footer?: any; children: any}) => {
    const handleOpenDocs = React.useCallback(() => shell.openExternal("https://docs.crusher.dev"), []);
    const handleOpenApp = React.useCallback(() => shell.openExternal("https://app.crusher.dev"), []);

    return (
        <div className={`${className}`} css={containerCss} {...props}>
            <div css={dragCss} className={"drag"}></div>
            <div css={headerCss} className={"header"}>
                <div css={headerLeftSectionCss}></div>
                <div css={titleCss} className={"header-title"}>{title}</div>
                <div css={headerRightSectionCss}>
                    <Link onClick={handleOpenDocs}>Docs</Link>
                    <Link onClick={handleOpenApp}>
                        Open app {" "}
                        <ExternalLinkIcon css={externalLinkIconCss}/>
                    </Link>
                </div>
            </div>

            <div css={contentCss} className={"content-section"}>
                {children}
            </div>

            {footer ? (<div css={footerCss}>{footer}</div>) : ""}
        </div>
    );
};

const containerCss = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: #161617;
    transition: width 0.3s, height 0.3s;
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    border: none;
    border-radius: 0px;
`;

const dragCss = css`
    height: 18px;
    width: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
`;

const headerCss = css`
    display: flex;
    padding: 12px 28px;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
    z-index: 23424234324234234;
`;

const headerLeftSectionCss = css`
	position: relative;
	top: 50%;
	transform: translateY(-50%);
`;

const titleCss = css`
	flex: 1;
	display: flex;
	justify-content: center;
	padding-top: 3rem;
`;
const headerRightSectionCss = css`
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding-bottom: 1rem;

    font-size: 13rem;

    display: flex;
    align-items: center;
`;
const externalLinkIconCss = css`
    margin-left: 4rem;
	margin-top: -2px;
	zoom: 0.95;
`;
const contentCss = css`
    flex: 1;
    padding-top: 18px;
    overflow-y: overlay;
    ::-webkit-scrollbar {
        background: transparent;
        width: 8rem;
    }
    ::-webkit-scrollbar-thumb {
        background: white;
        border-radius: 14rem;
    }
`;
const footerCss = css`
	margin-top: auto;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	padding: 12rem 24rem;
	display: flex;
`;

export { CompactAppLayout };