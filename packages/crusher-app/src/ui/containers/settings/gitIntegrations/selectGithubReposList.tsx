import { useSelector } from "react-redux";
import { getLinkedGithubRepos, getReposForSelectedInstallation, getSelectedGithubInstallationOption } from "@redux/stateUtils/github";
import React, { useMemo } from "react";
import { Conditional } from "@ui/components/common/Conditional";
import { css } from "@emotion/core";
import { getRelativeSize } from "@utils/styleUtils";
import { SelectGithubRepoItem } from "@ui/containers/settings/gitIntegrations/selectGithubRepoItem";

interface iSelectGithubReposListProps {
	searchFilter: string;
}

const SelectGithubReposList = (props: iSelectGithubReposListProps) => {
	const { searchFilter } = props;

	const selectedGithubInstallationRepos = useSelector(getReposForSelectedInstallation);

	const selectedOrgInstallation = useSelector(getSelectedGithubInstallationOption);

	const linkedGithubRepos = useSelector(getLinkedGithubRepos);

	const selectedGithubInstallationsOut = useMemo(() => {
		if (selectedGithubInstallationRepos?.length) {
			return selectedGithubInstallationRepos
				.filter((repo) => {
					return searchFilter.trim().length > 0 ? repo.name.toLowerCase().includes(searchFilter.toLowerCase()) : true;
				})
				.map((repo) => {
					const linkedRepo = linkedGithubRepos.find((linkedRepo) => {
						return linkedRepo.repoId === repo.id;
					});

					return (
						<SelectGithubRepoItem
							installationId={selectedOrgInstallation.value}
							key={repo.id}
							isLinked={!!linkedRepo}
							linkedIntegrationId={linkedRepo ? linkedRepo._id : null}
							item={repo}
						/>
					);
				});
		}
		return null;
	}, [selectedGithubInstallationRepos, searchFilter, linkedGithubRepos]);

	return (
		<div css={githubReposListContainerCSS}>
			<Conditional If={!selectedGithubInstallationsOut}>
				<div css={loadingContainerCSS}>
					<img src={"/svg/settings/loader.svg"} css={loaderIconCSS} />
					<div css={loadingTextCSS}>Loading</div>
				</div>
			</Conditional>
			<Conditional If={!!selectedGithubInstallationsOut}>
				<ul css={githubReposListCSS}>{selectedGithubInstallationsOut}</ul>
			</Conditional>
		</div>
	);
};

const loadingContainerCSS = css`
	min-height: 21rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-left: 1px solid #eaeaea;
	border-right: 1px solid #eaeaea;
`;
const loaderIconCSS = css`
	width: 2.5rem;
`;
const loadingTextCSS = css`
	margin-top: 0.25rem;
	font-weight: 600;
`;
const githubReposListContainerCSS = css`
	border-top: 1px solid #eaeaea;
	border-bottom: 1px solid #eaeaea;
	border-radius: ${getRelativeSize(5)}rem;
	margin-top: ${getRelativeSize(16)}rem;
	max-height: 21rem;
	overflow-y: scroll;
	background: #fff;
	&::-webkit-scrollbar {
		display: none;
	}
`;
const githubReposListCSS = css`
	max-height: 21rem;
	overflow-y: scroll;
`;

export { SelectGithubReposList };
