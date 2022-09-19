import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { useAtom } from "jotai";

import { Button } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";

import { AddSVG, LayoutSVG, PlaySVG } from "@svg/dashboard";

import { MenuItemHorizontal, UserNTeam } from "@ui/containers/dashboard/UserNTeam";


import { appStateAtom } from "../../store/atoms/global/appState";
import { projectsAtom } from "../../store/atoms/global/project";
import { buildFiltersAtom } from "../../store/atoms/pages/buildPage";
import { updateMeta } from "../../store/mutators/metaData";
import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { handleTestRun } from "@utils/core/testUtils";

import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Tooltip } from "dyson/src/components/atoms/tooltip/Tooltip";
import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";
import { DiscordSVG } from "@svg/onboarding";
import { GithubSVG } from "@ui/containers/auth/signup";
import { currentProjectSelector } from "@store/selectors/getCurrentProject";
import { LinkBlock } from "dyson/src/components/atoms/Link/Link";
import { useCurrentProject, useProjectDetails } from "@hooks/common";
// const AddProject = dynamic(() => import("@ui/containers/dashboard/AddProject"));
const InviteMembers = dynamic(() => import("@ui/containers/dashboard/InviteMember"));


function ExternalIcon(props) {
	return (
		<svg
			width={8}
			height={8}
			fill="none"
			viewBox="0 0 8 8"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.32.487c.24.216.26.584.044.824L1.67 7.486c-.216.239-.76.215-1 0-.24-.216-.216-.761 0-1L6.497.53A.583.583 0 017.32.487z"
				fill="#3C3C3D"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.522 1.256a.583.583 0 01.552-.613L6.9.338a.583.583 0 01.613.552l.305 5.825a.583.583 0 01-1.165.061l-.275-5.242-5.242.274a.583.583 0 01-.614-.552z"
				fill="#3C3C3D"
			/>
		</svg>
	);
}


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



function Menu(props) {
	return (
		<svg width={11} height={12} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.202.898a1.016 1.016 0 01.909 0L6.815 2.25a.207.207 0 00.182 0l2.096-1.048a1.016 1.016 0 011.47.908v6.763c0 .385-.218.737-.562.908l-2.64 1.32a1.016 1.016 0 01-.909 0L3.747 9.75a.203.203 0 00-.182 0L1.47 10.798A1.016 1.016 0 010 9.89V3.127c0-.385.217-.737.561-.909l2.64-1.32zm.454 1.852a.406.406 0 01.406.407v4.468a.406.406 0 01-.812 0V3.157a.406.406 0 01.406-.407zm3.656 1.625a.406.406 0 10-.812 0v4.47a.406.406 0 00.813 0v-4.47z"
				fill="#BDBDBD"
			/>
		</svg>
	);
}

function Icon2(props) {
	return (
		<svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.875 5.735v1.046c0 .605.49 1.094 1.094 1.094H12.03c.604 0 1.094-.49 1.094-1.094V5.735c0-.417-.15-.821-.421-1.138L10.788 2.36a1.75 1.75 0 00-1.33-.611H4.542a1.75 1.75 0 00-1.329.611L1.296 4.597a1.75 1.75 0 00-.421 1.138zm3.666-3.11a.875.875 0 00-.664.306L2.264 4.812H4.11a1.75 1.75 0 011.456.78l.096.143a.875.875 0 00.728.39h1.22a.875.875 0 00.728-.39l.096-.143a1.75 1.75 0 011.456-.78h1.846l-1.613-1.881a.876.876 0 00-.664-.306H4.54z"
				fill="#BDBDBD"
			/>
			<path
				d="M1.64 8.75a.766.766 0 00-.765.766v.984a1.75 1.75 0 001.75 1.75h8.75a1.75 1.75 0 001.75-1.75v-.985a.766.766 0 00-.766-.765H9.89a1.75 1.75 0 00-1.455.78l-.096.143a.875.875 0 01-.728.39H6.39a.875.875 0 01-.728-.39l-.096-.144A1.75 1.75 0 004.11 8.75H1.64z"
				fill="#BDBDBD"
			/>
		</svg>
	);
}

function Icon3(props) {
	return (
		<svg width={13} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.219 1.219a.406.406 0 100 .812h.406V7.72A1.625 1.625 0 003.25 9.344h.655l-.634 1.903a.406.406 0 00.77.256l.18-.534H8.78l.179.534a.406.406 0 00.77-.256l-.634-1.903h.655a1.625 1.625 0 001.625-1.625V2.03h.406a.406.406 0 100-.812H1.22zM4.76 9.344H8.24l.27.812H4.49l.271-.812zm4.38-4.873a.406.406 0 10-.407-.703A6.939 6.939 0 006.807 5.42l-.832-.832a.406.406 0 00-.575 0L3.775 6.213a.406.406 0 10.575.574L5.688 5.45l.875.877a.406.406 0 00.621-.056 6.127 6.127 0 011.957-1.799z"
				fill="#BDBDBD"
			/>
		</svg>
	);
}

const leftMenu = [
	{
		icon: <Menu />,
		label: "projects",
		link: "/projects",
	},
	{
		icon: <Icon2 />,
		label: "integrations",
		link: "/app/add_project",
	},
	{
		icon: <Icon3 />,
		label: "settings",
		link: "/app/add_project_1",
	},
];



const projectMenu = [
	{
		icon: <Menu />,
		label: "tests",
		link: "/tests",
	},
	{
		icon: <Icon2 />,
		label: "builds",
		link: "/builds",
	},
	{
		icon: <Icon3 />,
		label: "monitoring",
		link: "/builds?trigger=CRON",
	},
	{
		icon: <Icon3 />,
		label: "Settings",
		link: "/settings/project/basic",
	},
];


function Chat(props) {
	return (
		<svg width={14} height={14} viewBox={"0 0 14 14"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M12.17 1H1.83c-.7 0-1.292.6-1.292 1.31v7.2c0 .709.592 1.308 1.293 1.308h3.135l1.874 2.11a.214.214 0 00.32 0l1.874-2.11h3.135c.7 0 1.292-.6 1.292-1.309v-7.2C13.461 1.6 12.87 1 12.17 1z"
				fill="#838383"
			/>
		</svg>
	);
}

function NewPeople(props) {
	return (
		<svg width={12} height={12} viewBox={"0 0 13 13"} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M4.776 7.97c2.59 0 4.777.426 4.777 2.072 0 1.646-2.2 2.058-4.777 2.058C2.186 12.1 0 11.673 0 10.028 0 8.382 2.2 7.97 4.776 7.97zm6.05-4.786c.316 0 .572.261.572.58v.75h.766c.316 0 .573.26.573.58 0 .32-.257.581-.573.581h-.766v.75c0 .32-.256.58-.572.58a.578.578 0 01-.573-.58v-.75h-.765a.577.577 0 01-.572-.58c0-.32.256-.581.572-.581h.765v-.75c0-.319.257-.58.573-.58zM4.776 0c1.755 0 3.16 1.424 3.16 3.201 0 1.777-1.405 3.202-3.16 3.202-1.754 0-3.16-1.425-3.16-3.202S3.022 0 4.776 0z"
				fill="#BC66FF"
			/>
		</svg>
	);
}

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
							const selected = item.link === route;
							return (
								<Link href={`/${project?.id}/${item.link}`} key={item.link} >
									<div className="flex items-center pl-8 mb-8" css={[menuItem, selected && selectedCSS]}>
										<div css={iconCSS}>{item.icon}</div>
										<span className="label">{item.label}</span>
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
						<Tooltip content={"settings"} placement="top" type="hover">
							<div css={[menuItemCSS, border]}>
								<Link href="/settings/project/basic">
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
function Slash(props) {
	return (
		<svg width={13} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M9.528 3.4a.722.722 0 00-1.022 0L3.4 8.506a.722.722 0 101.022 1.022L9.528 4.42a.722.722 0 000-1.021z" fill="#343336" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 2.167C0 .97.97 0 2.167 0h8.666C12.03 0 13 .97 13 2.167v8.666C13 12.03 12.03 13 10.833 13H2.167A2.167 2.167 0 010 10.833V2.167zm2.167-.723h8.666c.4 0 .723.324.723.723v8.666a.722.722 0 01-.723.723H2.167a.722.722 0 01-.723-.723V2.167c0-.4.324-.723.723-.723z"
				fill="#343336"
			/>
		</svg>
	);
}

function Book(props) {
	return (
		<svg width={9} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M1.418 11.137c-.784 0-1.418.498-1.418 1.1 0 .615.634 1.1 1.418 1.1h7.58c-.616-.656-.616-1.547 0-2.203h-7.58v.003z" fill="#222225" />
			<path
				d="M1.418 11.137c-.784 0-1.418.498-1.418 1.1 0 .615.634 1.1 1.418 1.1h7.58c-.616-.656-.616-1.547 0-2.203h-7.58v.003z"
				fill="#FFFCFC"
				fillOpacity={0.08}
			/>
			<path d="M1.102.052c-.634.19-1.1.89-1.1 1.737v9.315a2.08 2.08 0 011.1-.487V.052z" fill="#222225" />
			<path d="M1.102.052c-.634.19-1.1.89-1.1 1.737v9.315a2.08 2.08 0 011.1-.487V.052z" fill="#FFFCFC" fillOpacity={0.08} />
			<path d="M4.5 0v2.7l-1.092-.688L2.32 2.7V0h-.678v10.587H9V0H4.5z" fill="#222225" />
			<path d="M4.5 0v2.7l-1.092-.688L2.32 2.7V0h-.678v10.587H9V0H4.5z" fill="#FFFCFC" fillOpacity={0.08} />
		</svg>
	);
}

function Gear(props) {
	return (
		<svg width={13} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M.55 7.482l.851.005c.128.656.38 1.293.762 1.871l-.605.6a.553.553 0 00-.005.78l.653.662a.553.553 0 00.78.005l.605-.6c.573.388 1.208.65 1.863.783l-.005.852a.552.552 0 00.55.555l.928.005a.552.552 0 00.555-.55l.005-.851a5.183 5.183 0 001.871-.762l.6.605a.553.553 0 00.78.005l.662-.653a.553.553 0 00.005-.78l-.6-.605c.388-.573.65-1.208.783-1.863l.852.005a.552.552 0 00.555-.55L13 6.074a.552.552 0 00-.55-.555l-.851-.005a5.183 5.183 0 00-.762-1.871l.605-.6a.553.553 0 00.005-.78l-.653-.662a.553.553 0 00-.78-.005l-.605.6a5.153 5.153 0 00-1.863-.783L7.55.56a.552.552 0 00-.55-.555L6.074 0a.552.552 0 00-.555.55L5.51 1.4a5.145 5.145 0 00-1.871.762l-.6-.605a.553.553 0 00-.78-.005l-.659.653a.553.553 0 00-.005.78l.6.605a5.153 5.153 0 00-.783 1.863L.56 5.45a.552.552 0 00-.555.55L0 6.926a.553.553 0 00.55.555zM4.758 4.74a2.47 2.47 0 013.495.019 2.47 2.47 0 01-.018 3.495 2.47 2.47 0 01-3.496-.018A2.47 2.47 0 014.76 4.74z"
				fill="#343336"
			/>
		</svg>
	);
}

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

	.label {
		color: #d378fe;
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




function RunTest() {
	const router = useRouter();
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const { query } = router;
	const [filters] = useAtom(buildFiltersAtom);
	const [, updateMetaData] = useAtom(updateMeta);

	const runProjectTest = useCallback(() => {
		(async () => {
			await handleTestRun(selectedProjectId, query, filters, router, updateMetaData);

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
		<Button bgColor={"tertiary"} onClick={runProjectTest}>
			<div className={"flex items-center"}>
				<PlaySVG className={"mr-12"} />
				Run tests
			</div>
		</Button>
	);
}

function TopNavbar({ children }) {

	return (
		<div css={[nav]}>
			<div css={[containerWidth]}>{children}</div>
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

						<a href="https://docs.crusher.dev" target="_blank">
							<TextBlock color={"#6b6565"} className={"flex"} css={textLink}>
								<External className="mr-8" />
								Docs
							</TextBlock>
						</a>
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
	//width: calc(100vw - 250rem);
	//max-width: 1100%;

	width: 1140rem;
	max-width: calc(100vw - 352rem);
	margin: 0 auto;
	padding: 0 0;
`;

const scrollContainer = css`
	overflow-y: scroll;
	height: calc(100vh - 56rem);
	padding-left: 12px;
`;
