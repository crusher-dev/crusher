import { css } from "@emotion/react";
import { MenuItemHorizontal, UserNTeam } from "@ui/containers/dashboard/UserNTeam";
import React, { useCallback, useEffect, useState } from "react";
import { AddSVG, HelpSVG, LayoutSVG, NewTabSVG, PlaySVG, TraySVG } from "@svg/dashboard";

import { Button } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";

import { useAtom } from "jotai";

import { projectsAtom } from "../../store/atoms/global/project";
import { appStateAtom, appStateItemMutator } from "../../store/atoms/global/appState";
import { useRouter } from "next/router";
import Link from "next/link";
import { addQueryParamToPath } from "@utils/url";
import dynamic from "next/dynamic";
import { getEdition } from "@utils/helpers";
import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { GithubSVG } from "@svg/social";
import { ShowOnClick } from "dyson/src/components/layouts/ShowonAction/ShowOnAction";
import { loadCrisp, openChatBox } from "@utils/scriptUtils";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "../../types/RequestOptions";
import { getBuildsList, getRunTestApi } from "@constants/api";
import { sendSnackBarEvent } from "@utils/notify";
import { MenuItem } from "@components/molecules/MenuItem";
import { UserImage } from "dyson/src/components/atoms/userimage/UserImage";
import { Dropdown } from "dyson/src/components/molecules/Dropdown";
import { buildFiltersAtom } from "../../store/atoms/pages/buildPage";
import useSWR, { mutate } from "swr";
import { IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";

const Download = dynamic(() => import("@ui/containers/dashboard/Download"));
const AddProject = dynamic(() => import("@ui/containers/dashboard/AddProject"));
const InviteMembers = dynamic(() => import("@ui/containers/dashboard/InviteMember"));

function ProjectList() {
	const router = useRouter();
	const [search] = useState(false);

	const [projects] = useAtom(projectsAtom);
	const [appState] = useAtom(appStateAtom);
	const [, setAppStateItem] = useAtom(appStateItemMutator);

	const [showAddProject, setShowAddProject] = useState(false);
	return (
		<>
			<div className={"flex pl-10 mr-2 mt- justify-between mt-36"} css={project}>
				<div className={"flex items-center"}>
					<span className={"text-13 leading-none mr-8 font-600"}>Projects</span>
				</div>

				<Conditional showIf={showAddProject}>
					<AddProject onClose={setShowAddProject.bind(this, false)} />
				</Conditional>
				<div className={"flex items-center"} css={hoverCSS} onClick={setShowAddProject.bind(this, true)}>
					<AddSVG />
					<div className={"text-13 leading-none ml-8 leading-none mt-2"}>Add</div>
				</div>
			</div>

			{search && (
				<div>
					<Input placeholder={"enter name"} css={smallInputBox} />
				</div>
			)}

			<div className={"mt-6"}>
				{projects.map(({ id, name, ICON }) => (
					<MenuItemHorizontal
						className={"mt-2"}
						selected={appState.selectedProjectId == id}
						onClick={() => {
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

function BottomSection({ name, description, link, ...props }) {
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
				{/*			<ICON height={12} />*/}
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
						<div className={"text-12 font-700 leading-none mt-16 mb-8 ml-8"} id={"support-tagline"}>
							Join community 💓
						</div>
						<a target={"_blank"} href={"https://github.com/crusherdev/crusher"}>
							<div css={navLink} className={"flex items-center text-13 mt-4 leading-none"}>
								<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-13"}>Star us on Github</span>
							</div>
						</a>
						{/*<a href={"https://crusher.dev"}>*/}
						{/*	<div css={navLink} className={"flex items-center text-13 mt-4 mb-12 leading-none"}>*/}
						{/*		<GithubSVG className={"mr-12"} /> <span className={"mt-4 text-13"}>Join discord</span>*/}
						{/*	</div>*/}
						{/*</a>*/}
					</Conditional>

					<Conditional showIf={getEdition() !== EditionTypeEnum.OPEN_SOURCE}>
						<div css={navLink} className={"flex items-center text-13 mt-4"} onClick={setInviteTeamMates.bind(this, true)}>
							<AddSVG className={"mr-12 mb-2"} /> Invite teammates
						</div>
					</Conditional>

					<Dropdown
						component={<DropdownContent />}
						dropdownCSS={css`
							bottom: -10px;
							top: unset;
							left: calc(100% - 54px) !important;
							height: fit-content;
							width: 206.03px;
						`}
					>
						<div css={navLink} className={"flex items-center pr text-13 mt-4"}>
							<NewTabSVG className={"mr-12 mb-2"} /> Help & Support
						</div>
					</Dropdown>

					<div
						css={navLink}
						className={"flex items-center text-13 mt-4"}
						onClick={() => {
							window.UserLeap("track", "basic-nps");
						}}
					>
						<HelpSVG className={"mr-12 mb-2"} /> Give feedback
					</div>
				</div>

				<Conditional showIf={getEdition() === EditionTypeEnum.OPEN_SOURCE}>
					<a href={"https://crusher.dev"}>
						<BottomSection name={"Use Crusher Cloud"} description={"Get 50% more"} />
					</a>
				</Conditional>

				<Conditional showIf={getEdition() === EditionTypeEnum.EE}>
					<BottomSection
						name={"Free plan"}
						description={"Get 50% more"}
						onClick={() => {
							router.push(
								"https://checkout.stripe.com/pay/cs_live_a150LMbDFNkKrOt9FMdzD16JhGEEQbu51GEBFy2D4MOxa3cIJUMKoI3c8Z#fidkdWxOYHwnPyd1blppbHNgWkFMQ0l%2FYFFXM0hoMUtKM0RSZFRfNWB3aScpJ2hsYXYnP34nYnBsYSc%2FJ0tEJyknaHBsYSc%2FJ2E3M2cwMT1mKGNgPWEoMTQyNCg8YzA1KD0zMTM3Zj09ZzA8Z2MyMWQ2YScpJ3ZsYSc%2FJzIwMTFhY2M1KGM3YDAoMTYyNCg8YWQyKDMxYzQ0NGdgYWYyY2FnPT02Myd4KSdnYHFkdic%2FXlgpJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ3dgY2B3d2B3SndsYmxrJz8nbXFxdXY%2FKippbGtgZHcrZHV1J3gl",
							);
						}}
					/>
				</Conditional>
			</div>
		</div>
	);
}

export const dropdDown = css`
	bottom: -10px;
	left: calc(100% - 54px);
	position: absolute;

	width: 206.03px;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(16, 15, 15, 0.4);
	border-radius: 6px;
	padding: 8rem 0;
	z-index: 1;
`;

function DropdownContent() {
	const router = useRouter();
	useEffect(() => {
		loadCrisp(() => {
			``;
		});
	}, []);
	return (
		<div className={"flex flex-col justify-between"}>
			<div>
				<MenuItem showHightlighted={true} label={"Get Live support"} onClick={openChatBox}></MenuItem>
				<MenuItem
					selected={true}
					label={"Request a feature"}
					onClick={() => {
						router.push("https://github.com/crusherdev/crusher/issues");
					}}
				></MenuItem>

				<MenuItem
					label={"Report Issue"}
					onClick={() => {
						router.push("https://github.com/crusherdev/crusher/issues");
					}}
				></MenuItem>

				<MenuItem
					label={"View docs"}
					onClick={() => {
						router.push("https://docs.crusher.dev");
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
		queryParam: "monitoring=true",
	},
	{
		name: "Builds",
		path: "/app/builds",
		keyToCheck: "monitoring",
	},
	{
		name: "Settings",
		path: "/settings/project",
	},
];

const runTests = (projectId: number) => {
	return backendRequest(getRunTestApi(projectId), {
		method: RequestMethod.POST,
	});
};

function RunTest() {
	const router = useRouter();
	const [{ selectedProjectId }] = useAtom(appStateAtom);
	const { query } = useRouter();
	const [filters] = useAtom(buildFiltersAtom);

	const runProjectTest = useCallback(() => {
		(async () => {
			await runTests(selectedProjectId);
			sendSnackBarEvent({ type: "normal", message: "We have started running test" });

			const buildAPI = getBuildsList(project.id, query.trigger, filters);
			await mutate(buildAPI);
			await router.push("/app/builds");
		})();
	}, []);
	return (
		<Button bgColor={"tertiary-dark"} onClick={runProjectTest}>
			<div className={"flex items-center"}>
				<PlaySVG className={"mr-12"} />
				Run test
			</div>
		</Button>
	);
}

function TopNavbar() {
	const router = useRouter();
	const { pathname, query, asPath } = router;
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
								width: 160rem;
							`}
							onClick={setShowCreateTest.bind(this, true)}
						>
							Create a test
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

export const SidebarTopBarLayout = ({ children, hideSidebar = false }) => {
	return (
		<div className={"flex"} css={background}>
			<Conditional showIf={!hideSidebar}>
				<LeftSection />
			</Conditional>

			<div className={"w-full"}>
				<TopNavbar />
				<div css={scrollContainer} className={"custom-scroll relative"}>
					<div css={[containerWidth]}>{children}</div>
				</div>
			</div>
		</div>
	);
};

const navLinkSquare = css`
	height: 68rem;

	div {
		color: #d0d0d0;
		font-size: 13.5px;
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
	background: #101215;
	height: 100vh;
	border: 1px solid #171b20;
	box-sizing: border-box;
`;

const nav = css`
	width: 100%;
	background: #101215;
	height: 68rem;
`;
const containerWidth = css`
	//width: calc(100vw - 250rem);
	//max-width: 1500rem;

	width: 1488rem;
	max-width: calc(100vw - 352rem);
	margin: 0 auto;
	padding: 0 0rem;
`;

const scrollContainer = css`
	overflow-y: scroll;
	height: calc(100vh - 68rem);
`;

const project = css`
	color: rgba(255, 255, 255, 0.9);
	font-size: 1;
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
	padding-left: 12rem;
`;
