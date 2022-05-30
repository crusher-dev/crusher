import React from "react";
import { css } from "@emotion/react";
import { CrusherHammerColorIcon } from "../icons";
import { shell } from "electron";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { getBuildReport } from "../commands/perform";

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

function StatusMessageBar() {
    const [shouldShow, setShouldShow] = React.useState(false);
    const [testStatus, setTestStatus] = React.useState(null);

    React.useEffect(() => {
        if(window["triggeredTest"]) {
            setShouldShow(true);
        }
    });

    React.useEffect(() => {
        if(shouldShow) {
            const buildId = window["triggeredTest"].id;
            window["triggeredTest"] = null;
            const interval = setInterval(() => {
                getBuildReport(buildId).then(res => {
                    setTestStatus(res.status);
                });
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [shouldShow]);
    const handleViewReport = () => {
        shell.openExternal("https://app.crusher.dev/report");
    };

    if(!shouldShow) return null;

    return (
        <div css={statusMessageBarContainerStyle}>
            <div css={statusMessageBarInnerContainerStyle}>
                <div css={statusMessageBarLeftStyle}>
                    <CliIcon css={statusCliIconStyle}/>
                    <span css={statusTextStyle}>Last test: {testStatus || ""}</span>
                </div>
                <div css={statusMessageBarRightStyle}>
                    {/* <Link css={statusLinkStyle}>Logs</Link> */}
                    <Link css={statusLinkStyle} onClick={handleViewReport}>View Report</Link>
                </div>
            </div>
        </div>
    );
}

const statusCliIconStyle = css`
    width: 12px;
    height: 12px;
`;

const statusMessageBarContainerStyle = css`
    transition: bottom 0.25s ease;
    position: relative;
    bottom: 0px
`;
const statusMessageBarInnerContainerStyle = css`
    display: flex;
    padding: 14px 24px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), #161617;
`;
const statusMessageBarLeftStyle = css`
    display: flex;
    align-items: center;
    gap: 16px;
`;
const statusMessageBarRightStyle = css`
    margin-left: auto;
    display: flex;
    gap: 16px;
`;


const statusLinkStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 13px;
letter-spacing: 0.03em;

color: #FFFFFF;

`;
const statusTextStyle = css`
font-family: Gilroy;
font-style: normal;
font-weight: 400;
font-size: 13px;
letter-spacing: 0.03em;
margin-top: 2px;
color: #FFFFFF;
`;

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
           <StatusMessageBar />
        </div>
    )
}

const CliIcon = (props) => (
    <svg
      viewBox={"0 0 11 11"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.533 0H1.467A1.42 1.42 0 0 0 .43.46C.155.756 0 1.156 0 1.572V9.43c0 .416.155.816.43 1.11.275.295.648.46 1.037.461h8.066a1.42 1.42 0 0 0 1.037-.46c.275-.295.43-.695.43-1.111V1.57c0-.416-.155-.816-.43-1.11A1.42 1.42 0 0 0 9.533 0Zm-7.7 5.5a.35.35 0 0 1-.212-.072.391.391 0 0 1-.134-.19.42.42 0 0 1-.006-.24.396.396 0 0 1 .123-.198L3.08 3.536 1.604 2.27a.413.413 0 0 1 .052-.651.35.35 0 0 1 .407.037L3.896 3.23a.39.39 0 0 1 .101.136.416.416 0 0 1-.101.477L2.063 5.414a.352.352 0 0 1-.23.086Zm3.667 0H4.033a.355.355 0 0 1-.259-.115.408.408 0 0 1-.107-.278c0-.104.038-.204.107-.278a.355.355 0 0 1 .26-.115H5.5c.097 0 .19.042.26.115a.408.408 0 0 1 .107.278.408.408 0 0 1-.108.278.355.355 0 0 1-.259.115Z"
        fill="#C2FF74"
      />
    </svg>
  )

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

    border: none;
    border-radius: 0px;
`;

export {  ModelContainerLayout };