import React, { useEffect, useMemo, useRef, useState } from "react";
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

interface iSelectGithubRepoProps {
	userConnections: Array<iUserConnection>;
}
interface iRepoInstallationOptions {
	label: string;
	value: string;
}

const ADD_GITHUB_ORG_OR_ACCOUNT = "ADD_GITHUB_ORG_OR_ACCOUNT";

const SelectGithubRepo = (props: iSelectGithubRepoProps) => {
	const userConnections = useSelector(getUserLoginConnections);

	const [repoInstallationOptions, setRepoInstallationOptions] = useState(
		[] as Array<iRepoInstallationOptions>,
	);
	const [selectedRepoInstallation, setSelectedRepoInstallation] = useState(
		null as iRepoInstallationOptions | null,
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
				if (newGithubInstallationOptions !== repoInstallationOptions) {
					setRepoInstallationOptions(newGithubInstallationOptions);
					setSelectedRepoInstallation(githubInstallationsOptions[0]);
				}
			});
	};

	const setGithubInstallationWindowCheckerInterval = () => {
		const interval = setInterval(() => {
			if (!githubConfigureWindow.current) {
				clearInterval(interval);
				return;
			}
			console.log(isGithubInstallationCheckerRunning.current, "HH");
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
		if (!githubUserConnection) {
			return;
		}
		fetchGithubInstallations();
		setGithubInstallationsCheckerInterval();
	}, [githubUserConnection]);

	const handleInstallationChange = (newValue: iRepoInstallationOptions) => {
		if (newValue.value === ADD_GITHUB_ORG_OR_ACCOUNT) {
			githubConfigureWindow.current = window.open(
				"https://github.com/apps/crusher-test/installations/new",
				"crusher-installation",
				"height=600,width=1080",
			);
			githubConfigureWindow.current.onbeforeunload = function (e) {
				console.log("SHOULD CLOSE");
				alert("ARE YOU SURE");
			};

			isGithubInstallationCheckerRunning.current = true;
			setGithubInstallationWindowCheckerInterval();
			return;
		}
		setSelectedRepoInstallation(newValue);
	};

	return (
		<div css={selectGithubRepoContainerCSS}>
			<Conditional If={!!githubUserConnection}>
				<div css={githubRepoContainerHeaderCSS}>
					<div css={selectInputContainerCSS}>
						<Select
							value={selectedRepoInstallation}
							options={repoInstallationOptions}
							onChange={handleInstallationChange as any}
							style={customSelectStyle}
						/>
					</div>
					<div></div>
				</div>
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
				<SelectGithubRepo userConnections={userConnections} />
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
