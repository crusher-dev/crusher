import React, {
	ChangeEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { css } from "@emotion/core";
import { Conditional } from "@ui/components/common/Conditional";
import WarningIcon from "../../../svg/warning.svg";
import { FRONTEND_SERVER_URL, PIXEL_REM_RATIO } from "@constants/other";
import { iUserConnection } from "@crusher-shared/types/mongo/userConnection";
import { USER_CONNECTION_TYPE } from "@crusher-shared/types/userConnectionType";
import { iGithubUserConnection } from "@crusher-shared/types/mongo/githubUserConnection";
import { OctokitManager } from "@services/octokit";
import Select from "react-select";
import { isWindowCrossOrigin } from "@utils/helpers";
import { useSelector } from "react-redux";
import { getUserLoginConnections } from "@redux/stateUtils/user";
import { store } from "@redux/store";
import {
	getGithubInstallationOptions,
	getReposForSelectedInstallation,
	getSelectedGithubInstallationOption,
} from "@redux/stateUtils/github";
import {
	saveGithubInstallationOptions,
	saveReposForInstallation,
	setSelectedGithubInstallationOption,
} from "@redux/actions/github";
import { iGithubInstallation } from "@interfaces/githubInstallations";
import { getRelativeSize } from "@utils/styleUtils";
import SearchIcon from "../../../../public/svg/settings/search.svg";

interface iSelectGithubRepoProps {
	userConnections: Array<iUserConnection>;
}

const ADD_GITHUB_ORG_OR_ACCOUNT = "ADD_GITHUB_ORG_OR_ACCOUNT";

const GithubRepoItem = (props: any) => {
	const { item } = props;

	const handleRepoConnect = () => {
		alert(`LINKING ${item.id}`);
	};

	return (
		<li css={githubReposListItemContainerCSS}>
			<img src={item.owner.avatar_url} css={githubRepoItemAvatarCSS} />
			<span css={githubItemRepoNameCSS}>{item.name}</span>
			<div css={githubRepoItemConnectButtonCSS} onClick={handleRepoConnect}>
				Connect
			</div>
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

interface iSelectGithubReposListProps {
	searchFilter: string;
}

const SelectGithubReposList = (props: iSelectGithubReposListProps) => {
	const { searchFilter } = props;

	const selectedGithubInstallationRepos = useSelector(
		getReposForSelectedInstallation,
	);

	const selectedGithubInstallationsOut = useMemo(() => {
		if (
			selectedGithubInstallationRepos &&
			selectedGithubInstallationRepos.length
		) {
			return selectedGithubInstallationRepos
				.filter((repo) => {
					return searchFilter.trim().length > 0
						? repo.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1
						: true;
				})
				.map((repo) => {
					return <GithubRepoItem key={repo.id} item={repo} />;
				});
		}
		return null;
	}, [selectedGithubInstallationRepos, searchFilter]);

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

const SelectGithubRepoContainer = (props: iSelectGithubRepoProps) => {
	const [searchInputValue, setSearchInputValue] = useState("");
	const userConnections = useSelector(getUserLoginConnections);

	const repoInstallationOptions = useSelector(getGithubInstallationOptions);

	const selectedOrgInstallation = useSelector(
		getSelectedGithubInstallationOption,
	);

	const octoKitManager = useRef(null as OctokitManager | null);
	const githubConfigureWindow = useRef(null as Window | null);

	const githubUserConnection: iGithubUserConnection | undefined = useMemo(() => {
		return userConnections.find(
			(connection) => connection.service === USER_CONNECTION_TYPE.GITHUB,
		);
	}, [userConnections]);

	const isGithubInstallationCheckerRunning = useRef(false);

	const fetchGithubInstallations = async () => {
		if (!githubUserConnection) {
			return;
		}
		octoKitManager.current = new OctokitManager(
			githubUserConnection?.meta.tokenAuthentication.token,
		);

		return octoKitManager.current
			?.getInstallationsUserCanAccess()
			.then((githubInstallations) => {
				const githubInstallationsOptions = githubInstallations.data.installations.map(
					(installation) => {
						return {
							label: installation.account.login,
							value: installation.id.toString(),
						};
					},
				);
				const newGithubInstallationOptions = [
					...githubInstallationsOptions,
					{ label: "Add Github Org or Account", value: ADD_GITHUB_ORG_OR_ACCOUNT },
				];
				if (newGithubInstallationOptions != repoInstallationOptions) {
					store.dispatch(
						saveGithubInstallationOptions(newGithubInstallationOptions),
					);
					store.dispatch(
						setSelectedGithubInstallationOption(githubInstallationsOptions[0]),
					);
				}
			});
	};

	const setGithubInstallationWindowCheckerInterval = () => {
		const interval = setInterval(() => {
			if (!githubConfigureWindow.current) {
				clearInterval(interval);
				return;
			}
			if (
				!isWindowCrossOrigin(githubConfigureWindow.current) &&
				githubConfigureWindow.current?.location.href.startsWith(FRONTEND_SERVER_URL)
			) {
				isGithubInstallationCheckerRunning.current = false;
				githubConfigureWindow.current.close();
				clearInterval(interval);
				fetchGithubInstallations();
			}
		}, 500);
	};

	const setGithubInstallationsCheckerInterval = () => {
		const fetchGithubInstallationsContinuously = async () => {
			if (isGithubInstallationCheckerRunning.current)
				await fetchGithubInstallations();

			setTimeout(fetchGithubInstallationsContinuously, 500);
		};
		setTimeout(fetchGithubInstallationsContinuously, 500);
	};

	useEffect(() => {
		if (selectedOrgInstallation) {
			if (octoKitManager.current) {
				octoKitManager.current
					?.getReposForInstallation(selectedOrgInstallation.value)
					.then((info) => {
						if (info.data && info.data.repositories) {
							store.dispatch(
								saveReposForInstallation(
									selectedOrgInstallation.value,
									info.data.repositories,
								),
							);
						}
					});
			}
		}
	}, [selectedOrgInstallation]);

	useEffect(() => {
		if (!githubUserConnection) {
			return;
		}
		fetchGithubInstallations();
		setGithubInstallationsCheckerInterval();
	}, [githubUserConnection]);

	const handleInstallationChange = (newValue: iGithubInstallation) => {
		console.log(newValue.value, ADD_GITHUB_ORG_OR_ACCOUNT);
		if (newValue.value == ADD_GITHUB_ORG_OR_ACCOUNT) {
			githubConfigureWindow.current = window.open(
				"https://github.com/apps/crusher-test/installations/new",
				"crusher-installation",
				"height=600,width=1080",
			);

			isGithubInstallationCheckerRunning.current = true;
			setGithubInstallationWindowCheckerInterval();
			return;
		}

		store.dispatch(setSelectedGithubInstallationOption(newValue));
	};

	const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchInputValue(event.target.value);
	};

	return (
		<div css={selectGithubRepoContainerCSS}>
			<Conditional If={!!githubUserConnection}>
				<div css={githubRepoContainerHeaderCSS}>
					<div css={selectInputContainerCSS}>
						<Select
							value={selectedOrgInstallation}
							options={repoInstallationOptions}
							onChange={handleInstallationChange as any}
							style={customSelectStyle}
						/>
					</div>
					<div css={repoSearchInputContainerCSS}>
						<SearchIcon css={searchIconCSS} />
						<input
							value={searchInputValue}
							placeholder={"Search..."}
							onChange={handleSearchInputChange}
							css={repoSearchInputCSS}
						/>
					</div>
				</div>
				<SelectGithubReposList searchFilter={searchInputValue} />
			</Conditional>
		</div>
	);
};

const githubRepoContainerHeaderCSS = css`
	display: flex;
`;
const selectInputContainerCSS = css`
	flex: 0.6;
`;
const repoSearchInputContainerCSS = css`
	display: flex;
	align-items: center;
	margin-left: 1rem;
	border: 1px solid rgb(234, 234, 234);
	flex: 0.4;
	border-radius: ${getRelativeSize(4)}rem;
	padding: 0 ${getRelativeSize(12)}rem;
	background: #fff;
`;
const searchIconCSS = css`
	height: 0.9275rem;
`;
const repoSearchInputCSS = css`
	padding-left: 0.75rem;
	height: 100%;
	width: 100%;
`;
const customSelectStyle = {};
const selectGithubRepoContainerCSS = css``;

interface iProjectGitIntegrationsProps {
	userConnections: Array<iUserConnection>;
	connectedGitIntegrations: Array<any>;
}

const ProjectGitIntegrations = (props: iProjectGitIntegrationsProps) => {
	const { connectedGitIntegrations } = props;

	const userConnections = useSelector(getUserLoginConnections);
	const showLinkGithub =
		!userConnections.length && !connectedGitIntegrations.length;
	const showSelectRepoGithub = userConnections.length;
	const showConnectedGitIntegration = connectedGitIntegrations.length;

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
			<Conditional If={showConnectedGitIntegration}>
				<div>Hello world, already connected to github repo</div>
			</Conditional>
		</div>
	);
};

const containerCSS = css`
	font-family: Gilroy;
`;
const noLoginConnectionCSS = css`
	display: flex;
	border: 1px solid #eaeaea;
	border-radius: ${6 / PIXEL_REM_RATIO}rem;
	padding: ${16 / PIXEL_REM_RATIO}rem ${20 / PIXEL_REM_RATIO}rem;
	align-items: center;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	color: rgb(102, 102, 102);

	font-weight: 600;
`;
const noLoginConnectionTextCSS = css`
	margin-left: ${24 / PIXEL_REM_RATIO}rem;
	margin-top: 0.2rem;
	flex: 1;
`;
const noLoginConnectionLinkCSS = css`
	margin-left: auto;
	background: #0070f3;
	color: #fff;
	font-weight: 500;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	padding: ${4 / PIXEL_REM_RATIO}rem ${24 / PIXEL_REM_RATIO}rem;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	&:hover {
		color: #fff;
		text-decoration-line: none !important;
	}
`;

export { ProjectGitIntegrations };
