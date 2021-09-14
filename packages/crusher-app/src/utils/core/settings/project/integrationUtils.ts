export const convertToOrganisationInfo = (githubData) => {
	return githubData.data.installations.map((installation) => ({
		id: installation.id,
		name: installation.account.login,
	}));
};

export const getRepoData = (githubData, installationId) => {
	return githubData.data.repositories.map((repo) => ({
		repoId: repo.id,
		repoName: repo.name,
		repoLink: repo.html_url,
		installationId,
	}));
};
