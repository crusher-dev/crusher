import React from "react";
import { css } from "@emotion/react";
import { CrusherHammerColorIcon } from "../icons";
import { shell } from "electron";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { useNavigate } from "react-router-dom";

function Link({children, ...props}) { 
    return(
        <span css={linkStyle} {...props}>
            {children}
        </span>
    )
}

const linkStyle = css`
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: #FFFFFF;
    :hover {opacity: 0.8}
`;

export { Link };

function ModelContainerLayout({children, title, footer, className, ...props}) {
    const navigate = useNavigate();

    const handleOpenAppClick = React.useCallback(() => {
        shell.openExternal("https://app.crusher.dev");
    }, []);

    const handleDropdownClick = () => {
        return navigate("/select-project");
    };

    return (
        <div css={containerStyle} {...props}>
            <div css={dragStyle} className={"drag"}></div>
            <div css={headerStyle}>
                <div css={leftNavBarStyle}>
                    <div css={crusherDropdownContainerStyle} onClick={handleDropdownClick}>
                        <CrusherHammerColorIcon css={logoStyle}/>
                        <DropdownIconSVG/>
                    </div>
                </div>
                <div css={mainTitleContainerStyle}>
                    {title}
                </div>
                <div css={rightNavStyle}>
                    <Link onClick={handleOpenAppClick}>Open App</Link>
                </div>
            </div>
            <div css={contentStyle} className={className}>
                {children}
            </div>
            <div css={footerStyle}>
                {footer}
            </div>
        </div>
    )
}

const crusherDropdownContainerStyle = css`
    display: flex;
    gap: 16rem;
    align-items: center;
    :hover {
        opacity: 0.8;
    }
`;

const logoStyle = css`
    width: 23px;
    height: 23px;
    margin-left: 50px;
`;

const rightNavStyle = css`
    position: relative;
    top: 50%;
    transform: translateY(-50%);
`;
const leftNavBarStyle = css`
    position: relative;
    top: 50%;
    transform: translateY(-50%);
`;

const dragStyle = css`
    height: 18px;
    width: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
`;
const contentStyle = css`
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
const footerStyle = css`
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px 28px;
    display: flex;
`;
const headerStyle = css`
    display: flex;
    padding: 20px 47px;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

`;

const mainTitleContainerStyle = css`
    flex: 1;
    display: flex;
    justify-content: center;
`;

const containerStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 100%; height: 100%;
    background: #161617;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: width 0.3s, height 0.3s;
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
`;

export {  ModelContainerLayout };