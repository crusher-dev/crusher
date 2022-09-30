import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../../layout/CompactAppLayout";
import { Footer } from "../../../layout/Footer";

import { LoadingIconV2 } from "electron-app/src/_ui/constants/old_icons";

import { loginUserToCloud } from "../../../../utils/login";

import { focusOnWindow, performGoToUrl } from "electron-app/src/_ui/commands/perform";
import { shell } from "electron";
import { resolveToFrontend } from "electron-app/src/utils/url";
import { useStore } from "react-redux";

const WaitingForLogin = () => {
	return (
		<div css={waitingContainerCss}>
			<span css={waitingTextCss}>Waiting for you to finish</span>
			<LoadingIconV2 css={waitingIconCss} />
		</div>
	);
};

const LoginScreen = () => {
	const store = useStore();
	const [isWaitingForLogin, setIsWaitingForLogin] = React.useState(false);

	const handlePostLogin = React.useCallback(() => {
		focusOnWindow();
		performGoToUrl("/");
	}, []);

	const handleLogin = React.useCallback(async () => {
		const { loginKey } = await loginUserToCloud(handlePostLogin, store);
		setIsWaitingForLogin(true);

		const loginUrl = resolveToFrontend("/login_sucessful?lK=" + loginKey);
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
					<div css={loginButtonCss} onClick={handleLogin}>
						login
					</div>
				</div>
				{isWaitingForLogin ? <WaitingForLogin /> : ""}
			</div>
		</CompactAppLayout>
	);
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

const layoutCss = css`
	padding-top: 0rem;
`;

const headingCss = css`
	font-family: Cera Pro;

	font-weight: 700;
	font-size: 16rem;

	color: #ffffff;
`;
const descriptionCss = css`
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
`;

const loginButtonCss = css`
	background: linear-gradient(0deg, #933eff, #933eff), #4d4d4d;
	border: 1px solid rgba(114, 114, 114, 0.4);
	border-radius: 8px;
	padding: 6rem;
	width: 125rem;

	font-weight: 600;
	font-size: 14rem;

	color: #ffffff;
	display: flex;
	justify-content: center;
	:hover {
		opacity: 0.8;
	}
`;

export { LoginScreen };
