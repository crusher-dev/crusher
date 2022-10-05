import { css } from "@emotion/react";
import Link from "next/link";
import React from "react";

import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { mutate } from "swr";

import { Button, Input } from "dyson/src/components/atoms";
import { Text } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";

import { USER_META_KEYS } from "@constants/USER";
import { addGithubRepo, getGitIntegrations } from "@constants/api";
import { useProjectDetails } from "@hooks/common";
import { usePageTitle } from "@hooks/seo";
import { githubTokenAtom } from "@store/atoms/global/githubToken";
import { currentProject } from "@store/atoms/global/project";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { updateMeta } from "@store/mutators/metaData";
import { AddSVG } from "@svg/dashboard";
import { GitSVG } from "@svg/onboarding";
import { GithubSVG, GitIconSVG } from "@svg/social";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { openPopup } from "@utils/common/domUtils";
import { getGithubOAuthURL } from "@utils/core/external";
import { OctokitManager } from "@utils/core/external/ocktokit";
import { convertToOrganisationInfo, getRepoData } from "@utils/core/settings/project/integrationUtils";

const connectedToGitAtom = atomWithImmer<
	| any
	| {
			token: string;
			type: "github";
			updateCount: number;
	  }
>(null);

const selectedRepoAtom = atom<string | number>(null);

export const getOrganisatioNSelectBox = (organisations) => {
	const getAddNew = {
		value: "add_new",
		component: (
			<div className={"flex items-center"}>
				<AddSVG className={"mr-12"} /> Add new org
			</div>
		),
	};
	return [...organisations, getAddNew];
};

const useGithubData = (gitInfo) => {
	const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);

	const [repositories, setRepositoriesData] = React.useState([]);

	const [organisations, setOrganisation] = React.useState([]);

	React.useEffect(() => {
		(async () => {
			const ocktoKit = new OctokitManager(gitInfo.token);

			const organisation = await ocktoKit.getInstallationsUserCanAccess();
			const clientSideOrganisation = convertToOrganisationInfo(organisation);

			setOrganisation(clientSideOrganisation);

			if (clientSideOrganisation.length > 0) {
				// For new accounts, there might be no organisations
				const organisationId = clientSideOrganisation[0].id;
				setSelectedOrganisation(organisationId);
			} else {
				setSelectedOrganisation(null);
			}
		})();
	}, [gitInfo, gitInfo.token, gitInfo.updateCount]);

	React.useEffect(() => {
		(async () => {
			if (selectedOrganisation) {
				const ocktoKit = new OctokitManager(gitInfo.token);
				const repoData = await ocktoKit.getReposForInstallation(selectedOrganisation);
				console.log("Repo data", getRepoData(repoData, selectedOrganisation));
				setRepositoriesData(getRepoData(repoData, selectedOrganisation));
			} else {
				setRepositoriesData([]);
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

const useGithubAuthorize = () => {
	const [connectedGit, setConnectedGit] = useAtom(connectedToGitAtom);

	const onGithubClick = (alreadAuthorized: boolean = false) => {
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
			} else if (windowRef?.closed) {
				setConnectedGit({
					type: "github",
					token: connectedGit.token && connectedGit.token + "",
				});
				clearInterval(interval);
			}
		}, 50);
	};

	return { onGithubClick };
};

const GithubRepoBox = () => {
	const [connectedGit] = useAtom(connectedToGitAtom);
	const { selectedOrganisation, organisations, repositories, setSelectedOrganisation } = useGithubData(connectedGit);
	const [searchFilter, setSearchFilter] = React.useState("");
	const { onGithubClick } = useGithubAuthorize();

	const RepoItem = ({ repository }) => {
		const [connectedRepo, setConnectdRepo] = useAtom(selectedRepoAtom);
		const [, setOnBoardingStep] = useAtom(onboardingStepAtom);
		const { currentProject: project } = useProjectDetails();

		const handleRepoClick = async () => {
			await addGithubProject(project.id, repository);

			setConnectdRepo(repository.repoId);

			mutate(getGitIntegrations(project.id));

			setOnBoardingStep(OnboardingStepEnum.CLI_INTEGRATION);
		};

		return (
			<div
				key={repository.repoId}
				className={"flex px-16 py-12 items-center"}
				css={css`
					:hover {
						background: rgba(0, 0, 0, 0.46);
					}
				`}
				onClick={handleRepoClick}
			>
				<GitSVG /> <span className={"text-14 ml-16 font-600 leading-none"}>{repository.repoFullName}</span>
				<Conditional showIf={repository.repoId === connectedRepo}>
					<span className={"text-14 ml-auto mr-12 font-600 leading-none"}>Connected</span>
				</Conditional>
			</div>
		);
	};

	const noOrganisationAndRepo = organisations.length === 0 && repositories.length === 0;

	return (
		<>
			<div className={"flex justify-between items-center"}>
				<div>
					<Input
						placeholder={"Search here"}
						onChange={(e) => {
							setSearchFilter(e.target.value);
						}}
						css={css`
							input {
								background: transparent;
								border-width: 0 !important;
							}
						`}
					/>
				</div>
				<SelectBox
					placeholder={"Select your org"}
					values={getOrganisatioNSelectBox(organisations ? organisations.map((org) => ({ label: org.name, value: org.id })) : [])}
					selected={[selectedOrganisation].filter((a) => a)}
					callback={(selected) => {
						if (selected[0] === "add_new") {
							return onGithubClick(true);
						}
						setSelectedOrganisation(selected[0]);
					}}
					placeholder={"Select your organisation ↓"}
					css={css`
						width: 180rem;
						.select-dropDownContainer {
							top: calc(100% + 2rem);
						}
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
			<Conditional showIf={noOrganisationAndRepo}>
				<div
					css={css`
						font-size: 14rem;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						min-height: 340rem;
					`}
				>
					<GitIconSVG
						css={css`
							width: 24rem;
							height: 24rem;
						`}
					/>
					<div
						css={css`
							margin-top: 20rem;
							color: #e7e7e7;
							font-family: Gilroy;
							font-size: 14rem;
							font-weight: 600;
						`}
					>
						Install Crusher in your projects
					</div>
					<div
						css={css`
							margin-top: 10rem;
							font-family: Gilroy;
							font-size: 13rem;
							color: #e7e7e7;
						`}
					>
						This allows us to integrate crusher seamlessly in your project{" "}
					</div>
					<Button
						onClick={onGithubClick.bind(this, true)}
						size={"medium"}
						css={css`
							margin-top: 20rem;
							padding: 0 18rem !important;
						`}
						bgColor={"primary"}
					>
						Authorize
					</Button>
				</div>
			</Conditional>
			<Conditional showIf={!noOrganisationAndRepo}>
				<div
					className={"py-4 custom-scroll"}
					css={css`
						border-top: 1px solid #21252f;
						height: 400rem;
						overflow-y: auto;
					`}
				>
					{repositories
						.filter((repo) => {
							if (searchFilter.length && repo) {
								return repo.repoFullName.includes(searchFilter);
							} else {
								return true;
							}
						})
						.map((repository) => (
							<RepoItem key={repository.repoId} repository={repository} />
						))}
				</div>
			</Conditional>
		</>
	);
};

const addGithubProject = (projectId: number, repoData) => {
	return backendRequest(addGithubRepo(projectId), {
		method: RequestMethod.POST,
		payload: repoData,
	});
};

const GitRepoIntegration = () => {
	const [connectedGit, setConnectedGit] = useAtom(connectedToGitAtom);
	const [githubToken] = useAtom(githubTokenAtom);
	const [, updateOnboarding] = useAtom(updateMeta);

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

	const handleSkipOnboarding = () => {
		updateOnboarding({
			type: "user",
			key: USER_META_KEYS.INITIAL_ONBOARDING,
			value: true,
		});
	};

	React.useEffect(() => {
		if (githubToken && githubToken !== "null" && githubToken.length) {
			setConnectedGit({
				...connectedGit,
				token: githubToken,
				type: "github",
			});
		}
	}, [githubToken]);

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
						<div
							css={css`
								padding: 20rem;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 14rem;
							`}
						>
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
						<GithubRepoBox />
					</Conditional>
				</div>
				<div className={"flex justify-end mt-28"}>
					<Link href={"/app/dashboard"}>
						<Text
							css={css`
								:hover {
									opacity: 0.9;
								}
							`}
							onClick={handleSkipOnboarding}
							fontSize={13}
						>
							Skip setup and show me the dashboard
						</Text>
					</Link>
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
