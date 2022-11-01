import React, {useState, useEffect} from "react";
import { openPopup } from "@utils/common/domUtils";
import { getGithubOAuthURLLegacy } from "@utils/core/external";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { OctokitManager } from "@utils/core/external/ocktokit";
import { convertToOrganisationInfo, getRepoData } from "@utils/core/settings/project/integrationUtils";

export const connectedToGitAtom = atomWithImmer<
	| any
	| {
		token: string;
		type: "github";
		updateCount: number;
	}
>(null);

export const useGithubAuthorize = () => {
	const [, setConnectedGit] = useAtom(connectedToGitAtom);
	const onGithubClick = (alreadAuthorized: boolean = false) => {
		const windowRef = openPopup(getGithubOAuthURLLegacy(alreadAuthorized));

		const interval = setInterval(() => {
			const isOnFEPage = windowRef?.location?.href?.includes(window.location.host);
			if (isOnFEPage) {
				const url = windowRef?.location?.href;
				const token = url.split("token=")[1];
				windowRef.close();
				clearInterval(interval);
				setConnectedGit({
					type: "github",
					token,
				});
			}
		}, 50);
	};

	return { onGithubClick };
};



export const useGithubData = (gitInfo: any) => {
	const [selectedOrganisation, setSelectedOrganisation] = useState(null);

	const [repositories, setRepositoriesData] = useState([]);

	const [organisations, setOrganisation] = useState([]);

	useEffect(() => {
		(async () => {
			const ocktoKit = new OctokitManager(gitInfo.token);

			const organisation = await ocktoKit.getInstallationsUserCanAccess();
			const clinetSideOrganisation = convertToOrganisationInfo(organisation);

			setOrganisation(clinetSideOrganisation);
			const organisationId = clinetSideOrganisation[0].id;
			setSelectedOrganisation(organisationId);
		})();
	}, [gitInfo.token, gitInfo.updateCount]);

	useEffect(() => {
		(async () => {
			const ocktoKit = new OctokitManager(gitInfo.token);
			const repoData = await ocktoKit.getReposForInstallation(selectedOrganisation);

			setRepositoriesData(getRepoData(repoData, selectedOrganisation));
		})();
	}, [selectedOrganisation]);

	return {
		selectedOrganisation,
		setSelectedOrganisation,
		organisations,
		repositories,
	};
};
