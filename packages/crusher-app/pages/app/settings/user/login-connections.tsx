import React from "react";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { getGithubOAuthURL } from "@utils/github";
import { iPageContext } from "@interfaces/pageContext";
import { _getUserConnectionsList } from "@services/v2/github";
import { setUserLoginConnections } from "@redux/actions/user";
import { getUserLoginConnections } from "@redux/stateUtils/user";
import { useSelector } from "react-redux";
import { UserConnectionsList } from "@ui/components/settings/UserConnectionsList";

interface iButtonProps {
	onClick?: () => void;
}
const ConnectWithGithub = (props: iButtonProps) => {
	const { onClick } = props;

	return (
		<div css={buttonCSS} onClick={onClick}>
			Connect With Github
		</div>
	);
};

const buttonCSS = css`
	background: #5286ff;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	padding: ${8 / PIXEL_REM_RATIO}rem ${8 / PIXEL_REM_RATIO}rem;
	min-width: ${180 / PIXEL_REM_RATIO}rem;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	font-weight: 600;
	font-family: Gilroy;
	color: #fff;
	text-align: center;
`;

const LoginConnections = () => {
	const userLoginConnections = useSelector(getUserLoginConnections);

	const connectWithGithub = () => {
		window.open(getGithubOAuthURL());
	};

	return (
		<SettingsContent contentCSS={settingContentCSS}>
			<SettingsContentHeader
				title={"Login Connections"}
				desc={"Link your account to third party services for authentication"}
				button={<ConnectWithGithub onClick={connectWithGithub} />}
			/>
			<div css={mainContainerCSS}>
				<UserConnectionsList items={userLoginConnections} />
			</div>
		</SettingsContent>
	);
};

const settingContentCSS = css`
	width: ${720 / PIXEL_REM_RATIO}rem;
`;
const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: ${547 / PIXEL_REM_RATIO}rem;
`;

LoginConnections.getInitialProps = async (ctx: iPageContext) => {
	const { res, store } = ctx;
	try {
		const userConnections = await _getUserConnectionsList(ctx.metaInfo.headers);
		store.dispatch(setUserLoginConnections(userConnections));
		return {};
	} catch {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(LoginConnections));
