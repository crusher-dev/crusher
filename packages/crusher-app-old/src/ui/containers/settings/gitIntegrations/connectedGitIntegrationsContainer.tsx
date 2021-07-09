import { useSelector } from "react-redux";
import { getLinkedGithubRepos } from "@redux/stateUtils/github";
import { iGithubIntegration } from "@crusher-shared/types/mongo/githubIntegration";
import { Conditional } from "@ui/components/common/Conditional";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import React from "react";
import { css } from "@emotion/core";
import { ConnectedGitIntegrationListItem } from "@ui/containers/settings/gitIntegrations/connectedGitIntegrationItem";

const ConnectedGitIntegrationsContainer = () => {
	const connectedGitIntegrations = useSelector(getLinkedGithubRepos);
	const showConnectedGitIntegration = connectedGitIntegrations.length;

	if (!showConnectedGitIntegration) return null;

	const connectedGitIntegrationsOut = connectedGitIntegrations.map((integration: iGithubIntegration) => {
		return <ConnectedGitIntegrationListItem key={integration._id} item={integration}></ConnectedGitIntegrationListItem>;
	});
	return (
		<div css={connectedGitIntegrationsContainerCSS}>
			<Conditional If={showConnectedGitIntegration}>
				<SettingsContentHeader title={"Linked Git integrations"} />
				<ul css={connectedGitIntegrationsListCSS}>{connectedGitIntegrationsOut}</ul>
			</Conditional>
		</div>
	);
};

const connectedGitIntegrationsContainerCSS = css`
	margin-top: 2rem;
`;
const connectedGitIntegrationsListCSS = css`
	margin-top: 2rem;
`;

export { ConnectedGitIntegrationsContainer };
