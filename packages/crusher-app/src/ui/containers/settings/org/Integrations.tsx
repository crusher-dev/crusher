import { css } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";
import React from "react";

import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";
import useSWR, { mutate } from "swr";

import { Button, Input } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import Switch from "dyson/src/components/atoms/toggle/switch";
import { Conditional } from "dyson/src/components/layouts";
import { Card } from "dyson/src/components/layouts/Card/Card";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";

import { addGithubRepo, getCIIntegrationCommnad, getGitIntegrations, getIntegrations, saveWebhookUrlAPI, unlinkGithubRepo } from "@constants/api";
import { useProjectDetails } from "@hooks/common";
import { AddSVG } from "@svg/dashboard";
import { CopyIconSVG } from "@svg/onboarding";
import { GithubSVG } from "@svg/social";
import { RequestMethod } from "@types/RequestOptions";
import AddProjectModal from "@ui/containers/dashboard/AddProject";
import { SettingsLayout } from "@ui/layout/SettingsBase";
import { backendRequest } from "@utils/common/backendRequest";
import { openPopup } from "@utils/common/domUtils";
import { sendSnackBarEvent } from "@utils/common/notify";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/common/url";
import { getGithubOAuthURLLegacy } from "@utils/core/external";
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
	const { currentProject: project } = useProjectDetails();

	const onSelect = useCallback(async () => {
		await addGithubProject(project.id, repo);

		mutate(getGitIntegrations(project.id));
	}, [repo]);
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

			<TextBlock className={"mt-08"} fontSize={"12"} color={"#787878"}>
				Learn more about login for connection
			</TextBlock>
		</div>
	);
}

const useGithubAuthorize = () => {
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
				className={"mt-40"}
				css={css`
					padding: 20rem 28rem 24rem !important;
				`}
			>
				<div
					className={"font-cera font-700 mb-8 leading-none"}
					css={css`
						font-size: 15rem;
						color: white;
					`}
				>
					Connect a git repository
				</div>
				<TextBlock fontSize={12} color={"#787878"}>
					Seamless test builds for commits pushed to your repository.
				</TextBlock>

				<div className={"mt-24"}>
					<Button
						bgColor={"tertiary-white"}
						onClick={onGithubClick.bind(this, false)}
						css={css`
							border-width: 0;
							background: #fff !important;
							:hover {
								border-width: 0;
								background: #fff !important;
							}
						`}
					>
						<div className={"flex items-center"}>
							<GithubSVG
								css={css`
									path {
										fill: #000 !important;
									}
								`}
								height={"12rem"}
								width={"12rem"}
								className={"mt-1"}
							/>
							<span className={"mt-2 ml-8"}>Github</span>
						</div>
					</Button>
				</div>
			</Card>

			<TextBlock className={"mt-12 ml-28"} fontSize={"12"} color={"#787878"}>
				Docs for gihub integration
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
	const { currentProject: project } = useProjectDetails();
	const { data: linkedRepos } = useSWR(getGitIntegrations(project.id));

	const { repoName, projectId, repoLink, id: id } = linkedRepos.linkedRepo;

	const unlinkRepoCallback = useCallback(async () => {
		await unlinkRepo(projectId, id);
		mutate(getGitIntegrations(project?.id));
	}, [linkedRepos]);

	return (
		<div
			css={css`
				display: block;
			`}
			className={"w-full"}
		>
			<Card
				className={"mt-28 mb-32"}
				css={css`
					padding: 22rem 28rem 26rem;
					background: #101215;
				`}
			>

				<TextBlock weight={500} className="mb-8" fontSize={14}>Connected to</TextBlock>

				<div className={"flex text-13 justify-between mt-20"}>
					<div className={"flex items-start"}>
						<div
							className="flex items-center justify-center mr-16"
							css={css`
								min-width: 28px;
								min-height: 28px;
								border-radius: 10rem;
								background: #ffffff29;
							`}
						>
							<GithubSVG />
						</div>

						<div>
							<TextBlock weight={600} className="mb-8" fontSize={14}>{repoName}</TextBlock>
							<a href={repoLink} target={"_blank"}>
								<TextBlock color="#787878" className="mb-8" fontSize={12}>{repoLink}</TextBlock>

							</a>
						</div>
					</div>

					<Button
						size={"small"}
						bgColor={"danger"}
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

const GitSVG = (props) => (
	<svg width={1034} height={1034} viewBox="-10 -5 1034 1034" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			fill="#ffffff4ag"
			d="M499 228q-21 0-36 15l-73 73 92 92q17-6 34-2t29.5 16.5 16 29.5-1.5 34l88 88q17-5 34-1.5t30 16.5q18 18 18 43.5t-18 43-43.5 17.5-43.5-17q-13-14-16.5-32t3.5-35l-83-83v218q9 4 16 11 18 18 18 43.5T545 842t-43.5 18-43-18-17.5-43.5 18-43.5q8-8 20-13V522q-12-4-20-13-14-13-17.5-31.5T445 442l-90-91-240 240q-15 15-15 36.5t15 36.5l349 349q15 15 36.5 15t36.5-15l348-348q15-15 15-36.5T885 592L536 243q-15-15-37-15z"
		/>
	</svg>
);

function CISection() {
	const { currentProject: project } = useProjectDetails();
	const { data } = useSWR(getCIIntegrationCommnad(project?.id));
	const inputRef = React.useRef(null);

	const copyCommand = React.useCallback(() => {
		inputRef.current.select();
		inputRef.current.setSelectionRange(0, 99999);
		document.execCommand("copy");
		sendSnackBarEvent({ type: "normal", message: "Copied invite link to clipboard" });
	}, inputRef.current);

	return (
		<div>
			<Heading type={1} fontSize={"16"} className={"mb-8 mt-16"}>
				CI/CD
			</Heading>
			<TextBlock fontSize={12} color={"#787878"}>
				Easily integrate and trigger tests from your CI/CD workflow
			</TextBlock>

			<Input
				size={"medium"}
				forwardRef={inputRef}
				rightIcon={
					<CopyIconSVG
						onClick={copyCommand}
						css={css`
							position: relative;
							top: -2rem;
							right: -1rem;
						`}
					/>
				}
				css={css`
					width: 400rem;
					height: 40rem !important;
					margin-top: 20rem;
					input {
						padding-right: 36rem;
					}
				`}
				value={data ?? "Loading.."}
				onFocus={copyCommand}
			/>
		</div>
	);
}

function GitIntegration() {
	const [connectedToGit] = useAtom(connectedToGitAtom);
	const { currentProject: project } = useProjectDetails();
	const { data: linkedRepo } = useSWR(getGitIntegrations(project?.id));

	const hadLinkedRepo = !!linkedRepo?.linkedRepo;
	return (
		<div className={"flex flex-col justify-between items-start mt-44 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div className={"flex"}>
					<GitSVG
						css={css`
							path {
								fill: #fff !important;
							}
						`}
						height={28}
						width={28}
					/>
					<div className={"ml-16"}>
						<Heading type={2} fontSize={"14"} className={"mb-8"}>
							Git Integration
						</Heading>
						<TextBlock fontSize={12} color={"#787878"}>
							Integrate with Github, Gitlab to get checks with each commit
						</TextBlock>
					</div>
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

const getSlackChannelValues = (channels: { name: string; id: string }[] | null) => {
	if (!channels) return [];

	return (
		channels.map((channel) => {
			return { label: channel.name, value: channel.id };
		}) ?? []
	);
};

function SlackIntegration() {
	const { currentProject: project } = useProjectDetails();

	const [isConnected, setIsConnected] = useState(false);
	const [slackChannels, setSlackChannels] = useState(null);
	const [nextCursor, setNextCursor] = useState(null);
	const { data: integrations } = useSWR(getIntegrations(project?.id));

	const [integration, setSlackIntegration] = useState({
		normalChannel: [],
		alertChannel: [],
	});

	useEffect(() => {
		if (integrations?.slackIntegration) {
			console.log("Integrations is", integrations);
			setIsConnected(true);

			const slackIntegrationMeta = integrations.slackIntegration?.meta;

			if (slackIntegrationMeta?.channel) {
				const normalChannel = slackIntegrationMeta.channel.normal;
				const alertChannel = slackIntegrationMeta.channel.alert;

				setSlackIntegration({
					normalChannel: normalChannel ? [{ label: normalChannel.name, value: normalChannel.value }] : [],
					alertChannel: alertChannel ? [{ label: alertChannel.name, value: alertChannel.value }] : [],
				});
			}
		}
	}, [integrations]);

	const fetchSlackChannels = useCallback(async () => {
		const { channels, nextCursor } = await backendRequest(resolvePathToBackendURI(`/integrations/${project.id}/slack/channels`));
		setSlackChannels(channels);
		setNextCursor(nextCursor);
		return channels;
	}, [slackChannels, nextCursor]);

	useEffect(() => {
		if (isConnected) {
			fetchSlackChannels();
		}
	}, [isConnected]);

	const handleSwitch = useCallback((toggleState: boolean) => {
		if (toggleState) {
			const windowRef = openPopup(
				`https://slack.com/oauth/v2/authorize?scope=chat:write,chat:write.public,channels:read,groups:read&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID
				}&redirect_uri=${escape(resolvePathToBackendURI("/integrations/slack/actions/add"))}&state=${encodeURIComponent(
					JSON.stringify({ projectId: project.id, redirectUrl: resolvePathToFrontendURI("/settings/project/integrations") }),
				)}`,
			);
			//@ts-ignore
			const interval = setInterval(() => {
				if (windowRef.closed) return clearInterval(interval);

				const isOnFEPage = windowRef?.location?.href?.includes(window.location.host);
				if (isOnFEPage) {
					setIsConnected(true);
					windowRef.close();
					clearInterval(interval);
				}
			}, 200);
		} else {
			backendRequest(`/integrations/${project.id}/slack/actions/remove`)
				.then(() => {
					setIsConnected(false);
					setSlackIntegration({
						normalChannel: [],
						alertChannel: [],
					});
					sendSnackBarEvent({
						message: "Succesfully disabled slack integration",
						type: "normal",
					});
				})
				.catch(() => {
					sendSnackBarEvent({
						message: "Error disabling slack integration",
						type: "error",
					});
				});
		}
	}, []);

	const handleChannelSelect = (type: "normal" | "alert", selectedValues) => {
		const channelTypeName = type === "normal" ? "normalChannel" : "alertChannel";

		setSlackIntegration((previous) => ({
			...previous,
			[channelTypeName]: selectedValues,
		}));

		const alertChannel = channelTypeName === "alertChannel" ? selectedValues : integration.alertChannel;
		const normalChannel = channelTypeName === "normalChannel" ? selectedValues : integration.normalChannel;

		const alertChannelInfo =
			alertChannel?.[0] && alertChannel[0].label ? alertChannel : getSlackChannelValues(slackChannels).filter((channel) => alertChannel[0] === channel.value);
		const normalChannelInfo =
			normalChannel?.[0] && normalChannel[0].label
				? normalChannel
				: getSlackChannelValues(slackChannels).filter((channel) => normalChannel[0] === channel.value);

		backendRequest(`/integrations/${project.id}/slack/actions/save.settings`, {
			method: RequestMethod.POST,
			payload: {
				alertChannel: alertChannelInfo[0]
					? {
						name: alertChannelInfo[0].label,
						value: alertChannelInfo[0].value,
					}
					: null,
				normalChannel: normalChannelInfo[0]
					? {
						name: normalChannelInfo[0].label,
						value: normalChannelInfo[0].value,
					}
					: null,
			},
		})
			.then((res) => {
				console.log("Res is", res);
				sendSnackBarEvent({
					type: "success",
					message: "Slack integration saved successfully",
				});
			})
			.catch(() => {
				sendSnackBarEvent({
					type: "error",
					message: "Slack integration failed to save",
				});
			});
	};

	const handleScrollEnd = useCallback(async () => {
		if (!nextCursor) return false;
		const { channels, nextCursor: _nextCursor } = await backendRequest(resolvePathToBackendURI(`/integrations/${project.id}/slack/channels`), {
			method: RequestMethod.GET,
			payload: {
				cursor: nextCursor,
			},
		});

		setNextCursor(() => _nextCursor);
		setSlackChannels((previous) => [...previous, ...channels]);
		return true;
	}, [slackChannels, nextCursor]);


	return (
		<div className={"justify-between items-start mt-40 mb-24"}>
			<div className={"flex justify-between items-start w-full"}>
				<div className={"flex"}>
					<img src={"/svg/slack-icon.svg"} width={"20rem"} />
					<div className={"ml-20"}>
						<Heading type={2} fontSize={"15"} className={"mb-8"}>
							Slack Integration
						</Heading>
						<TextBlock fontSize={12} color={"#787878"}>
							Get notifications on build event
						</TextBlock>
					</div>
				</div>
				<Switch

					checked={isConnected}
					onClick={() => {
						if (!isConnected) {
							handleSwitch(true);
						}
					}}
				/>
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
							<div className="flex items-center">
								<label className={"font-600"}>Post notifications to</label>
								<div className="ml-auto" css={selectBoxCSS}>
									<SelectBox
										onScrollEnd={handleScrollEnd}
										dropDownHeight={"214rem"}
										isSearchable={true}
										values={getSlackChannelValues(slackChannels)}
										selected={integration.normalChannel || null}
										placeholder="Select a channel"
										callback={handleChannelSelect.bind(this, "normal")}
									/>
								</div>
							</div>

							<div className="flex mt-20 items-center">
								<label className={"font-600"}>Alerts to</label>
								<div className="ml-auto" css={selectBoxCSS}>
									<SelectBox
										onScrollEnd={handleScrollEnd}
										dropDownHeight={"214rem"}
										isSearchable={true}
										values={getSlackChannelValues(slackChannels)}
										selected={integration.alertChannel || null}
										placeholder="Select a channel"
										callback={handleChannelSelect.bind(this, "alert")}
										css={selectBoxCSS}
									/>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</Conditional>
		</div>
	);
}

const updateWebhookUrl = (webhook: string, projectId: number) => {
	return backendRequest(saveWebhookUrlAPI(projectId), {
		method: RequestMethod.POST,
		payload: {
			webhook: webhook,
		},
	});
};

function WebHookIntegration() {
	const { currentProject: project } = useProjectDetails();
	const { data: integrations } = useSWR(getIntegrations(project?.id));
	const [webhookUrl, setWebhookUrl] = useState(null);

	const [added, setAdded] = useState(false);
	const [isEditable, setIsEditable] = useState(false);

	useEffect(() => {
		if (integrations?.webhook) {
			setWebhookUrl(integrations.webhook);
			setAdded(true);
		}
	}, [integrations]);

	const handleSaveWebhook = () => {
		setIsEditable(false);
		updateWebhookUrl(webhookUrl, project.id)
			.then(() => {
				sendSnackBarEvent({
					type: "success",
					message: "Webhook saved successfully",
				});
			})
			.catch(() => {
				sendSnackBarEvent({
					type: "error",
					message: "Failed to save webhook",
				});
			});
	};

	return (
		<div className={"justify-between items-start mt-24 mb-24"}>
			<div className={"flex justify-between items-center w-full"}>
				<div className={"flex"}>
					<div className={"ml-44"}>
						<Heading type={2} fontSize={"14"} className={"mb-8"}>
							Webhook
						</Heading>
						<TextBlock fontSize={12} color={"#787878"}>
							Get alerts on test fail and important evens
						</TextBlock>
					</div>
				</div>
				<Conditional showIf={added}>
					<div className="flex items-center">
						<Input
							disabled={!isEditable}
							size={"medium"}
							initialValue={webhookUrl}
							css={webhookInputCss(!isEditable)}
							onChange={(evt) => setWebhookUrl(evt.target.value)}
							onReturn={handleSaveWebhook.bind(this)}
							size="small"
							placeholder="enter webhook"
						/>
						<Conditional showIf={isEditable}>
							<Button disabled={webhookUrl && webhookUrl.length < 1} onClick={handleSaveWebhook} size="small" className="ml-4">
								save
							</Button>
						</Conditional>
						<Conditional showIf={!isEditable}>
							<Button
								disabled={false}
								onClick={() => {
									setIsEditable(true);
								}}
								size="small"
								className="ml-4"
							>
								edit
							</Button>
						</Conditional>
					</div>
				</Conditional>
				<Conditional showIf={!added}>
					<div className="flex items-center">
						<Button
							placeholder="enter the URl"
							onClick={() => {
								setAdded(true);
								setIsEditable(true);
							}}
							size="small"
							className="ml-4"
						>
							+ Add
						</Button>
					</div>
				</Conditional>
			</div>
		</div>
	);
}

const webhookInputCss = (isDisabled: boolean) => css`
	input {
		cursor: ${isDisabled ? "not-allowed" : "auto"};
	}
`;
const selectBoxCSS = css`
	width: 200rem;
`;

export const Integrations = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedSection, setShowSelectedSection] = useState(null);

	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const section = query.get("item");
		if (section) {
			setShowSelectedSection(section);
		}
	});

	if (selectedSection) {
		return (
			<SettingsLayout hideSidebar={true}>
				<div className={"text-24 mb-100"} css={maxWidthContainer}>
					<Heading type={1} fontSize={"18"} className={"mb-12"}>
						Integrations
					</Heading>
					<TextBlock fontSize={"12.5"} className={"mb-24"} color={"#787878"}>

					</TextBlock>
					<hr css={basicHR} />
					{selectedSection === "slack" ? (<SlackIntegration />) : ""}
					{selectedSection === "github" ? (<GitIntegration />) : ""}
				</div>
			</SettingsLayout>
		)
	}
	return (
		<SettingsLayout>
			<Conditional showIf={showModal}>
				<AddProjectModal onClose={setShowModal.bind(this, false)} />
			</Conditional>
			<div className={"text-24 mb-100"} css={maxWidthContainer}>
				<Heading type={1} fontSize={"18"} className={"mb-12"}>
					Integrations
				</Heading>
				<TextBlock fontSize={"13"} className={"mb-24"} color={"#787878"}>
					Integrate crusher in your current workflow
				</TextBlock>
				<hr css={basicHR} />
				<SlackIntegration />

				{/* <hr css={basicHR} /> */}
				<GitIntegration />
				<hr css={basicHR} className={"mt-40"} />

				<WebHookIntegration />
				<hr css={basicHR} className={"mt-24 mb-24"} />
				<CISection />
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
