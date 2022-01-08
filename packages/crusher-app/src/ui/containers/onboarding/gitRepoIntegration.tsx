import { css } from "@emotion/react";
import { usePageTitle } from "@hooks/seo";
import { onboardingStepAtom } from "@store/atoms/pages/onboarding";
import { GitSVG } from "@svg/onboarding";
import { GithubSVG } from "@svg/social";
import { openPopup } from "@utils/common/domUtils";
import { getGithubOAuthURL } from "@utils/core/external";
import { OctokitManager } from "@utils/core/external/ocktokit";
import { Button, Input } from "dyson/src/components/atoms";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { convertToOrganisationInfo, getRepoData } from "@utils/core/settings/project/integrationUtils";

import React from "react";

const projects = ["Github", "Crusher", "Test", "Github", "Crusher", "Test", "Github", "Crusher", "Test"];

const connectedToGitAtom = atomWithImmer<
	| any
	| {
			token: string;
			type: "github";
			updateCount: number;
	  }
	>(null);

const useGithubData = (gitInfo) => {
		const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);

		const [repositories, setRepositoriesData] = React.useState([]);

		const [organisations, setOrganisation] = React.useState([]);

		React.useEffect(() => {
			(async () => {
				const ocktoKit = new OctokitManager(gitInfo.token);

				const organisation = await ocktoKit.getInstallationsUserCanAccess();
				const clinetSideOrganisation = convertToOrganisationInfo(organisation);

				console.log("organisations", clinetSideOrganisation);
				setOrganisation(clinetSideOrganisation);
				const organisationId = clinetSideOrganisation[0].id;
				setSelectedOrganisation(organisationId);
			})();
		}, [gitInfo.token, gitInfo.updateCount]);

		React.useEffect(() => {
			(async () => {
				if (selectedOrganisation) {
					const ocktoKit = new OctokitManager(gitInfo.token);
					const repoData = await ocktoKit.getReposForInstallation(selectedOrganisation);
					console.log("Repo data", getRepoData(repoData, selectedOrganisation));
					setRepositoriesData(getRepoData(repoData, selectedOrganisation));
				}
			})();
		}, [selectedOrganisation]);

		return {
			selectedOrganisation,
			setSelectedOrganisation,
			organisations,
			repositories,
		};
};

const GithubRepoBox = () => {
	const [connectedGit, setConnectedGit] = useAtom(connectedToGitAtom);
	const { selectedOrganisation, organisations, repositories, setSelectedOrganisation } = useGithubData(connectedGit);
	const [searchFilter, setSearchFilter] = React.useState("");

	return (
		<>
		<div className={"flex justify-between items-center"}>
		<div>
			<Input
						placeholder={"Search here"}
						onChange={(e) => { setSearchFilter(e.target.value)}}
				css={css`
					input {
						background: transparent;
						border-width: 0 !important;
					}
					width: 500rem;
				`}
			/>
				</div>
		<SelectBox
					values={organisations ? organisations.map(org => ({ label: org.name, value: org.id })) : []}
					selected={[selectedOrganisation]}
					callback={(selected) => { setSelectedOrganisation(selected[0]); }}
			placeholder={"Select"}
			css={css`
				width: 220rem;
				margin-right: 16rem;

				.selectBox {
					border-width: 0;
					background: transparent;

					:hover {
						border-width: 0;
						background: rgba(255, 255, 255, 0.06);
					}
				}
			`}
		/>
	</div>
	<div
		className={"py-4"}
		css={css`
			border-top: 1px solid #21252f;
			height: 400rem;
			overflow-y: scroll;
		`}
	>
		{repositories.filter(repo => { if (searchFilter.length && repo) { return repo.repoFullName.includes(searchFilter) } else { return true;  } }).map((repository) => (
			<div
				className={"flex px-16 py-12 items-center"}
				css={css`
					:hover {
						background: rgba(0, 0, 0, 0.46);
					}
				`}
			>
				<GitSVG /> <span className={"text-14 ml-16 font-600 leading-none"}>{repository.repoFullName}</span>
			</div>
		))}
		</div>
		</>
	)
}

const GitRepoIntegration = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [connectedGit, setConnectedGit] = useAtom(connectedToGitAtom);

	const onGithubConnectClick = (alreadAuthorized: boolean = false) => {
		const windowRef = openPopup(getGithubOAuthURL(alreadAuthorized));
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

  usePageTitle("Select github repo");

	return (
		<>
			<div
				css={css`
					width: 632rem;
				`}
			>
				<div className={"flex justify-between item-center"}>
					<div>
						<div className="text-18 leading-none mb-16 font-700 font-cera">Select repo</div>
						<div className={"text-14"}>You can create project for testing, deploy and logging.</div>
					</div>
					{/* <Button bgColor={"tertiary-dark"}>Create Project</Button> */}
				</div>

				<div className={"flex justify-between item-center"} className={"mt-64"}>
					<div className={"text-14 leading-none mb-16 font-500 font-cera"}>Select repo to use</div>
				</div>

				<div css={selectProjectBox}>
					<Conditional showIf={!connectedGit}>
						<div css={css`padding: 20rem; display: flex; justify-content: center; align-items: center; font-size: 14rem;`}>
					<div
						className={"font-cera font-700 leading-none"}
						css={css`
							font-size: 13.5rem;
							color: white;
						`}
					>
						Connect a git repository
					</div>

					<div className={"ml-20"}>
						<Button
							bgColor={"tertiary"}
							onClick={onGithubConnectClick.bind(this, false)}
							css={css`
								border-width: 0;
								background: #343a41;
								//
								:hover {
									border-width: 0;
									background: #424850;
								}
							`}
						>
							<div className={"flex items-center"}>
								<GithubSVG height={"12rem"} width={"12rem"} className={"mt-1"} />
								<span className={"mt-2 ml-8"}>Github</span>
							</div>
						</Button>
					</div>
						</div>
					</Conditional>
					<Conditional showIf={connectedGit}>
							<GithubRepoBox/>
					</Conditional>
				</div>
			</div>
		</>
	);
};

const selectProjectBox = css`
	background: #0c0d0f;
	border: 1px solid #21252f;
	border-radius: 6px;
	overflow: hidden;
`;

export { GitRepoIntegration };