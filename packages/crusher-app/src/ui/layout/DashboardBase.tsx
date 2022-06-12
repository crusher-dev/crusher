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
import { Tooltip } from 'dyson/src/components/atoms/tooltip/Tooltip';
import { TextBlock } from 'dyson/src/components/atoms/textBlock/TextBlock';

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

	return (
		<>
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

			<div className={"mt-6"}>
				{projects.map(({ id, name }) => (
					<MenuItemHorizontal
						className={"mt-2"}
						selected={appState.selectedProjectId === id}
						onClick={() => {
							updateOnboarding({
								type: "user",
								key: USER_META_KEYS.SELECTED_PROJECT_ID,
								value: id,
							});
							setAppStateItem({ key: "selectedProjectId", value: id });
							router.push("/app/dashboard");
						}}
						key={id}
					>
						<LayoutSVG />
						<span className={"text-13 ml-16 font-500 mt-2 leading-none"}>{name}</span>
					</MenuItemHorizontal>
				))}
			</div>
		</>
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
	return <div>
			<div className={"px-24 py-20 pt-14"}>
				<TextBlock fontSize={16} weight={600} color={"#CFCFD0"} css={css`font-family: 'Cera Pro'`}>Need help with your project?</TextBlock>
				<TextBlock fontSize={12.8} color={"#8F8F8F"} className={"mt-10"}>For issues with crusher, other enquiries.</TextBlock>
				<div className={"flex mt-20 mb-12"}>
					<a href={"https://docs.crusher.dev"} target={"_blank"}>
					<Button size={"x-small"} css={css`width: 148rem;`} bgColor={"blue"}>Setup call</Button>
					</a>
						<a href={"https://docs.crusher.dev"} target={"_blank"}>
							<Button size={"x-small"} className={"ml-12"} css={css`width: 120rem;`} bgColor={"tertiary-white-outline"}>Read docs</Button>
						</a>
				</div>
				<TextBlock className={"mt-24"} fontSize={13} color={"#8F8F8F"} showLineHeight={true} >		A dev will pair to help you adopt crusher.</TextBlock>

			</div>
		<hr css={css`height: 1px; background: #1C1F22;  border: none;`} className={"mt-0 mb-8"}/>

		<div className={"px-20 py-16"}>
			<TextBlock fontSize={16} weight={600}  color={"#CFCFD0"} css={css`font-family: 'Cera Pro'`}>Discuss with community</TextBlock>
			<TextBlock className={"mt-10 mb-16 "} fontSize={12.8} color={"#8F8F8F"}>For feature request, question or discussion</TextBlock>

			<a href={"https://github.com/crusherdev/crusher"} target={"_blank"}>
			<img src={"/github_support.png"} className={"mb-16 "} css={banner}/>
			</a>
			{/*<img src={"/github_support.png"} css={banner}/>*/}
		</div>
	</div>;
}

const banner=css`
	:hover{
    filter: sepia(100%) hue-rotate(
            203deg
    ) saturate(1500%);
	}
`

const helpDropdownCSS = css`
    box-shadow: 0 0px 6px rgb(0 0 0 / 33%) !important;
							    bottom: -20rem;
							    top: unset !important;
							left: 4rem !important;
							height: fit-content;
							border-radius: 10rem !important;
      width: 372px;

						`

function HelpNSupport() {
	return <Dropdown
		component={<HelpContent/>}
		dropdownCSS={helpDropdownCSS}
	>
		<div css={navLink} className={'flex items-center pr text-12.5 mt-4'}>
			<NewTabSVG className={'mr-14 mb-2'} /> Help & Support
		</div>
	</Dropdown>;
}

function LeftSection() {
	const router = useRouter();
	const [inviteTeammates, setInviteTeamMates] = useState(false);
	return (
		<div css={sidebar} className={"flex flex-col justify-between py-18 px-14"}>
			<div>
				<UserNTeam />

				{/*<div>*/}
				{/*	<div css={OutlinedButton} className={' mt-28 flex justify-between'}>*/}
				{/*		<span className={'text-13'}>Upgrade to pro</span> <RightArrow/>*/}
				{/*	</div>*/}
				{/*</div>*/}

				{/*<div className={"mt-24"}>*/}
				{/*	{CURRENT_PROJECT_LIST.map(({ name, ICON }) => (*/}
				{/*		<MenuItemHorizontal className={"mt-2"}>*/}
				{/*			<ICON height={"12rem"} />*/}
				{/*			<span className={"text-13 ml-16 font-500 mt-2 leading-none"}>{name}</span>*/}
				{/*		</MenuItemHorizontal>*/}
				{/*	))}*/}
				{/*</div>*/}

				<ProjectList />
			</div>

			<div>
				<Conditional showIf={inviteTeammates}>
					<InviteMembers onClose={setInviteTeamMates.bind(this, false)} />
				</Conditional>
				<div>
					<Conditional showIf={getEdition() === EditionTypeEnum.OPEN_SOURCE}>
						<div className={"text-12 font-600 leading-none mt-16 mb-8 ml-8"} id={"support-tagline"}>
							Join community 💓
						</div>
						<a target={"_blank"} href={"https://github.com/crusherdev/crusher"}>
							<div css={navLink} className={"flex items-center text-12.5 mt-4 leading-none"}>
								<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-12.5"}>Star us on Github</span>
							</div>
						</a>
						{/*<a href={"https://crusher.dev"}>*/}
						{/*	<div css={navLink} className={"flex items-center text-13 mt-4 mb-12 leading-none"}>*/}
						{/*		<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-13"}>Join discord</span>*/}
						{/*	</div>*/}
						{/*</a>*/}
					</Conditional>

					<Conditional showIf={getEdition() !== EditionTypeEnum.OPEN_SOURCE}>
						<div css={navLink} className={"flex items-center text-12.5 mt-4"}
								 onClick={setInviteTeamMates.bind(this, true)}>
							<AddSVG className={"mr-18 mb-2"} /> Invite teammates
						</div>
					</Conditional>

					<HelpNSupport/>
					<div
						css={navLink}
						className={"flex items-center text-12.5 mt-4"}
						onClick={() => {
							window.UserLeap("track", "basic-nps");
						}}
					>
						<HelpSVG className={"mr-16 mb-2"} /> Give feedback
					</div>
				</div>

				<Conditional showIf={getEdition() === EditionTypeEnum.OPEN_SOURCE}>
					<a href={"https://crusher.dev"}>
						<BottomSection name={"Use Crusher Cloud"} description={"Get 50% more"} />
					</a>
				</Conditional>

				{/* <Conditional showIf={getEdition() === EditionTypeEnum.EE}>
					<BottomSection
						name={"Free plan"}
						description={"Get started"}
						onClick={() => {
							router.push("/settings/org/pricing");
						}}
					/>
				</Conditional> */}
			</div>
		</div>
	);
}

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
						window.open("https://github.com/crusherdev/crusher/issues","_blank").focus();
					}}
				></MenuItem>

				<MenuItem
					label={"Report Issue"}
					onClick={() => {
						window.open("https://github.com/crusherdev/crusher/issues","_blank").focus();
					}}
				></MenuItem>

				<MenuItem
					label={"View docs"}
					onClick={() => {
						window.open("https://docs.crusher.dev","_blank").focus();
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

function TopNavbar() {
	const { pathname, query, asPath } = useRouter();
	const [showCreateTest, setShowCreateTest] = useState(false);

	return (
		<div css={[nav]} className={""}>
			<div css={[containerWidth]}>
				<div className={"w-full flex px-8 pl-0 justify-between"}>
					<div className={"flex"}>
						{TOP_NAV_LINK.map(({ name, path, keyToCheck, queryParam }, i) => {
							let isNavLinkSelected = false;

							if (queryParam) {
								const [key] = queryParam.split("=");
								isNavLinkSelected = key && path === pathname && asPath.includes(queryParam);
							} else {
								isNavLinkSelected = path === pathname && query[keyToCheck] === undefined;
							}
							return (
								<Link href={addQueryParamToPath(path, queryParam)} key={i}>
									<div className={"pt-20 mr-6 relative"} css={navLinkSquare}>
										<div className={"font-cera font-500 px-24 capitalize nav-top-link"}>{name}</div>

										{isNavLinkSelected && <div className={"selected mt-19"}></div>}
									</div>
								</Link>
							);
						})}
					</div>

					<Conditional showIf={showCreateTest}>
						<Download onClose={setShowCreateTest.bind(this, false)} />
					</Conditional>

					<div className={"flex items-center"}>
						<RunTest />
						<Button
							className={"ml-20"}
							css={css`
								width: 108rem;
							`}
							onClick={setShowCreateTest.bind(this, true)}
						>
							New test
						</Button>
						{/*<span className={"ml-24 font-500 text-14 leading-none"} css={shareLink}>*/}
						{/*	Share*/}
						{/*</span>*/}
					</div>
				</div>
			</div>
		</div>
	);
}

export const SidebarTopBarLayout = ({ children, noContainerWidth = false, hideSidebar = false, setContainerWidth = true }) => {
	return (
		<div className={"flex"} css={background}>
			<Conditional showIf={!hideSidebar}>
				<LeftSection />
			</Conditional>

			<div className={"w-full"}>
				<TopNavbar />
				<div css={[scrollContainer, noContainerWidth ? css`overflow-y: overlay` : undefined]} className={"custom-scroll relative"}>
					<div css={[!noContainerWidth ? setContainerWidth && containerWidth : null]}>{children}</div>
				</div>
			</div>
		</div>
	);
};

const navLinkSquare = css`
	height: 68rem;

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
	background: #0a0b0e;
	min-height: 100vh;
`;

const sidebar = css`
	width: 286rem;
	height: 100vh;
	border-right: 1px solid #171b20;
	box-sizing: border-box;
`;

const nav = css`
	width: 100%;
	height: 68rem;
	border-bottom: 1px solid #171b20;
`;
const containerWidth = css`
	//width: calc(100vw - 250rem);
	//max-width: 1500rem;

	width: 1468rem;
	max-width: calc(100vw - 352rem);
	margin: 0 auto;
	padding: 0 0;
`;

const scrollContainer = css`
	overflow-y: scroll;
	height: calc(100vh - 68rem);
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
  letter-spacing: .3px;

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
