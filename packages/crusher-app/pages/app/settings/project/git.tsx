import React from "react";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import { ProjectGitIntegrations } from "@ui/containers/settings/gitIntegrations/projectGitIntegrations";
import { _getLinkedGithubRepos, _getUserConnectionsList } from "@services/v2/github";
import { setUserLoginConnections } from "@redux/actions/user";
import { iPageContext } from "@interfaces/pageContext";
import { getUserLoginConnections } from "@redux/stateUtils/user";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { saveLinkedGithubRepos } from "@redux/actions/github";

const ProjectGit = () => {
	const userConnections = useSelector(getUserLoginConnections);

	return (
		<>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader title={"Git integrations"} desc={"List of all git integrations in current project"} />
				<div css={mainContainerCSS}>
					<ProjectGitIntegrations userConnections={userConnections} />
				</div>
			</SettingsContent>
		</>
	);
};

const settingContentCSS = css`
	width: ${684 / PIXEL_REM_RATIO}rem;
`;
const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: ${547 / PIXEL_REM_RATIO}rem;
`;

ProjectGit.getInitialProps = async (ctx: iPageContext) => {
	const { res, store } = ctx;
	try {
		const selectedProject = getSelectedProject(store.getState());
		const userConnectionsPromise = _getUserConnectionsList(ctx.metaInfo.headers);
		const linkedGithubReposPromise = _getLinkedGithubRepos(selectedProject, ctx.metaInfo.headers);
		const [userConnections, linkedGithubRepos] = (await Promise.all([userConnectionsPromise, linkedGithubReposPromise])) as any;
		store.dispatch(setUserLoginConnections(userConnections));
		store.dispatch(saveLinkedGithubRepos(linkedGithubRepos));
		return {};
	} catch {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(ProjectGit));
