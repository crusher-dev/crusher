import React from "react";
import { css } from "@emotion/core";
import { Conditional } from "@ui/components/common/Conditional";
import WarningIcon from "../../../../svg/warning.svg";
import { useSelector } from "react-redux";
import { getUserLoginConnections } from "@redux/stateUtils/user";
import { ConnectedGitIntegrationsContainer } from "@ui/containers/settings/gitIntegrations/connectedGitIntegrationsContainer";
import { SelectGithubRepoContainer } from "@ui/containers/settings/gitIntegrations/selectGithubRepoContainer";
import { getRelativeSize } from "@utils/styleUtils";

const ProjectGitIntegrations = () => {
	const userConnections = useSelector(getUserLoginConnections);
	const showLinkGithub = !userConnections.length;
	const showSelectRepoGithub = userConnections.length;

	return (
		<div css={containerCSS}>
			<Conditional If={showLinkGithub}>
				<div css={noLoginConnectionCSS}>
					<WarningIcon css={{ width: "1.25rem", height: "auto" }} />
					<span css={noLoginConnectionTextCSS}>
						{"Link your github account to link your repos"}
					</span>
					<a
						href={"/app/settings/user/login-connections"}
						css={noLoginConnectionLinkCSS}
					>
						Link
					</a>
				</div>
			</Conditional>
			<Conditional If={showSelectRepoGithub}>
				<SelectGithubRepoContainer userConnections={userConnections} />
			</Conditional>
			<ConnectedGitIntegrationsContainer />
		</div>
	);
};

const containerCSS = css`
	font-family: Gilroy;
`;
const noLoginConnectionCSS = css`
	display: flex;
	border: 1px solid #eaeaea;
	border-radius: ${getRelativeSize(6)}rem;
	padding: ${getRelativeSize(16)}rem ${getRelativeSize(20)}rem;
	align-items: center;
	font-size: ${getRelativeSize(16)}rem;
	color: rgb(102, 102, 102);

	font-weight: 600;
`;
const noLoginConnectionTextCSS = css`
	margin-left: ${getRelativeSize(24)}rem;
	margin-top: 0.2rem;
	flex: 1;
`;
const noLoginConnectionLinkCSS = css`
	margin-left: auto;
	background: #0070f3;
	color: #fff;
	font-weight: 500;
	font-size: ${getRelativeSize(14)}rem;
	padding: ${getRelativeSize(4)}rem ${getRelativeSize(24)}rem;
	border-radius: ${getRelativeSize(4)}rem;
	&:hover {
		color: #fff;
		text-decoration-line: none !important;
	}
`;

export { ProjectGitIntegrations };
