import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { useAtom } from "jotai";

import { Button } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Dropdown } from "dyson/src/components/molecules/Dropdown";

import { MenuItem } from "@components/molecules/MenuItem";
import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { AddSVG, HelpSVG, LayoutSVG, NewTabSVG, PlaySVG, TraySVG } from "@svg/dashboard";
import { GithubSVG } from "@svg/social";
import { MenuItemHorizontal, UserNTeam } from "@ui/containers/dashboard/UserNTeam";
import { getEdition } from "@utils/helpers";
import { loadCrisp, openChatBox } from "@utils/common/scriptUtils";
import { addQueryParamToPath } from "@utils/common/url";

import { appStateAtom, appStateItemMutator } from "../../store/atoms/global/appState";
import { projectsAtom } from "../../store/atoms/global/project";
import { buildFiltersAtom } from "../../store/atoms/pages/buildPage";
import { updateMeta } from "../../store/mutators/metaData";
import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { handleTestRun } from "@utils/core/testUtils";
import { Tooltip } from "dyson/src/components/atoms/tooltip/Tooltip";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Global } from "@emotion/react";

const Download = dynamic(() => import("@ui/containers/dashboard/Download"));
const AddProject = dynamic(() => import("@ui/containers/dashboard/AddProject"));
const InviteMembers = dynamic(() => import("@ui/containers/dashboard/InviteMember"));

function ProjectList() {
	const router = useRouter();
	const [search] = useState(false);

	const [projects] = useAtom(projectsAtom);
	const [appState] = useAtom(appStateAtom);
	const [, setAppStateItem] = useAtom(appStateItemMutator);
	const [, updateOnboarding] = useAtom(updateMeta);

	const [showAddProject, setShowAddProject] = useState(false);
	const handleProjectSelect = React.useCallback((id) => {
		updateOnboarding({
			type: "user",
			key: USER_META_KEYS.SELECTED_PROJECT_ID,
			value: id,
		});
		setAppStateItem({ key: "selectedProjectId", value: id });
		router.push("/app/dashboard");
	}, []);

	return (
		<div
			css={css`
				max-height: 100%;
				overflow: hidden;
				display: flex;
				flex-direction: column;
			`}
		>
			<div className={"flex pl-10 mr-2 mt- justify-between mt-36"} css={project}>
				<div className={"flex items-center"}>
					<span className={"text-12.5 leading-none mr-8 font-600"}>Projects</span>
				</div>

				<Conditional showIf={showAddProject}>
					<AddProject onClose={setShowAddProject.bind(this, false)} />
				</Conditional>
				<div className={"flex items-center"} css={hoverCSS} onClick={setShowAddProject.bind(this, true)}>
					<AddSVG />
					<div className={"text-12.5 leading-none ml-8 leading-none mt-2"}>Add</div>
				</div>
			</div>

			{search && (
				<div>
					<Input placeholder={"enter name"} css={smallInputBox} />
				</div>
			)}

			<div
				css={css`
					overflow-y: overlay;
				`}
				className={"mt-6 fancy-scroll"}
			>
				{projects.map(({ id, name }) => (
					<MenuItemHorizontal className={"mt-2"} selected={appState.selectedProjectId === id} onClick={handleProjectSelect.bind(this, id)} key={id}>
						<LayoutSVG />
						<span className={"text-13 ml-16 font-500 mt-2 leading-none"}>{name}</span>
					</MenuItemHorizontal>
				))}
			</div>
			<Global
				styles={css`
					.fancy-scroll::-webkit-scrollbar {
						width: 9px;
						left: -10px;
					}

					.fancy-scroll::-webkit-scrollbar-track {
						background-color: #0a0b0e;
						box-shadow: none;
					}

					.fancy-scroll::-webkit-scrollbar-thumb {
						background-color: #1b1f23;
						border-radius: 100px;
					}

					.fancy-scroll::-webkit-scrollbar-thumb:hover {
						background-color: #272b31;
						border-radius: 100px;
					}
				`}
			/>
		</div>
	);
}

function BottomSection({ name, description, ...props }) {
	return (
		<div className={"flex justify-between py-8 px-12 pb-6 mt-20"} css={upgradeCard} {...props}>
			<div>
				<div className={"label font-700"}>{name}</div>
				<div className={"description text-12"}>{description}</div>
			</div>
			<div>
				<div>
					<TraySVG
						css={css`
							margin-left: auto;
						`}
					/>
				</div>
				<div className={"upgrade text-12 mt-6 font-600"}>Upgrade</div>
			</div>
		</div>
	);
}

function HelpContent() {
	return (
		<div>
			<div className={"px-24 py-20 pt-14"}>
				<TextBlock
					fontSize={16}
					weight={600}
					color={"#CFCFD0"}
					css={css`
						font-family: "Cera Pro";
					`}
				>
					Need help with your project?
				</TextBlock>
				<TextBlock fontSize={12.8} color={"#8F8F8F"} className={"mt-10"}>
					For issues with crusher, other enquiries.
				</TextBlock>
				<div className={"flex mt-20 mb-12"}>
					<a href={"https://docs.crusher.dev"} target={"_blank"}>
						<Button
							size={"x-small"}
							css={css`
								width: 148rem;
							`}
							bgColor={"blue"}
						>
							Setup call
						</Button>
					</a>
					<a href={"https://docs.crusher.dev"} target={"_blank"}>
						<Button
							size={"x-small"}
							className={"ml-12"}
							css={css`
								width: 120rem;
							`}
							bgColor={"tertiary-white-outline"}
						>
							Read docs
						</Button>
					</a>
				</div>
				<TextBlock className={"mt-24"} fontSize={13} color={"#8F8F8F"} showLineHeight={true}>
					{" "}
					A dev will pair to help you adopt crusher.
				</TextBlock>
			</div>
			<hr
				css={css`
					height: 1px;
					background: #1c1f22;
					border: none;
				`}
				className={"mt-0 mb-8"}
			/>

			<div className={"px-20 py-16"}>
				<TextBlock
					fontSize={16}
					weight={600}
					color={"#CFCFD0"}
					css={css`
						font-family: "Cera Pro";
					`}
				>
					Discuss with community
				</TextBlock>
				<TextBlock className={"mt-10 mb-16 "} fontSize={12.8} color={"#8F8F8F"}>
					For feature request, question or discussion
				</TextBlock>

				<a href={"https://github.com/crusherdev/crusher"} target={"_blank"}>
					<img src={"/github_support.png"} className={"mb-16 "} css={banner} />
				</a>
				{/*<img src={"/github_support.png"} css={banner}/>*/}
			</div>
		</div>
	);
}

const banner = css`
	:hover {
		filter: sepia(100%) hue-rotate(203deg) saturate(1500%);
	}
`;

const helpDropdownCSS = css`
	box-shadow: 0 0px 6px rgb(0 0 0 / 33%) !important;
	bottom: -20rem;
	top: unset !important;
	left: 4rem !important;
	height: fit-content;
	border-radius: 10rem !important;
	width: 372px;
`;

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
	},
	{
		icon: <Icon2 />,
		label: "integrations",
	},
	{
		icon: <Icon3 />,
		label: "settings",
	},
];

function HelpNSupport() {
	return (
		<Dropdown component={<HelpContent />} dropdownCSS={helpDropdownCSS}>
			<div css={navLink} className={"flex items-center pr text-12.5 mt-4"}>
				<NewTabSVG className={"mr-14 mb-2"} /> Help & Support
			</div>
		</Dropdown>
	);
}

function LeftSection() {
	const router = useRouter();
	const [inviteTeammates, setInviteTeamMates] = useState(false);
	return (
		<div css={sidebar} className={"flex flex-col justify-between pb-18"}>
			<UserNTeam />
			<div className="px-14 pt-36">
				{leftMenu.map((item) => {
					const selected = item.label === "projects";
					return (
						<div className="flex items-center pl-8 mb-8" css={[menuItem, selected && selectedCSS]}>
							<div css={iconCSS}>{item.icon}</div>
							<span className="label">{item.label}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

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

function DropdownContent() {
	return (
		<div className={"flex flex-col justify-between"}>
			<div>
				<MenuItem
					selected={true}
					label={"Request a feature"}
					onClick={() => {
						window.open("https://github.com/crusherdev/crusher/issues", "_blank").focus();
					}}
				></MenuItem>

				<MenuItem
					label={"Report Issue"}
					onClick={() => {
						window.open("https://github.com/crusherdev/crusher/issues", "_blank").focus();
					}}
				></MenuItem>

				<MenuItem
					label={"View docs"}
					onClick={() => {
						window.open("https://docs.crusher.dev", "_blank").focus();
					}}
				></MenuItem>
			</div>
		</div>
	);
}

const TOP_NAV_LINK = [
	{
		name: "overview",
		path: "/app/dashboard",
	},
	{
		name: "Tests",
		path: "/app/tests",
	},
	{
		name: "Monitoring",
		path: "/app/builds",
		queryParam: "trigger=CRON",
	},
	{
		name: "Builds",
		path: "/app/builds",
		keyToCheck: "trigger",
	},
	{
		name: "Settings",
		path: "/settings/project/basic",
	},
];

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
	const { pathname, query, asPath } = useRouter();
	const [showCreateTest, setShowCreateTest] = useState(false);

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

export const SidebarTopBarLayout = ({ children, noContainerWidth = false, hideSidebar = false, setContainerWidth = true }) => {
	return (
		<div className={"flex"} css={background}>
			<Conditional showIf={!hideSidebar}>
				<LeftSection />
			</Conditional>

			<div className={"w-full"}>
				<TopNavbar>
					<div className="flex items-center h-full">
						<div css={projectsLabel} className={"flex items-center w-full"}>
							<span>Projects</span>
							<span className="badge flex items-center justify-center pt-1">12</span>
						</div>

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
	gap: 10rem;
	font-family: "Cera Pro";
	font-weight: 400;
	font-size: 15px;
	color: #6b6565;
	letter-spacing: 0.02em;

	height: 56rem;

	.badge {
		width: 31px;
		height: 21px;
		background: rgba(78, 78, 78, 0.06);
		border: 0.5px solid #c275ff;
		border-radius: 16px;
		font-weight: 500;
		color: #aaaaaa;
		font-size
	}
`;

const navLinkSquare = css`
	height: 56rem;

	div {
		color: #d0d0d0;
		font-size: 13.5rem;
	}

	.selected {
		background: #23272e;
		border-radius: 4px 4px 0 0;
		height: 5px;
		position: absolute;
		width: 100%;
		bottom: 0;
	}

	.nav-top-link {
		padding-bottom: 4px;
		border-radius: 4px;
		padding-top: 4px;
	}

	.nav-top-link:hover {
		background: rgba(255, 255, 255, 0.05);
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

const project = css`
	color: rgba(255, 255, 255, 0.9);
	font-size: 12rem;
`;

const hoverCSS = css`
	padding: 6px 10px 6px 10px;
	:hover {
		background: #202429;
		border-radius: 4px;
	}
`;

const navLink = css`
	box-sizing: border-box;
	line-height: 13rem;
	height: 31rem;
	color: rgba(189, 189, 189, 0.8);
	font-weight: 500;
	letter-spacing: 0.3px;

	margin-left: 6px;
	margin-right: 6px;

	:hover {
		color: rgb(231, 231, 231);
	}
`;

const upgradeCard = css`
	background: #1a1d21;
	border: 1px solid #212529;
	border-radius: 6rem;

	path {
		fill: #929dff;
	}
	.label {
		color: rgba(255, 255, 255, 0.88);
		font-size: 13.5rem;
	}

	.description {
		color: rgba(255, 255, 255, 0.3);
	}

	.upgrade {
		color: #929dff;
	}

	:hover {
		background: #24282d;
		border: 1px solid #30353b;
	}
`;

const smallInputBox = css`
	width: calc(100% - 14px);
	background: linear-gradient(0deg, #0e1012, #0e1012);
	border: 1px solid #2a2e38;
	box-sizing: border-box;
	border-radius: 4px;
	height: 30rem;
	font-size: 14rem;
	padding-left: 16rem;
	color: #fff;
	margin: 7px 7px;
	padding-top: 2rem;
`;
