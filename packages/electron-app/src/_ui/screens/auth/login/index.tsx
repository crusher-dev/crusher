import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../../layout/CompactAppLayout";
import { Footer } from "../../../layout/Footer";
import { GithubButton } from "../../../components/buttons/GithubButton";
import { GitlabButton } from "../../../components/buttons/GitlabButton";
import { LoadingIconV2 } from "electron-app/src/ui/icons";
import { LinkBox } from "../../../components/LinkBox";
import { loginUserToCloud } from "../../../utils/login";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { focusOnWindow } from "electron-app/src/ui/commands/perform";
import { shell } from "electron";
import { resolveToFrontend } from "electron-app/src/utils/url";
import { Navigate, useNavigate } from "react-router-dom";

const WaitingForLogin = () => {
    return (
        <div css={waitingContainerCss}>
			<span css={waitingTextCss}>Waiting for you to finish</span>
			<LoadingIconV2 css={waitingIconCss} />
		</div>
    );
};

const LoginScreen = () => {
    const navigate = useNavigate();
	const [isWaitingForLogin, setIsWaitingForLogin] = React.useState(false);
	
	const handlePostLogin = React.useCallback((userInfo: string) => {
		focusOnWindow();
		navigate("/");
	}, []);

    const handleLogin = React.useCallback(async ()=> {
        const { loginKey } = await loginUserToCloud(handlePostLogin);
		setIsWaitingForLogin(true);

		const loginUrl = resolveToFrontend("?lK=" + loginKey);
		shell.openExternal(loginUrl);
    }, []);

    return (
        <CompactAppLayout css={layoutCss} footer={<Footer />}>
            <div css={contentCss}>
				<div css={headerCss}>
					<div css={headingCss}>Login to continue</div>
					<div css={descriptionCss}>This to save report, run test.</div>
				</div>
				<div css={actionsContainerCss}>
					<div css={loginButtonCss} onClick={handleLogin}>login</div>
				</div>
				{isWaitingForLogin ? (<WaitingForLogin/>) : ""}
			</div>
        </CompactAppLayout>
    )
};

const waitingContainerCss = css`
    margin-top: 34rem;
    display: flex;
    align-items: center;
    gap: 14rem;
`;
const waitingTextCss = css`
    font-size: 14rem;
    color: #565657;
`;
const waitingIconCss = css`
    width: 20rem;
    height: 20rem;
`;

const loginBoxCss = css`width: 220rem;`;
const linkcontainerCss = css`
    margin-top: 68rem;
	display: flex;
	align-items: center;
	gap: 22rem;
`;
const layoutCss = css`
    padding-top: 0rem;
`;

const openThisLinkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	letter-spacing: -0.0032em;

	color: #9c9c9c;
`;

const headingCss = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 700;
	font-size: 16rem;

	color: #ffffff;
`;
const descriptionCss = css`
	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;
	text-align: center;
	letter-spacing: -0.0032em;

	color: #565657;
	margin-top: 8rem;
`;
const contentCss = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 160rem;
	flex: 1;
	height: 100%;
`;
const headerCss = css`
    text-align: center;
`;
const actionsContainerCss = css`
    display: flex;
    gap: 22rem;
    margin-top: 18rem;
`

const loginButtonCss = css`
	background: linear-gradient(0deg, #933EFF, #933EFF), #4D4D4D;
	border: 1px solid rgba(114, 114, 114, 0.4);
	border-radius: 8px;
	padding: 6rem;
	width: 125rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;

	color: #FFFFFF;
	display: flex;
	justify-content: center;
	:hover {
		opacity: 0.8;
	}
`;

export { LoginScreen }