import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { useAtom } from "jotai";

import { Button } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";

import { Book, BuildIcon, Chat, ClockIcon, ExternalIcon, Gear, HomeIcon, IntegrationSVG, MapSVG, NewPeople, PlayIcon, PlusCircle, TestIcon } from "@svg/dashboard";

import { UserNTeam } from "@ui/containers/dashboard/UserNTeam";


import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { handleTestRun } from "@utils/core/testUtils";
import { projectsAtom } from "../../store/atoms/global/project";
import { buildFiltersAtom } from "../../store/atoms/pages/buildPage";
import { updateMeta } from "../../store/mutators/metaData";

import { DiscordSVG } from "@svg/onboarding";
import { GithubSVG } from "@ui/containers/auth/signup";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Tooltip } from "dyson/src/components/atoms/tooltip/Tooltip";
import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";

import { useProjectDetails } from "@hooks/common";
import { LinkBlock } from "dyson/src/components/atoms/Link/Link";
import Download from "@ui/containers/dashboard/Download";
// const AddProject = dynamic(() => import("@ui/containers/dashboard/AddProject"));
const InviteMembers = dynamic(() => import("@ui/containers/dashboard/InviteMember"));




function HelpContent() {
	return (
		<div className=" pt-3 pb-6">

			<a href="https://docs.crusher.dev" target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} css={linkCSS}>
					Documentation <ExternalIcon className="ml-3" />
				</TextBlock>
			</a>
			<a href="https://github.com/crusher-dev/crusher" target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} className={"mt-1"} css={linkCSS}>
					<GithubSVG height={11} width={11} className={"mr-6"} /> <span className="mt-2">Github</span><ExternalIcon className="ml-4" />
				</TextBlock>
			</a>
			<a href="https://discord.com/invite/dHZkSNXQrg" target="_blank">
				<TextBlock fontSize={13.4} color={"#8F8F8F"} className={"mt-1"} css={linkCSS}>
					<DiscordSVG height={12} width={13} className={"mr-6"} css={discordIcons} /> <span className="mt-1">Discord</span><ExternalIcon className="ml-3" />
				</TextBlock>
			</a>
		</div>
	);
}


const discordIcons = css`
margin-left: -1rem;
`

const linkCSS = css`
display: flex;
align-items: center;
padding-left: 8rem;
padding-right: 8rem;
path{
	fill: #D1D5DB;
}
color: #D1D5DB;
:hover{
	background: rgba(43, 43, 43, 0.4);
	color: #BC66FF;
	path{
		fill: #BC66FF;
	}
}
height:28rem;
width: 148rem;
border-radius: 6px;
padding-top:1rem;

transition: all 0ms linear;

path, *{
	transition: all 0ms;
}


`

const leftMenu = [
	{
		icon: <MapSVG />,
		label: "projects",
		link: "/projects",
	},
	{
		icon: <IntegrationSVG />,
		label: "integrations",
		link: "/add_project",
	}
];



const projectMenu = [
	{
		icon: <HomeIcon />,
		label: (<span className="mt-3">home</span>),
		link: "/dashboard",
		isProject: true
	},
	{
		icon: <TestIcon />,
		label: "tests",
		link: "/tests",
		isProject: true
	},
	{
		icon: <BuildIcon />,

		label: (<span className="mt-3">builds</span>),
		link: "/builds",
		isProject: true
	},
	{
		icon: <ClockIcon />,
		label: "monitoring",
		link: "/builds?trigger=CRON",
		isProject: true
	},
	{
		icon: <Gear />,
		label: "settings",
		link: "/settings/basic",
		isProject: true
	},
];



const ResourceBar = () => {
	return (
		<React.Fragment>
			<div className="flex justify-between mb-8 item-center px-6">
				<TextBlock color="#597eff" fontSize={12.6} weight={500} className="mt-2">Free plan</TextBlock>

				<LinkBlock color="#" type="plain" paddingX={0} paddingY={0} css={linkCSSBlock} external={false}>upgrade</LinkBlock>
			</div>
			<Tooltip content={"You have 2 more tests and 5 hr limit. contact support@crusher.dev"} placement="top-end" type="hover">
				<div css={badgeStyle} className="flex">
					<div className="test-count pl-2">2/3</div>
					<div className="hours-count">5 hrs</div>
				</div>
			</Tooltip>
		</React.Fragment>
	)
};

const linkCSSBlock = css`
	color: #5F5F5F;
	font-size: 12.6rem;
	:hover{
		color: #ffffff;
		path{
			fill:  #ffffff;
		}
	}
	
	transition: all 0ms linear;
`
function LeftSection() {
	const router = useRouter();
	const [inviteTeammates, setInviteTeamMates] = useState(false);
	const { route } = router;
	const { currentProject: project } = useProjectDetails()


	const menuItems = !!project ? projectMenu : leftMenu;

	return (
		<div css={sidebar} className={"flex flex-col justify-between pb-18"}>
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

							const isLabelString = typeof (item.label) === 'string';

							return (
								<Link href={link} key={item.link} >
									<div className="flex items-center pl-8 mb-8" css={[menuItem, selected && selectedCSS]}>
										<div css={iconCSS}>{item.icon}</div>
										<Conditional showIf={isLabelString}>
											<span className="label mt-1 leading-none">{item.label}</span>
										</Conditional>
										<Conditional showIf={!isLabelString}>
											{item.label}
										</Conditional>
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

						<div className="flex items-center pt-1" css={feedbackCSS}>
							<Chat className="mr-8" />
							<TextBlock fontSize={12} color="#838383">
								Give feedback
							</TextBlock>
						</div>


					</div>

					<div css={leftBottomBar} className="w-full flex mt-20">
						<Tooltip content={"Org settings"} placement="top" type="hover">
							<div css={[menuItemCSS, border]}>
								<Link href="/settings/org/team-members">
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


const feedbackCSS = css`
	:hover {
		div,
		span {
			color: #fff;
		}
		path {
			fill: #fff;
		}
	}
`;

const inviteBoxCSS = css`
	:hover {
		#invite {
			color: #fff;
		}
		path {
			fill: #fff;
		}
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



const menuItemCSS = css`
	flex: 1;
	:hover {
		background-color: rgba(255, 255, 255, 0.05);
		path {
			fill: #bc66ff;
		}
	}
`;

const border = css`
	border-right: 0.6px solid #222225;
`;
const leftBottomBar = css`
	height: 28px;

	border: 0.6px solid #222225;
	border-radius: 8px;
	overflow: hidden;
`;
const iconCSS = css`
	width: 16rem;
	height: 16rem;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const selectedCSS = css`
	background: rgba(255, 255, 255, 0.04);
	border: 0.5px solid rgba(255, 255, 255, 0.08);

	.label,span {
		color: #B960FF;
	}

	path{
		fill: #B960FF;
	}
`;

const menuItem = css`
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

	path{
		fill: #BDBDBD;
	}
`;

export const dropdDown = css`
	bottom: -10px;
	left: calc(100% - 4px);
	position: absolute;
	width: 206.03px;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.4);
	padding: 8rem 0;
	z-index: 1;
`;




function CreateTest() {
	const [showCreateTest, setShowCreateTest] = useState(false)

	const runProjectTest = useCallback(() => {
		setShowCreateTest(true)
	}, []);

	return (
		<React.Fragment>
			<Conditional showIf={showCreateTest}>
				<Download onClose={setShowCreateTest.bind(this, false)} />
			</Conditional>
			<Button bgColor={"tertiary"} onClick={runProjectTest} css={creatTestCSS}>
				<div className={"flex items-center"}>
					<PlusCircle className={"mr-6"} />
					<span className="mt-1">
						new test
					</span>
				</div>
			</Button>
		</React.Fragment>
	);
}

function RunTest() {
	const router = useRouter();
	const { currentProject } = useProjectDetails()
	const { query } = router;
	const [filters] = useAtom(buildFiltersAtom);
	const [, updateMetaData] = useAtom(updateMeta);

	const runProjectTest = useCallback(() => {
		(async () => {
			await handleTestRun(currentProject?.id, query, filters, router, updateMetaData);

			updateMetaData({
				type: "user",
				key: USER_META_KEYS.RAN_TEST,
				value: true,
			});

			updateMetaData({
				type: "project",
				key: PROJECT_META_KEYS.RAN_TEST,
				value: true,
			});
		})();
	}, []);

	return (
		<Button bgColor={"tertiary"} onClick={runProjectTest} css={runTestCSS}>
			<div className={"flex items-center"}>
				<PlayIcon className={"mr-6"} />
				<span className="mt-1">
					Run tests
				</span>
			</div>
		</Button>
	);
}

const runTestCSS = css`
	padding: 0 10rem;

	font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13px;

color: #FFFFFF;

width: max-content;


background: #A742F7;
border: 1px solid #7D41AD;
border-radius: 8px;

:hover{
	background: #A742F7;
	filter: brighntess(.7);
	border: 1px solid #7D41AD;
}
`

const creatTestCSS = css`
padding: 0 10rem;
font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13px;

color: #FFFFFF;

width: max-content;

background: #0D0D0D;
border: 0.5px solid rgba(219, 222, 255, 0.16);
border-radius: 8px;

:hover{
	background: #313131;
	filter: brighntess(.8);
}
`

function TopNavbar({ children }) {

	return (
		<div css={[nav]}>
			<div css={[containerWidth, contentContainer]}>{children}</div>
		</div>
	);
}

function External(props) {
	return (
		<svg width={11} height={11} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M10.5 1.625v8.25c0 .621-.504 1.125-1.125 1.125h-8.25A1.125 1.125 0 010 9.875v-8.25C0 1.004.504.5 1.125.5h8.25c.621 0 1.125.504 1.125 1.125zM8.437 2H5.813c-.5 0-.752.606-.398.96l.75.75-4.583 4.583a.281.281 0 000 .397l.728.728c.11.11.288.11.397 0L7.29 4.835l.75.75c.352.352.96.105.96-.398V2.562A.563.563 0 008.437 2z"
				fill="#6b6565"
			/>
		</svg>
	);
}

const ProjectSection = () => {
	const { currentProject } = useProjectDetails()
	const [projects] = useAtom(projectsAtom);
	const isCurrentProject = !!currentProject;
	if (isCurrentProject) {
		return (
			<div css={projectsLabel} className={"flex items-center w-full"}>
				<Link href="/projects">
					<span css={projectIcon}>projects</span>
				</Link>
				<span>/ {currentProject.name}</span>

			</div>
		)
	}
	return (
		<div css={projectsLabel} className={"flex items-center w-full"}>
			<span>projects</span>
			<span className="badge flex items-center justify-center pt-1 ml-8">{projects.length}</span>
		</div>
	)
}

const projectIcon = css`

font-size: 13rex;
margin-right: 3px;
:hover{
	text-decoration: underline;
	color: #fff;
	transition: all 0ms linear;
	// cursor: pointer;
}
`

export const SidebarTopBarLayout = ({ children, noContainerWidth = false, hideSidebar = false, setContainerWidth = true }) => {
	return (
		<div className={"flex"} css={background}>
			<Conditional showIf={!hideSidebar}>
				<LeftSection />
			</Conditional>

			<div className={"w-full"}>
				<TopNavbar>
					<div className="flex items-center h-full">
						<ProjectSection />

						<NavBarLeft />
					</div>
				</TopNavbar>
				<div
					css={[
						scrollContainer,
						noContainerWidth
							? css`
									overflow-y: overlay;
							  `
							: undefined,
					]}
					className={"custom-scroll relative"}
				>
					<div css={[!noContainerWidth ? setContainerWidth && containerWidth : null]}>{children}</div>
				</div>
			</div>
		</div>
	);
};

const textLink = css`
	:hover {
		color: #d378fe;
		path {
			fill: #d378fe;
		}
	}
`;

const projectsLabel = css`
	gap: 2rem;
	font-family: "Cera Pro";
	font-weight: 400;
	font-size: 13px;
	color: #6b6565;
	letter-spacing: 0.02em;

	height: 56rem;

	.badge {
		width: 32px;
		height: 20px;
		background: rgba(78, 78, 78, 0.06);
		border: 1px solid #c275ff;
		border-radius: 16px;
		font-weight: 500;
		color: #aaaaaa;
		font-size: 12.5rem;
	}
`;

const background = css`
	background: #080808;
	min-height: 100vh;
`;

const sidebar = css`
	width: 312rem;
	height: 100vh;
	border-right: 0.5px solid #1b1b1b;
	box-sizing: border-box;
	background: #0b0b0c;
	justify-content: flex-start;
`;

const nav = css`
	width: 100%;
	border-bottom: 0.5px solid #1b1b1b;
	height: 56rem;
`;
const containerWidth = css`
	margin: 0 auto;
`;


export const contentContainer = css`
 width: 1280rem;
max-width: calc(100vw - 352rem);
`

export const contentContainerScroll = css`
width: 1280rem;
max-width: calc(100vw - 328rem);
padding-left: 20rem;
`
const scrollContainer = css`
	overflow-y: scroll;
	height: calc(100vh - 56rem);
`;
function NavBarLeft() {
	const { currentProject } = useProjectDetails()
	return <div className="flex items-center" css={rightNavbar}>
		<Conditional showIf={!!currentProject}>
			<RunTest />
			<CreateTest />
		</Conditional>
		<a href="https://docs.crusher.dev" target="_blank">
			<TextBlock color={"#6b6565"} className={"flex ml-4	"} css={textLink}>
				<External className="mr-8" />
				Docs
			</TextBlock>
		</a>
	</div>;
}


const rightNavbar = css`
	gap: 8px;
`