import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getUserLoginConnections } from "@redux/stateUtils/user";
import { getGithubInstallationOptions, getSelectedGithubInstallationOption } from "@redux/stateUtils/github";
import { OctokitManager } from "@services/octokit";
import { iGithubUserConnection } from "@crusher-shared/types/mongo/githubUserConnection";
import { USER_CONNECTION_TYPE } from "@crusher-shared/types/userConnectionType";
import { store } from "@redux/store";
import { saveGithubInstallationOptions, saveReposForInstallation, setSelectedGithubInstallationOption } from "@redux/actions/github";
import { isWindowCrossOrigin } from "@utils/helpers";
import { FRONTEND_SERVER_URL } from "@constants/other";
import { iGithubInstallation } from "@interfaces/githubInstallations";
import { Conditional } from "@ui/components/common/Conditional";
import Select from "react-select";
import SearchIcon from "../../../../../public/svg/settings/search.svg";
import { css } from "@emotion/core";
import { getRelativeSize } from "@utils/styleUtils";
import { SelectGithubReposList } from "@ui/containers/settings/gitIntegrations/selectGithubReposList";

const ADD_GITHUB_ORG_OR_ACCOUNT = "ADD_GITHUB_ORG_OR_ACCOUNT";
const SelectGithubRepoContainer = () => {
	const [searchInputValue, setSearchInputValue] = useState("");
	const userConnections = useSelector(getUserLoginConnections);

	const repoInstallationOptions = useSelector(getGithubInstallationOptions);

	const selectedOrgInstallation = useSelector(getSelectedGithubInstallationOption);

	const octoKitManager = useRef(null as OctokitManager | null);
	const githubConfigureWindow = useRef(null as Window | null);

	const githubUserConnection: iGithubUserConnection | undefined = useMemo(() => {
		return userConnections.find((connection) => connection.service === USER_CONNECTION_TYPE.GITHUB);
	}, [userConnections]);

	const isGithubInstallationCheckerRunning = useRef(false);

	const fetchGithubInstallations = async () => {
		if (!githubUserConnection) {
			return;
		}
		octoKitManager.current = new OctokitManager(githubUserConnection?.meta.tokenAuthentication.token as string);

		return octoKitManager.current?.getInstallationsUserCanAccess().then((githubInstallations) => {
			const githubInstallationsOptions = githubInstallations.data.installations.map((installation) => {
				return {
					label: installation.account.login,
					value: installation.id.toString(),
				};
			});
			const newGithubInstallationOptions = [...githubInstallationsOptions, { label: "Add Github Org or Account", value: ADD_GITHUB_ORG_OR_ACCOUNT }];
			if (newGithubInstallationOptions !== repoInstallationOptions) {
				store.dispatch(saveGithubInstallationOptions(newGithubInstallationOptions));
				store.dispatch(setSelectedGithubInstallationOption(githubInstallationsOptions[0]));
			}
		});
	};

	const setGithubInstallationWindowCheckerInterval = () => {
		const interval = setInterval(() => {
			if (!githubConfigureWindow.current) {
				clearInterval(interval);
				return;
			}
			if (!isWindowCrossOrigin(githubConfigureWindow.current as Window) && githubConfigureWindow.current?.location.href.startsWith(FRONTEND_SERVER_URL)) {
				isGithubInstallationCheckerRunning.current = false;
				githubConfigureWindow.current.close();
				clearInterval(interval);
				fetchGithubInstallations();
			}
		}, 500);
	};

	const setGithubInstallationsCheckerInterval = () => {
		const fetchGithubInstallationsContinuously = async () => {
			if (isGithubInstallationCheckerRunning.current) await fetchGithubInstallations();

			setTimeout(fetchGithubInstallationsContinuously, 500);
		};
		setTimeout(fetchGithubInstallationsContinuously, 500);
	};

	useEffect(() => {
		if (selectedOrgInstallation && octoKitManager.current) {
            octoKitManager.current?.getReposForInstallation(selectedOrgInstallation.value).then((info) => {
                if (info.data?.repositories) {
                    store.dispatch(saveReposForInstallation(selectedOrgInstallation.value, info.data.repositories));
                }
            });
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
		if (newValue.value === ADD_GITHUB_ORG_OR_ACCOUNT) {
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
						<input value={searchInputValue} placeholder={"Search..."} onChange={handleSearchInputChange} css={repoSearchInputCSS} />
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

export { SelectGithubRepoContainer };
