import React from "react";
import { css } from "@emotion/react";
import { CrossIcon, CrusherHammerColorIcon, MiniCrossIcon } from "../icons";
import { shell } from "electron";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { getBuildReport } from "../commands/perform";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { useStore } from "react-redux";
import { getAppSettings } from "electron-app/src/store/selectors/app";

function Link({children, ...props}) {
    return(
        <span css={[linkStyle]} {...props}>
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

    font-weight: 500;
    font-size: 13px;
`;

export { Link };

function StatusMessageBar({isLoadingScreen}) {
    const [shouldShow, setShouldShow] = React.useState(false);
    const [testStatus, setTestStatus] = React.useState(null);
    const [buildId, setBuildId] = React.useState(null);
    const [testType, setTestType] = React.useState(null);

    const store = useStore();

    React.useEffect(() => {
        if(window["triggeredTest"]) {
            setShouldShow(true);
            setTestType(window["triggeredTest"].type);
        }

        window["messageBarCallback"] = (buildId) => { setShouldShow(false); window["triggeredTest"]={id: buildId}; setShouldShow(true); };

        return () => {
            window["messageBarCallback"] = null;
        }
    });

    React.useEffect(() => {
        if(shouldShow) {
            const buildId = window["triggeredTest"].id;
            if(!isLoadingScreen) {
                window["triggeredTest"] = null;
                setBuildId(buildId);
                return;
            }
            setBuildId(buildId);
            const interval = setInterval(() => {
                getBuildReport(buildId).then(res => {
                    setTestStatus(res.status);
                    if(res.status != "RUNNING") {
                        clearInterval(interval);
                    }
                });
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }, [shouldShow]);
    const handleViewReport = React.useCallback(() => {
        const appSettings = getAppSettings(store.getState() as any);
        shell.openExternal(resolveToFrontEndPath("/app/build/" +buildId, appSettings.frontendEndPoint));
    }, [buildId]);

    const handleClose = () => {
        setShouldShow(false);
        setTestStatus(null);
        setBuildId(null);
    }

    if(!shouldShow) return null;

    return (
        <div css={statusMessageBarContainerStyle}>
            <div css={statusMessageBarInnerContainerStyle}>
                <div css={statusMessageBarLeftStyle}>
                    <CliIcon css={statusCliIconStyle}/>
                    <span css={statusTextStyle}>Last test: {testStatus || (testType === "local" ? "Completed" : "Queued")}</span>
                </div>
                <div css={statusMessageBarRightStyle}>
                    {/* <Link css={statusLinkStyle}>Logs</Link> */}
                    {testStatus  !== "RUNNING" && testStatus ?  (<Link css={statusLinkStyle} onClick={handleViewReport}>View Report</Link>) : ""}
                    <MiniCrossIcon onClick={handleClose} css={css`width: 10px; height: 12px; :hover { opacity: 0.8 }`}/>
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
text-transform: capitalize;
`;

function ModelContainerLayout({children, title, footer, className, isLoadingScreen, ...props}) {
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
                        <CrusherHammerColorIcon css={[logoStyle, process.platform !== "darwin" ? css`margin-left: 0px;` : undefined]}/>
                        <DropdownIconSVG/>
                    </div>
                </div>
                <div css={mainTitleContainerStyle}>
                    {title}
                </div>
                <div css={rightNavStyle}>
                <Link onClick={handleOpenAppClick} css={[css` margin-right: 12rem;`,topLinkStyle]}>docs</Link>
                    <Link onClick={handleOpenAppClick} css={topLinkStyle}>Open app <ExternalLink css={ css`margin-left: 8rem; margin-top: -2px; zoom: .95;`}/></Link>
                </div>
            </div>
            <div css={contentStyle} className={className}>
                {children}
            </div>
            <div css={footerStyle}>
                {footer}
            </div>
           <StatusMessageBar isLoadingScreen={isLoadingScreen} />
        </div>
    )
}

const topLinkStyle = css`

font-size: 12.8rem;
font-weight: 400;
color: #e8e8e8;
display: flex; align-items: center;

:hover{
    color: #aa83ff;
    path{
        fill: #aa83ff;
    }
}
`


function ExternalLink(props) {
    return (
      <svg
        width={10}
        height={10}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M3.889 1.667v1.11H1.11V8.89h6.111V6.11h1.111v3.333a.556.556 0 01-.555.556H.556A.556.556 0 010 9.444V2.222a.556.556 0 01.556-.555h3.333zM10 0v4.444H8.889V1.896l-4.33 4.33-.785-.785 4.329-4.33H5.556V0H10z"
          fill="#fff"
        />
      </svg>
    );
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
    gap:8rem;
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

    font-size: 13rem;

    display: flex;
    align-items: center;
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
    padding: 12px 28px;
    display: flex;
`;
const headerStyle = css`
    display: flex;
    padding: 12px 28px;
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