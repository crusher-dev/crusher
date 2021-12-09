import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";

import Toggle from "dyson/src/components/atoms/toggle/toggle";
import { GithubSVG } from "@svg/social";
import { Card } from "dyson/src/components/layouts/Card/Card";
import { openPopup } from "@utils/common/domUtils";
import { getGithubOAuthURL } from "@utils/core/external";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import { OctokitManager } from "@utils/core/external/ocktokit";
import { convertToOrganisationInfo, getRepoData } from "@utils/core/settings/project/integrationUtils";
import { AddSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { addGithubRepo, getGitIntegrations, getSlackIntegrations, unlinkGithubRepo } from "@constants/api";
import { RequestMethod } from "@types/RequestOptions";
import { currentProject } from "@store/atoms/global/project";
import useSWR, { mutate } from "swr";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/common/url";
import { sendSnackBarEvent } from "@utils/common/notify";

const connectedToGitAtom = atomWithImmer<
	| any
	| {
			token: string;
			type: "github";
			updateCount: number;
	  }
>(null);

const useGithubData = (gitInfo) => {
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

const addGithubProject = (projectId: number, repoData) => {
	return backendRequest(addGithubRepo(projectId), {
		method: RequestMethod.POST,
		payload: repoData,
	});
};

function RepoBar({ repo }) {
	const [project] = useAtom(currentProject);

	const onSelect = useCallback(async () => {
		await addGithubProject(project.id, repo);

		mutate(getGitIntegrations(project.id));
	}, []);
	return (
		<div className={"flex text-13 justify-between mb-16"}>
			<div className={"flex items-center"}>
				<div
					className="flex items-center justify-center mr-16"
					css={css`
						min-width: 28px;
						min-height: 28px;
						border-radius: 4rem;
						background: #323942;
					`}
				>
					<GithubSVG />
				</div>
				{repo.repoName}
			</div>

			<Button
				size={"x-small"}
				onClick={onSelect.bind(this)}
				css={css`
					min-width: 100rem;
				`}
			>
				<span
					className={"mt-1"}
					css={css`
						font-size: 12.5rem;
					`}
				>
					Connect
				</span>
			</Button>
		</div>
	);
}

export const getOrganisatioNSelectBox = (organisations) => {
	const organisation = organisations.map(({ id, name }) => ({
		value: id,
		label: name,
	}));

	const getAddNew = {
		value: "add_new",
		component: (
			<div className={"flex items-center"}>
				<AddSVG className={"mr-12"} /> Add new account/organisation
			</div>
		),
	};
	return [...organisation, getAddNew];
};

function ProjectBox() {
	const [gitInfo] = useAtom(connectedToGitAtom);
	const { selectedOrganisation, organisations, repositories, setSelectedOrganisation } = useGithubData(gitInfo);

	const { onGithubClick } = useGithubAuthorize();
	const handleOrgSelection = useCallback(([selected]) => {


		if (selected === "add_new") {
			onGithubClick(true);
			return;
		}

		setSelectedOrganisation(selected);
	}, []);


	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-28"}
				css={css`
					padding: 18rem 20rem 18rem;
					background: #101215;
				`}
			>
				<div
					className={"font-cera font-700 mb-8 leading-none"}
					css={css`
						font-size: 13.5rem;
						color: white;
					`}
				>
					Connected to a git repository
				</div>
				<TextBlock fontSize={12} color={"#E4E4E4"}>
					Seamlessly create Deployments for any commits pushed to your Git repository.
				</TextBlock>

				<div className={"mt-24 mb-28"}>
					<div
						css={css`
							max-width: 300rem;
						`}
					>
						<SelectBox selected={[selectedOrganisation]} values={getOrganisatioNSelectBox(organisations)} callback={handleOrgSelection.bind(this)}></SelectBox>
					</div>
				</div>

				{repositories.map((repo) => (
					<RepoBar repo={repo} />
				))}
			</Card>

			<TextBlock className={"mt-16"} fontSize={"12"} color={"#A7A7A8"}>
				Learn more about login for connection
			</TextBlock>
		</div>
	);
}

const useGithubAuthorize = () => {
	const [, setConnectedGit] = useAtom(connectedToGitAtom);
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
			}
		}, 50);
	};

	return { onGithubClick };
};
function ConnectionGithub() {
	const { onGithubClick } = useGithubAuthorize();

	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-28"}
				css={css`
					padding: 18rem 20rem 18rem;
					background: #101215;
				`}
			>
				<div
					className={"font-cera font-700 mb-8 leading-none"}
					css={css`
						font-size: 13.5rem;
						color: white;
					`}
				>
					Connect a git repository
				</div>
				<TextBlock fontSize={12} color={"#E4E4E4"}>
					Seamlessly create Deployments for any commits pushed to your Git repository.
				</TextBlock>

				<div className={"mt-12"}>
					<Button
						bgColor={"tertiary-dark"}
						onClick={onGithubClick.bind(this, false)}
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
			</Card>

			<TextBlock className={"mt-16"} fontSize={"12"} color={"#A7A7A8"}>
				Learn more about login for connection
			</TextBlock>
		</div>
	);
}

const unlinkRepo = (projectId: number, id) => {
	return backendRequest(unlinkGithubRepo(projectId), {
		method: RequestMethod.POST,
		payload: {
			id,
		},
	});
};

function LinkedRepo() {
	const [project] = useAtom(currentProject);
	const { data: linkedRepos } = useSWR(getGitIntegrations(project.id));

	const { repoName, projectId, repoLink, _id: id } = linkedRepos.linkedRepo;

	const unlinkRepoCallback = useCallback(async () => {
		await unlinkRepo(projectId, id);
		mutate(getGitIntegrations(project.id));
	}, [linkedRepos]);

	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-28"}
				css={css`
					padding: 18rem 20rem 18rem;
					background: #101215;
				`}
			>
				<div
					className={"font-cera font-700 mb-8 leading-none"}
					css={css`
						font-size: 13.5rem;
						color: white;
					`}
				>
					Connected to
				</div>
				<div></div>

				<div className={"flex text-13 justify-between mt-16"}>
					<div className={"flex items-center"}>
						<div
							className="flex items-center justify-center mr-16"
							css={css`
								min-width: 28px;
								min-height: 28px;
								border-radius: 4rem;
								background: #323942;
							`}
						>
							<GithubSVG />
						</div>

						<div>
							<div
								className={"font-600"}
								css={css`
									color: #fff;
								`}
							>
								{repoName}
							</div>
							<a href={repoLink} target={"_blank"}>
								{repoLink}
							</a>
						</div>
					</div>

					<Button
						size={"small"}
						bgColor={"danger"}
						css={css`
							min-width: 100rem;
						`}
						onClick={unlinkRepoCallback.bind(this)}
					>
						<span className={"mt-1"}>Disconnect</span>
					</Button>
				</div>
			</Card>

			<TextBlock className={"mt-16"} fontSize={"12"} color={"#A7A7A8"}>
				Learn more about login for connection
			</TextBlock>
		</div>
	);
}

function GitIntegration() {
	const [connectedToGit, setConnectedGit] = useAtom(connectedToGitAtom);
	const [project] = useAtom(currentProject);
	const { data: linkedRepo } = useSWR(getGitIntegrations(project.id));

	const hadLinkedRepo = !!linkedRepo?.linkedRepo;
	return (
		<div className={"flex flex-col justify-between items-start mt-44 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div>
					<Heading type={2} fontSize={"16"} className={"mb-8"}>
						Git Integration
					</Heading>
					<TextBlock fontSize={12} className={""} color={"#c1c1c1"}>
						Make sure you have selected all the configuration you want
					</TextBlock>
				</div>
			</div>

			<Conditional showIf={hadLinkedRepo}>
				<LinkedRepo />
			</Conditional>
			<Conditional showIf={!hadLinkedRepo}>
				<Conditional showIf={!connectedToGit?.type}>
					<ConnectionGithub />
				</Conditional>
				<Conditional showIf={!!connectedToGit}>
					<ProjectBox />
				</Conditional>
			</Conditional>
		</div>
	);
}

const getSlackChannelValues = (channels: Array<{name: string; id: string;}> | null) => {
	if(!channels) return [];

	return (
		channels.map((channel) => {
			return { label: channel.name, value: channel.id };
		}) ?? []
	);
};

function SlackIntegration() {
	const [project] = useAtom(currentProject);

	const [isConnected, setIsConnected] = useState(false);
	const [slackChannels, setSlackChannels] = useState(null);
	const [nextCursor, setNextCursor] = useState(null);
	const {data: integrations} = useSWR(getSlackIntegrations(project.id));

	const [integration, setSlackIntegration] = useState({
		normalChannel: [],
		alertChannel: [],
	});

	useEffect(() => {
		if(integrations && integrations.slackIntegration) {
			console.log("Integrations is", integrations);
			setIsConnected(true);

			const slackIntegrationMeta = integrations.slackIntegration && integrations.slackIntegration.meta;

			if(slackIntegrationMeta && slackIntegrationMeta.channel) {
				const normalChannel = slackIntegrationMeta.channel.normal;
				const alertChannel = slackIntegrationMeta.channel.alert;

				setSlackIntegration({
					normalChannel: normalChannel ? [{label: normalChannel.name, value: normalChannel.value}] : [],
					alertChannel: alertChannel ? [{label: alertChannel.name, value: alertChannel.value}] : [],
				});
			}

		}
	}, [integrations]);
	
	const fetchSlackChannels = useCallback(async () => {
		const {channels, nextCursor} = await backendRequest(resolvePathToBackendURI(`/integrations/${project.id}/slack/channels`));
		setSlackChannels(channels);
		setNextCursor(nextCursor);
		return channels;
	}, [slackChannels, nextCursor]);

	useEffect(() => {
		if(isConnected) {
			fetchSlackChannels();
		}
	}, [isConnected])

	const handleSwitch  = useCallback((toggleState: boolean) => {
		if(toggleState) {
			const windowRef = openPopup(`https://slack.com/oauth/v2/authorize?scope=chat:write,chat:write.public,channels:read,groups:read&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&redirect_uri=${escape(resolvePathToBackendURI("/integrations/slack/actions/add"))}&state=${encodeURIComponent(JSON.stringify({projectId: project.id, redirectUrl: resolvePathToFrontendURI("/settings/project/integrations")}))}`);
			
			//@ts-ignore
			const interval = setInterval(() => {
				if(windowRef.closed) return clearInterval(interval);

				const isOnFEPage = windowRef?.location?.href?.includes(window.location.host);
				if (isOnFEPage) {
					const url = windowRef?.location?.href;
					setIsConnected(true);
					windowRef.close();
					clearInterval(interval);
				}
			}, 200);
		} else {
			backendRequest(`/integrations/${project.id}/slack/actions/remove`).then((res)=> {
				setIsConnected(false);
				setSlackIntegration({
					normalChannel: [],
					alertChannel: [],
				});
				sendSnackBarEvent({
					message: "Succesfully disabled slack integration",
					type: "normal",
				});
			}).catch((err) => {
				sendSnackBarEvent({
					message: "Error disabling slack integration",
					type: "error",
				});
			})
		}
	}, []);

	const handleChannelSelect = (type: "normal" | "alert", selectedValues) => {
		const channelTypeName = type === "normal" ? "normalChannel" : "alertChannel";

		setSlackIntegration((previous) => ({
				...previous,
				[channelTypeName]: selectedValues
		}));

		const alertChannel = channelTypeName === "alertChannel" ? selectedValues : integration.alertChannel;
		const normalChannel = channelTypeName === "normalChannel" ? selectedValues : integration.normalChannel;

		const alertChannelInfo = alertChannel && alertChannel[0] && alertChannel[0].label ? alertChannel : getSlackChannelValues(slackChannels).filter((channel) => alertChannel[0] === channel.value);
		const normalChannelInfo = normalChannel && normalChannel[0] && normalChannel[0].label ? normalChannel : getSlackChannelValues(slackChannels).filter((channel) => normalChannel[0] === channel.value);

		backendRequest(`/integrations/${project.id}/slack/actions/save.settings`, {
			method: RequestMethod.POST,
			payload: {
				alertChannel: alertChannelInfo[0] ? {
					name: alertChannelInfo[0].label,
					value: alertChannelInfo[0].value,
				} : null,
				normalChannel: normalChannelInfo[0] ? {
					name: normalChannelInfo[0].label,
					value: normalChannelInfo[0].value,
				} : null
			}
		}).then((res) => {
			console.log("Res is", res);
			sendSnackBarEvent({
				type: "success",
				message: "Slack integration saved successfully",
			});
		}).catch((err) => {
			sendSnackBarEvent({
				type: "error",
				message: "Slack integration failed to save",
			});
		});
	};

	const handleScrollEnd = useCallback(async () => {		
				if(!nextCursor) return false;

				const {channels, nextCursor: _nextCursor} = await backendRequest(resolvePathToBackendURI(`/integrations/${project.id}/slack/channels`), {
					method: RequestMethod.GET,
					payload: {
						cursor: nextCursor,
					}
				});

				setNextCursor((previous) => (_nextCursor));
				setSlackChannels((previous) => ([...previous, ...channels]));
				return true;
	}, [slackChannels, nextCursor]);

	return (
		<div className={"justify-between items-start mt-40 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div className={"flex"}>
					<img src={"/svg/slack-icon.svg"} width={"24rem"} />
					<div className={"ml-20"}>
						<Heading type={2} fontSize={"14"} className={"mb-8"}>
							Slack Integration
						</Heading>
						<TextBlock fontSize={12.2} className={""} color={"#c1c1c1"}>
							Make sure you have selected all the configuration you want
						</TextBlock>
					</div>
				</div>
				<Toggle disableInternalState={true} callback={handleSwitch} isOn={isConnected}></Toggle>
			</div>
			<Conditional showIf={isConnected}>
			<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-34"}
				css={css`
					padding: 20rem 20rem 20rem;
					background: #101215;
				`}
			>
				<div className="text-13">
					<div className="flex" style={{alignItems: "center"}}>
						<label style={{fontWeight: "bold"}}>Normal channel</label>
						<div className="ml-auto" css={selectBoxCSS}>
							<SelectBox onScrollEnd={handleScrollEnd} dropDownHeight={"214rem"} isSearchable={true} values={getSlackChannelValues(slackChannels)} selected={integration.normalChannel ? integration.normalChannel : null} placeholder="Select a channel" va callback={handleChannelSelect.bind(this, "normal")}/>
						</div>
					</div>

					<div className="flex mt-20" style={{alignItems: "center"}}>
						<label style={{fontWeight: "bold"}}>Alert Channel:</label>
						<div className="ml-auto" css={selectBoxCSS}>
							<SelectBox onScrollEnd={handleScrollEnd} dropDownHeight={"214rem"} isSearchable={true} values={getSlackChannelValues(slackChannels)} selected={integration.alertChannel ? integration.alertChannel : null} placeholder="Select a channel" callback={handleChannelSelect.bind(this, "alert")} css={selectBoxCSS} />
						</div>
					</div>
				</div>
				</Card>
				</div>
			</Conditional>
		</div>
	);
}

const selectBoxCSS = css`
	width: 200rem;
`;

const ciIntegrations = ["Gitlab", "Github"];

const ciButtonCSS = css`
	width: 100rem;
	height: 26rem;
`;
const selectedCSS = css`
	background: #6b77df;
	:hover {
		background: #6b77df;
	}
`;
function CIButtons({ setSelectedCI, selectedCI }) {
	return (
		<div className={"flex"}>
			{ciIntegrations.map((item, index) => (
				<Button
					css={[selectedCI === item && selectedCSS, ciButtonCSS]}
					size={"x-small"}
					bgColor={"tertiary-outline"}
					className={"mr-20"}
					onClick={setSelectedCI.bind(this, item)}
				>
					<span
						className={"mt-7"}
						css={css`
							font-size: 13rem !important;
						`}
					>
						Github
					</span>
				</Button>
			))}
		</div>
	);
}

const CiIntegration = () => {
	const [selectedCI, setSelectedCI] = useState<string | null>(null);
	return (
		<div>
			<Heading type={2} fontSize={"16"} className={"mt-48 mb-8"}>
				CI Integration
			</Heading>
			<TextBlock fontSize={12} className={"mb-28"} color={"#c1c1c1"}>
				Integrate with CI of your choice
			</TextBlock>

			<TextBlock fontSize={"12.6"} className={"mb-12"}>
				Select CI
			</TextBlock>
			<CIButtons selectedCI={selectedCI} setSelectedCI={setSelectedCI} />
			<Conditional showIf={!!selectedCI}>
				<div className={"text-13 mt-36"}>
					<div className={"mb-24"}>
						1. <span className={"ml-16"}>Create and start your server.</span>
					</div>
					<div className={"mb-24"}>
						2. <span className={"ml-16"}>Expose Localtunnel.</span>
					</div>
					<div className={"mb-24"}>
						3. <span className={"ml-16"}>Copy this snipped below.</span>
					</div>
					<div className={"py-20 px-32"} css={codeBackground}>
						//code
						<br />
						ci: run dark
					</div>
				</div>
			</Conditional>
		</div>
	);
};

const codeBackground = css`
	background: #101215;
	border: 1px solid #171c24;
	border-radius: 4px;
`;
export const Integrations = () => {
	const [showModal, setShowModal] = useState(false);
	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<AddProjectModal onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={"18"} className={"mb-12"}>
					Integrations
				</Heading>
				<TextBlock fontSize={"12.5"} className={"mb-24"} color={"#c1c1c1"}>
					Make sure you have selected all the configuration you want
				</TextBlock>
				<hr css={basicHR} />
				<SlackIntegration />
				{/* <hr css={basicHR} /> */}
				<GitIntegration />
				<hr css={basicHR} className={"mt-40"} />
				{/* <CiIntegration /> */}
			</div>
		</SettingsLayout>
	);
};

const maxWidthContainer = css`
	width: 680rem;
	margin: 0 auto;
`;

const basicHR = css`
	background: rgba(255, 255, 255, 0.015);
	border-top: 1px solid rgba(196, 196, 196, 0.06);
`;
