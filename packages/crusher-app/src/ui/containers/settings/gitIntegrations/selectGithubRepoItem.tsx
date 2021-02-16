import { getSelectedProject } from "@redux/stateUtils/projects";
import { store } from "@redux/store";
import { _linkGithubRepo, _unlinkGithubRepo } from "@services/v2/github";
import { Toast } from "@utils/toast";
import {
	addLinkedGithubRepoInList,
	removeLinkedGithubRepoInList,
} from "@redux/actions/github";
import { Conditional } from "@ui/components/common/Conditional";
import { css } from "@emotion/core";
import { getRelativeSize } from "@utils/styleUtils";
import React from "react";

const SelectGithubRepoItem = (props: any) => {
	const { item, installationId, isLinked, linkedIntegrationId } = props;

	const handleRepoConnect = () => {
		const selectedProject = getSelectedProject(store.getState());
		_linkGithubRepo({
			projectId: selectedProject,
			repoId: item.id,
			repoName: item.full_name,
			repoLink: item.svn_url,
			installationId: installationId,
		}).then((integration) => {
			Toast.showSuccess("Linked to github repo successfully");
			store.dispatch(addLinkedGithubRepoInList(integration));
		});
	};

	const handleRepoDisconnect = () => {
		_unlinkGithubRepo(linkedIntegrationId).then(() => {
			Toast.showSuccess("Unlinked repo successfully");
			store.dispatch(removeLinkedGithubRepoInList(linkedIntegrationId));
		});
	};

	return (
		<li css={githubReposListItemContainerCSS}>
			<img src={item.owner.avatar_url} css={githubRepoItemAvatarCSS} />
			<span css={githubItemRepoNameCSS}>{item.name}</span>
			<Conditional If={isLinked}>
				<button css={githubRepoItemConnectButtonCSS} onClick={handleRepoDisconnect}>
					Disconnect
				</button>
			</Conditional>
			<Conditional If={!isLinked}>
				<button css={githubRepoItemConnectButtonCSS} onClick={handleRepoConnect}>
					Connect
				</button>
			</Conditional>
		</li>
	);
};

const githubReposListItemContainerCSS = css`
	border: 1px solid #eaeaea;
	padding: ${getRelativeSize(16)}rem;
	display: flex;
	align-items: center;
`;
const githubRepoItemAvatarCSS = css`
	height: 1.75rem;
	border-radius: 1rem;
`;
const githubItemRepoNameCSS = css`
	margin-left: 1rem;
	font-weight: 500;
`;
const githubRepoItemConnectButtonCSS = css`
	font-size: ${getRelativeSize(13)}rem;
	margin-left: auto;
	background: #6583fe;
	padding: ${getRelativeSize(6)}rem ${getRelativeSize(16)}rem;
	border-radius: ${getRelativeSize(6)}rem;
	color: #fff;
	cursor: pointer;
`;

export { SelectGithubRepoItem };
