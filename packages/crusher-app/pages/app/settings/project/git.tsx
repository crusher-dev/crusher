import React from "react";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { ProjectGitIntegrations } from "@ui/containers/settings/projectGitIntegrations";
import { _getUserConnectionsList } from "@services/v2/github";
import { setUserLoginConnections } from "@redux/actions/user";
import { iPageContext } from "@interfaces/pageContext";
import { getUserLoginConnections } from "@redux/stateUtils/user";
import { useSelector } from "react-redux";

const ProjectGit = () => {
	const userConnections = useSelector(getUserLoginConnections);

	return (
		<>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader
					title={"Git integrations"}
					desc={"List of all git integrations in current project"}
				/>
				<div css={mainContainerCSS}>
					<ProjectGitIntegrations
						userConnections={userConnections}
						connectedGitIntegrations={[]}
					/>
				</div>
			</SettingsContent>
		</>
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

ProjectGit.getInitialProps = async (ctx: iPageContext) => {
	const { res, store } = ctx;
	try {
		const userConnections = await _getUserConnectionsList(ctx.metaInfo.headers);
		store.dispatch(setUserLoginConnections(userConnections));
		return {};
	} catch (ex) {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(ProjectGit));
