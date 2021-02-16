import { iGithubIntegration } from "@crusher-shared/types/mongo/githubIntegration";
import { _unlinkGithubRepo } from "@services/v2/github";
import { Toast } from "@utils/toast";
import { store } from "@redux/store";
import { removeLinkedGithubRepoInList } from "@redux/actions/github";
import GithubIcon from "../../../../svg/github.svg";
import { css } from "@emotion/core";
import { getRelativeSize } from "@utils/styleUtils";
import React from "react";

interface iConnectedGitIntegrationListItemProps {
	item: iGithubIntegration;
}

const ConnectedGitIntegrationListItem = (
	props: iConnectedGitIntegrationListItemProps,
) => {
	const { item } = props;
	const unlinkLinkedGithubRepo = () => {
		_unlinkGithubRepo(item._id).then(() => {
			Toast.showSuccess("Unlinked repo successfully");
			store.dispatch(removeLinkedGithubRepoInList(item._id));
		});
	};

	return (
		<li css={connectedGitIntegrationItemContainerCSS}>
			<GithubIcon css={{ height: "1.5rem" }} />
			<a
				href={item.repoLink}
				target={"_blank"}
				rel={"noreferrer"}
				css={connectedGitIntegrationLinkCSS}
			>
				{item.repoName}
			</a>
			<div css={disconnectButtonCSS} onClick={unlinkLinkedGithubRepo}>
				Disconnect
			</div>
		</li>
	);
};

const disconnectButtonCSS = css`
	font-size: ${getRelativeSize(13)}rem;
	margin-left: auto;
	background: #6583fe;
	padding: ${getRelativeSize(6)}rem ${getRelativeSize(16)}rem;
	border-radius: ${getRelativeSize(6)}rem;
	color: #fff;
	cursor: pointer;
`;
const connectedGitIntegrationItemContainerCSS = css`
	border: 1px solid #eaeaea;
	background: #fff;
	padding: ${getRelativeSize(16)}rem;
	display: flex;
	align-items: center;
	border-radius: ${getRelativeSize(4)}rem;
	&:not(:first-child) {
		margin-top: 0.5rem;
	}
`;
const connectedGitIntegrationLinkCSS = css`
	margin-left: 1rem;
	color: rgb(0, 112, 243);
	font-weight: 600;
`;

export { ConnectedGitIntegrationListItem };
