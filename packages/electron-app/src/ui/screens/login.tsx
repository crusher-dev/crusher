import React from "react";
import { css } from "@emotion/react";
import { CrusherHammerColorIcon, CrusherIcon, GithubIcon, LoadingIcon, LoadingIconV2 } from "../icons";
import { Button } from "@dyson/components/atoms/button/Button";
import { useNavigate } from "react-router-dom";
import { ipcRenderer, shell } from "electron";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { waitForUserLogin } from "electron-app/src/utils";
import { focusOnWindow, saveAndGetUserInfo } from "../commands/perform";
import { sendSnackBarEvent } from "../components/toast";
import { useSelector } from "react-redux";
import { getAppSettings } from "electron-app/src/store/selectors/app";

const GithubButton = (props) => {
	return (<Button
						id={"verify-save-test"}
						onClick={(e) => {
							e.preventDefault();
						}}
						bgColor="tertiary-outline"
						css={githubButtonStyle}
                        {...props}
					>
                        <GithubIcon css={css`width: 18rem; margin-left: 2rem;`}/>
                        <span css={buttonTextStyle}>Github</span>
	</Button>);
};

const GitlabButton = (props) => {
	return (<Button
						id={"verify-save-test"}
						onClick={(e) => {
							e.preventDefault();
						}}
						bgColor="tertiary-outline"
						css={gitlabButtonStyle}
                        {...props}
					>
                        <GithubIcon css={css`width: 18rem;`}/>
                        <span css={buttonTextStyle}>Gitlab</span>
	</Button>);
};

const LinkBox = ({value, ...props}) => {
    const ref = React.useRef(null);

    const handleOnClick = () => {
        ref.current.select();
        document.execCommand('copy');
        sendSnackBarEvent({ type: "success", message: `Copied to clipbaord!` });
    };
    return (
        <div css={linkContainerStyle} onClick={handleOnClick} {...props}>
            <input ref={ref} css={css`background: transparent; border: none; outline: none; width: 100%;`} type={"text"} value={value}/>
        </div>
    )
};

const linkContainerStyle = css`
background: rgba(0, 0, 0, 0.2);
border: 1px solid rgba(255, 255, 255, 0.13);
border-radius: 6px;
padding: 12rem 18rem;

font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 11rem;


color: #888888;
`;

const buttonTextStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 700;
font-size: 14rem;
text-align: center;
letter-spacing: -0.0032em;

color: #FFFFFF;
margin-left: auto;
    margin-right: 12rem;
`;
const githubButtonStyle = css`
box-sizing: content-box;

height: 38rem;
width: 112rem;
display: flex;
align-items: center;
background: linear-gradient(133.85deg, #905CFF 25.39%, #6D55FF 74.5%, #6951FF 74.5%);border-radius: 6rem;
font-family: Gilroy;
font-style: normal;
font-weight: normal;
font-size: 14rem;
line-height: 17rem;
color: #ffffff;
border: none;
:hover {
    background: linear-gradient(133.85deg, #905CFF 25.39%, #6D55FF 74.5%, #6951FF 74.5%);
    opacity: 0.8;
    border: none;

}
`;
const gitlabButtonStyle = css`
box-sizing: content-box;
height: 40rem;
width: 112rem;
display: flex;
align-items: center;
background: linear-gradient(0deg, #0B0B0D, #0B0B0D), linear-gradient(133.85deg, #905CFF 25.39%, #6D55FF 74.5%, #6951FF 74.5%);
border: 0.5rem solid rgba(70, 76, 87, 0.45);
border-radius: 6rem;
font-family: Gilroy;
font-style: normal;
font-weight: normal;
font-size: 14rem;
line-height: 17rem;
color: #ffffff;
:hover {
    background: linear-gradient(0deg, #0B0B0D, #0B0B0D), linear-gradient(133.85deg, #905CFF 25.39%, #6D55FF 74.5%, #6951FF 74.5%);
    border: 0.5px solid rgba(70, 76, 87, 0.45);
    opacity: 0.8;
}
`;
function LoginScreen() {
    let navigate = useNavigate();
    const appSettings = useSelector(getAppSettings);
	const [backendEndPoint, setBackendEndPoint] = React.useState(appSettings.backendEndPoint || "");
	const [frontendEndPoint, setFrontendEndPoint] = React.useState(appSettings.frontendEndPoint || "");
    const [interval, setInterval] = React.useState(null);
    const [loginText, setLoginText] = React.useState("");

    const handlePostLogin = () => { 
        navigate("/");
    };

    
    React.useEffect(() => {
        document.querySelector("html").style.fontSize = "1px";
    }, []);
    React.useEffect(() => {
        waitForUserLogin((loginToken: string) => {
            setInterval(null);
			saveAndGetUserInfo(loginToken).then((info) => {
				focusOnWindow();
				sendSnackBarEvent({ type: "success", message: `Login successful! Welcome, ${info.name}` });
                handlePostLogin();
			});
		}, backendEndPoint).then(async ( { loginKey, interval : intervalMain }) => {
            setInterval(interval);
            setLoginText(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
        });
    }, []);

    const handleLoginWithGithub = React.useCallback(async () => {
        if(interval) {
            clearInterval(interval);
            setInterval(null);
        }
        const { loginKey, interval: intervalMain } = await waitForUserLogin((loginToken: string) => {
            setInterval(null);

			saveAndGetUserInfo(loginToken).then((info) => {
				focusOnWindow();
				sendSnackBarEvent({ type: "success", message: `Login successful! Welcome, ${info.name}` });
                handlePostLogin();
			});
		}, backendEndPoint);
        setInterval(intervalMain);
        setLoginText(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
		await shell.openExternal(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
    }, [interval]);

    const handleLoginWithGitlab = React.useCallback(async () => {
        if(interval) {
            clearInterval(interval);
            setInterval(null);
        }
        const { loginKey, interval : intervalMain } = await waitForUserLogin((loginToken: string) => {
            setInterval(null);
			saveAndGetUserInfo(loginToken).then((info) => {
				focusOnWindow();
				sendSnackBarEvent({ type: "success", message: `Login successful! Welcome, ${info.name}` });
                handlePostLogin();
			});
		}, backendEndPoint);
        setInterval(intervalMain);
        setLoginText(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
		await shell.openExternal(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
    }, [interval]);

    return (
        <div css={containerStyle}>
            <div css={contentStyle}>
                <div>
                    <CrusherHammerColorIcon css={css`width: 23rem; height: 23rem;`}/>
                </div>
                <div css={mainContentStyle}>
                    <div css={css`text-align: center;`}>
                        <div css={headingStyle}>Login to continue</div>
                        <div css={descriptionStyle}>This to save report, run test.</div>
                    </div>
                    <div css={css`display: flex; gap: 22rem; margin-top: 46rem;`}>
                        <GithubButton onClick={handleLoginWithGithub}/>
                        <GitlabButton onClick={handleLoginWithGitlab}/>
                    </div>
                    {interval && (
                        <div css={css`margin-top: 34rem; display: flex; align-items: center; gap: 14rem;`}>
                            <span css={css`font-size: 14rem; color: #565657;`}>Waiting for you to finish</span>
                            <LoadingIconV2 css={css`width: 20rem; height: 20rem;`} />
                        </div>
                    )}
                
                    <div css={css`margin-top: 68rem; display: flex; align-items: center; gap: 22rem;`}>
                        <span css={openThisLinkStyle}>or open this link</span>
                        <LinkBox value={loginText} css={css`width: 220rem;`}>
                           
                        </LinkBox>
                    </div>
                </div>
            </div>
            <div css={footerStyle}>
                <div css={navBarStyle}>
                    <div className={"navItem"} onClick={ () => {}}>Docs</div>
                    <div className="navItem" css={css`margin-left: auto`}>
                        Settings
                    </div>
                </div>
            </div>
        </div>
    )
}

const openThisLinkStyle = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 12px;
letter-spacing: -0.0032em;

color: #9C9C9C;
`;

const headingStyle = css`
font-family: Cera Pro;
font-style: normal;
font-weight: 700;
font-size: 16rem;

color: #FFFFFF;
`;
const descriptionStyle = css`
font-family: Gilroy;
font-style: normal;
font-weight: 400;
font-size: 12rem;
text-align: center;
letter-spacing: -0.0032em;

color: #565657;
margin-top: 8rem;

`;
const mainContentStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
`;
const contentStyle = css`
    flex: 1;
    padding: 38rem 44rem;
    display: flex;
    flex-direction: column;
`;
const navBarStyle = css`
display: flex;
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 16rem;

color: #FFFFFF;
.navItem {
    :hover {
        opacity: 0.8;
    }
}
`;

const footerStyle = css`
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20rem 28rem;
`;

const containerStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 100%;
    height: 100%;
    background: #161617;
    border-radius: 16rem;
    border: 1px solid rgba(255, 255, 255, 0.08);

    display: flex;
    flex-direction: column;
`;

const statusTextStyle = css`
    margin-top: 24rem;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 16rem;
    color: #FFFFFF;
`;

export { LoginScreen };