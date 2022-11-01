import { getIntegrations } from "@constants/api";
import { css } from "@emotion/react";
import { useProjectDetails } from "@hooks/common";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { openPopup } from "@utils/common/domUtils";
import { sendSnackBarEvent } from "@utils/common/notify";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/common/url";
import { TextBlock } from "dyson/src/components/atoms";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import Switch from "dyson/src/components/atoms/toggle/switch";
import { Conditional } from "dyson/src/components/layouts";
import { Card } from "dyson/src/components/layouts/Card/Card";
import { SelectBox } from "dyson/src/components/molecules/Select/Select";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { getSlackChannelValues } from "./helper";

export const SlackIntegration = () => {
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

const selectBoxCSS = css`
    width: 200rem;
`;