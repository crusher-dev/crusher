import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { LinkBlock } from "dyson/src/components/atoms/Link/Link";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Tooltip } from "dyson/src/components/atoms/tooltip/Tooltip";
import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";
import { Conditional } from "dyson/src/components/layouts";

import { useProjectDetails } from "@hooks/common";
import { Book, Gear, NewPeople } from "@svg/dashboard";
import { BuildIcon, ClockIcon, ExternalIcon, HomeIcon, IntegrationSVG, MapSVG, TestIcon, UpgradeIcon } from "@svg/dashboard";
import { DiscordSVG } from "@svg/onboarding";
import { GithubSVG } from "@svg/social";
import { UserNTeam } from "@ui/containers/dashboard/UserNTeam";

import { GiveFeedback } from "../containers/dashboard/GiveFeedback";

export const InviteMembers = dynamic(() => import("@ui/containers/dashboard/InviteMember"));

export function LeftSection() {
	const [inviteTeammates, setInviteTeamMates] = useState(false);
	const { route } = useRouter();
	const { currentProject: project } = useProjectDetails();

	const menuItems = project ? projectMenu : leftMenu;

	const { query } = useRouter()
	const { project_id } = query;

	const isProject = !!project_id;
	const settingsLink = isProject ? `/${project_id}/settings/basic` : "/settings/org/team-members";

	return (
		<div css={sidebar} className={"flex flex-col justify-between pb-18"} id="left-section">
			<UserNTeam />
			<div className="flex flex-col justify-between h-full">
				<div>
					<div className="px-14 mt-38 mb-24">
						<ResourceBar />
					</div>
					<div className="px-14">
						{menuItems.map((item) => {
							const selected = route.includes(item.link);
							const { isProject } = item;

							const link = isProject ? `/${project?.id}${item.link}` : item.link;

							const isLabelString = typeof item.label === "string";

							return (
								<Link href={link} key={item.link}>
									<div className="flex items-center pl-8 mb-8" css={[menuItem, selected && selectedCSS]}>
										<div css={iconCSS}>{item.icon}</div>
										<Conditional showIf={isLabelString}>
											<span className="label mt-1 leading-none">{item.label}</span>
										</Conditional>
										<Conditional showIf={!isLabelString}>{item.label}</Conditional>
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				<div className="px-16">
					<div className="flex" css={inviteBoxCSS}>
						<NewPeople />
						<Conditional showIf={inviteTeammates}>
							<InviteMembers onClose={setInviteTeamMates.bind(this, false)} />
						</Conditional>
						<div className="ml-6">
							<TextBlock color="#BC66FF" fontSize={13} weight={600} id="invite" onClick={setInviteTeamMates.bind(this, true)}>
								Invite
							</TextBlock>
							<TextBlock color="#3E3E3E" fontSize={12} className="mt-5">
								get +2 testing hrs
							</TextBlock>
						</div>
					</div>

					<div className="flex justify-between mt-20">
						<GiveFeedback />
					</div>

					<div css={leftBottomBar} className="w-full flex mt-20">
						<Tooltip content={"settings"} placement="top" type="hover">
							<div css={[menuItemCSS, border]}>
								<Link href={settingsLink}>
									<div className="h-full w-full flex items-center justify-center">
										<Gear />
									</div>
								</Link>
							</div>
						</Tooltip>

						<HoverCard content={<HelpContent />} placement="top" type="hover" padding={8} offset={0}>
							<div css={[menuItemCSS]} className="flex items-center justify-center">
								<Book />
							</div>
						</HoverCard>
						{/* <div css={[menuItemCSS]} className="flex items-center justify-center">
                <Slash />
            </div> */}
					</div>
				</div>
			</div>
		</div>
	);
}

const sidebar = css`
	width: 312rem;
	height: 100vh;
	border-right: 0.5px solid #1b1b1b;
	box-sizing: border-box;
	background: #0b0b0c;
	justify-content: flex-start;
`;

export const leftMenu = [
	{
		icon: <MapSVG />,
		label: "projects",
		link: "/projects",
	},
	// {
	// 	icon: <IntegrationSVG />,
	// 	label: "integrations",
	// 	link: "/add_project",
	// },
];

export const projectMenu = [
	{
		icon: <HomeIcon />,
		label: <span className="mt-3">home</span>,
		link: "/dashboard",
		isProject: true,
	},
	{
		icon: <TestIcon />,
		label: "tests",
		link: "/tests",
		isProject: true,
	},
	{
		icon: <BuildIcon />,

		label: <span className="mt-3">builds</span>,
		link: "/builds",
		isProject: true,
	},
	{
		icon: <ClockIcon />,
		label: "monitoring",
		link: "/builds?trigger=CRON",
		isProject: true,
	},
	{
		icon: <Gear />,
		label: "settings",
		link: "/settings/basic",
		isProject: true,
	},
];

export function HelpContent() {
	return (
		<div className=" pt-3 pb-6">
			<a href="https://docs.crusher.dev" target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} css={linkCSS}>
					Documentation <ExternalIcon className="ml-3" />
				</TextBlock>
			</a>
			<a href="https://github.com/crusher-dev/crusher" target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} className={"mt-1"} css={linkCSS}>
					<GithubSVG height={11} width={11} className={"mr-6"} /> <span className="mt-2">Github</span>
					<ExternalIcon className="ml-4" />
				</TextBlock>
			</a>
			<a href="https://discord.com/invite/dHZkSNXQrg" target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} className={"mt-1"} css={linkCSS}>
					<DiscordSVG height={12} width={13} className={"mr-6"} css={discordIcons} /> <span className="mt-1">Discord</span>
					<ExternalIcon className="ml-3" />
				</TextBlock>
			</a>
		</div>
	);
}

const discordIcons = css`
	margin-left: -1rem;
`;

const linkCSS = css`
	display: flex;
	align-items: center;
	padding-left: 8rem;
	padding-right: 8rem;
	path {
		fill: #d1d5db;
	}
	color: #d1d5db;
	:hover {
		background: rgba(43, 43, 43, 0.4);
		color: #bc66ff;
		path {
			fill: #bc66ff;
		}
	}
	height: 28rem;
	width: 148rem;
	border-radius: 6px;
	padding-top: 1rem;

	transition: all 0ms linear;

	path,
	* {
		transition: all 0ms;
	}
`;

export const menuItemCSS = css`
	flex: 1;
	:hover {
		background-color: rgba(255, 255, 255, 0.05);
		path {
			fill: #bc66ff;
		}
	}
`;

export const border = css`
	border-right: 0.6px solid #222225;
`;
export const leftBottomBar = css`
	height: 28px;

	border: 0.6px solid #222225;
	border-radius: 8px;
	overflow: hidden;
`;

export const inviteBoxCSS = css`
	:hover {
		#invite {
			color: #fff;
		}
		path {
			fill: #fff;
		}
	}
`;

export const iconCSS = css`
	width: 16rem;
	height: 16rem;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const selectedCSS = css`
	background: rgba(255, 255, 255, 0.04);
	border: 0.5px solid rgba(255, 255, 255, 0.08);

	.label,
	span {
		color: #b960ff;
	}

	path {
		fill: #b960ff;
	}
`;

export const menuItem = css`
	height: 28rem;
	gap: 8rem;
	font-size: 13.5rem;
	font-weight: 500;
	border-radius: 8rem;
	box-sizing: border-box;
	border: 0.5px solid transparent;

	:hover {
		background: rgba(255, 255, 255, 0.04);
		border: 0.5px solid rgba(255, 255, 255, 0.08);
	}

	path {
		fill: #bdbdbd;
	}
`;

const badgeStyle = css`
	border: 0.5rem solid #222225;
	background: black;
	.test-count,
	.hours-count {
		width: 50%;
		height: 28rem;

		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 2rem;

		color: #b0b0b0;
		font-size: 13rem;
		font-weight: 500;
	}
	.test-count {
		border-right: 0.5rem solid #222225;
	}
	:hover {
		background: #171718;
	}
	border-radius: 10rem;
	overflow: hidden;
`;
export const ResourceBar = () => {
	return (
		<React.Fragment>
			<Tooltip content={"contact support@crusher.dev for plan upgrade"} placement="top-end" type="hover">
				<div>
					<div css={badgeStyle} className="flex">
						<div className="test-count pl-2">2/3</div>
						<div className="hours-count">5 hrs</div>
					</div>
					<div className="flex justify-center mt-8 item-center px-6">
						<TextBlock color="#597eff" fontSize={12.6} weight={500} className="mt-3 lowercase mr-8">
							Free plan
						</TextBlock>

						<div className="flex">
							<UpgradeIcon className="mr-4" />
							<LinkBlock color="#" type="plain" paddingX={0} paddingY={0} css={linkCSSBlock} external={false}>
								upgrade
							</LinkBlock>
						</div>
					</div>
				</div>
			</Tooltip>
		</React.Fragment>
	);
};

const linkCSSBlock = css`
	color: #5f5f5f;
	font-size: 12.6rem;
	:hover {
		color: #ffffff;
		path {
			fill: #ffffff;
		}
	}

	transition: all 0ms linear;
`;
