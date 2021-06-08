import { css } from "@emotion/core";
import Head from "next/head";
import { DropDown } from "@ui/components/project/DropDown";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { saveSelectedProjectInRedux } from "@redux/actions/project";
import { store } from "@redux/store";
import { resolvePathToBackendURI } from "@utils/url";
import React, { CSSProperties, useCallback, useState } from "react";
import { toPascalCase } from "@utils/helpers";
import { Logo } from "@ui/components/common/Atoms";
import { FeedbackComponent } from "@ui/components/app/feedbackComponent";
import DashboardSvg from "../../public/svg/sidebarSettings/dashboard.svg";
import BuildsSVG from "../../public/svg/sidebarSettings/builds.svg";
import TestsSVG from "../../public/svg/sidebarSettings/testsList.svg";
import ProjectSettings from "../../public/svg/sidebarSettings/projectSettings.svg";
import Logout from "../../public/svg/sidebarSettings/logout.svg";
import FeedbackSVG from "../../public/svg/sidebarSettings/feedback.svg";
import Support from "../../public/svg/sidebarSettings/support.svg";
import DropdownSVG from "../../public/svg/sidebarSettings/drodpown.svg";
import { CreateTest } from "@ui/components/app/CreateTestButton";
import { useRouter } from "next/router";
import { SidebarTeamDropdown } from "@ui/containers/sidebar/dropdown";
import { CreateProjectModal } from "@ui/containers/modals/createProjectModal";
import ReactDOM from "react-dom";
import { getUserInfo } from "@redux/stateUtils/user";
import { Conditional } from "@ui/components/common/Conditional";
import { iProjectInfoResponse } from "@crusher-shared/types/response/projectInfoResponse";
import { NextPage, NextPageContext } from "next";
import { InviteTeamMemberModal } from "@ui/containers/modals/inviteTeamMemberModal";
import { InstallExtensionModal } from "@ui/containers/modals/installExtensionModal";
import { checkIfExtensionPresent } from "@utils/extension";
import { CreateTestModal } from "@ui/containers/modals/createTestModal";
import { RunTestButton } from "@ui/components/app/RunTestsButton";
import { runTestsInProject } from "@services/v2/project";
import { Toast } from "@utils/toast";
import { redirectToFrontendPath } from "@utils/router";

interface NavItem {
	name: string;
	link: string;
	icon: string;
	isAuthorized: boolean;
}

interface NavListProps {
	navItems: Array<NavItem>;
	isLoggedIn: boolean;
	style?: CSSProperties;
}

function NavList(props: NavListProps) {
	const { navItems, style, isLoggedIn } = props;
	const router = useRouter();

	return (
		<ul style={style} css={primaryMenuCSS}>
			{navItems.map((item: NavItem, i) => {
				const SVGImage = item.icon;
				const shouldEnable = item.isAuthorized ? (isLoggedIn ? true : false) : true;

				return (
					<li
						className={(router as any).pathname === item.link ? "active" : ""}
						style={{
							opacity: shouldEnable ? 1 : 0.5,
						}}
						key={i}
					>
						<Conditional If={!shouldEnable}>
							<div style={{ display: "flex" }}>
								<SVGImage />
								<span>{item.name}</span>
							</div>
						</Conditional>

						<Conditional If={shouldEnable}>
							<Link href={item.link}>
								<a href={item.link}>
									<SVGImage />
									<span>{item.name}</span>
								</a>
							</Link>
						</Conditional>
					</li>
				);
			})}
		</ul>
	);
}

function generateRandomUserName() {
	return "Prince Vegeta";
}

// Todo- Breakdown in diff component.
function LeftSection(props: any) {
	const { userInfo, selectedProject } = props;
	const [showDropDown, setShowDropDwon] = useState(false);
	const [showAddProject, setShowAddProject] = useState(false);
	const [showInviteMembersModal, setShowInviteMembersModal] = useState(false);

	const closeProjectModal = () => {
		ReactDOM.render(null as any, document.getElementById("overlay"));
		setShowAddProject(false);
	};

	const mainNavLinks = [
		{
			name: "Dashboard",
			link: "/app/project/dashboard",
			icon: DashboardSvg,
			isAuthorized: true,
		},
		{
			name: "Builds",
			link: "/app/project/builds?category=1",
			icon: BuildsSVG,
			isAuthorized: true,
		},
		{
			name: "Monitoring",
			link: "/app/project/builds?category=0",
			icon: BuildsSVG,
			isAuthorized: true,
		},
		{
			name: "Tests",
			link: "/app/project/tests",
			icon: TestsSVG,
			isAuthorized: true,
		},
		{
			name: "Settings",
			link: "/app/settings/project/basic",
			icon: ProjectSettings,
			isAuthorized: true,
		},
	];

	const bottomNavLinks = [{
		name: "Documentation & Support",
		link: "https://docs.crusher.dev",
		icon: Support,
		isAuthorized: false,
	},{
		name: "Share Feedback",
		link: "/feedback",
		icon: FeedbackSVG,
		isAuthorized: false,
	},
		{
			name: "Logout",
			link: resolvePathToBackendURI("/user/logout"),
			icon: Logout,
			isAuthorized: true,
		},
	];

	const toggleSettingsDropDown = () => {
		setShowDropDwon(!showDropDown);
	};

	const isUserLoggedIn = !!userInfo;
	const userName = userInfo ? userInfo.name : generateRandomUserName();

	const userFistCharacter = userName.slice(0, 1);

	const closeInviteMembersModal = () => {
		setShowInviteMembersModal(false);
		ReactDOM.render(null as any, document.getElementById("overlay"));
	};

	const openInviteMembersModal = () => {
		setShowInviteMembersModal(true);
	};

	return (
		<div css={leftSectionCSS}>
			<div css={sectionContainerCSS}>
				<div css={sectionHeaderItemCSS}>
					{/*@Note :- Change hardcoded text*/}
					<div css={teamIconCSS} onClick={toggleSettingsDropDown}>
						{userFistCharacter}
					</div>
					<div css={sectionHeaderContentAreaCSS}>
						<span
							style={{
								color: "#2B2B39",
								fontSize: "1rem",
								fontFamily: "Cera Pro",
								fontWeight: "bold",
							}}
							onClick={toggleSettingsDropDown}
						>
							{toPascalCase(selectedProject)} project
						</span>

						<span
							style={{
								color: "#8C8C8C",
								fontFamily: "Gilroy",
								fontStyle: "normal",
								fontSize: "0.8rem",
								marginTop: "0.05rem",
							}}
							onClick={toggleSettingsDropDown}
						>
							{userName}
						</span>
					</div>
					<div
						css={sectionHeaderSettingCSS}
						onClick={toggleSettingsDropDown}
						style={{
							pointerEvents: isUserLoggedIn ? "auto" : "none",
							marginTop: ".5rem",
						}}
					>
						<DropdownSVG />
					</div>

					<Conditional If={showDropDown}>
						<SidebarTeamDropdown
							onAddProjectCallback={setShowAddProject.bind(this, true)}
							onShowInviteTeamMemberModal={openInviteMembersModal}
							onOutsideClick={toggleSettingsDropDown}
						/>
					</Conditional>

					<Conditional If={showAddProject}>
						<CreateProjectModal onClose={closeProjectModal} />
					</Conditional>
				</div>

				<NavList isLoggedIn={isUserLoggedIn} navItems={mainNavLinks} />
			</div>
			<div css={settingsBottomFixedContainerCSS}>
				<NavList isLoggedIn={isUserLoggedIn} navItems={bottomNavLinks} />
			</div>
			<div css={inviteMembersCSS} onClick={openInviteMembersModal}>
				<img src="/svg/sidebarSettings/team_member.svg" />
				<span>Invite members</span>
			</div>

			<Conditional If={showInviteMembersModal}>
				<InviteTeamMemberModal onClose={closeInviteMembersModal} />
			</Conditional>
		</div>
	);
}

function CrusherLogo() {
	return (
		<Link href={"/app/project/dashboard"}>
			<a href={"/app/project/dashboard"}>
				<Logo style={{ cursor: "pointer", height: "1.6625rem" }} />
			</a>
		</Link>
	);
}

function ProjectSelector(props: {
	projectsList: any;
	options: any;
	selectedProject: any;
	onChange: (project: iSelectOption) => void;
}) {
	const [isShowingCreateProjectModal, setIsShowingCreateProjectModal] = useState(
		false,
	);

	const { options, onChange, selectedProject } = props;
	const modifiedOption = [
		{ label: "Add new project", value: "add_project" },
		...options,
	];
	const handleChange = (option: iSelectOption) => {
		if (option.value === "add_project") {
			setIsShowingCreateProjectModal(true);
		} else {
			onChange(option);
		}
	};

	const closeProjectModal = useCallback(() => {
		ReactDOM.render(null as any, document.getElementById("overlay"));
		setIsShowingCreateProjectModal(false);
	}, [isShowingCreateProjectModal]);

	return (
		<div css={projectDropdownContainerCSS}>
			{isShowingCreateProjectModal && (
				<CreateProjectModal onClose={closeProjectModal} />
			)}
			{props.projectsList && (
				<DropDown
					options={modifiedOption}
					selected={selectedProject ? { value: selectedProject } : {}}
					onChange={handleChange}
					placeholder={"Select project"}
				/>
			)}
		</div>
	);
}

function generateRandomProjectName() {
	return "Blip Boom";
}

interface iSelectOption {
	label: string;
	value: string;
}

export function withSidebarLayout(
	WrappedComponent: NextPage<any>,
	shouldHaveGetInitialProps = true,
) {
	const WithSidebarLayout = function (props: any) {
		const [showInstallExtensionModal, setShowInstallExtensionModal] = useState(
			false,
		);
		const [showCreateTestModal, setShowCreateTestModal] = useState(false);
		const userInfo = useSelector(getUserInfo);
		const projectsList = useSelector(getProjects);
		const selectedProjectID = useSelector(getSelectedProject);

		const selectedProject = projectsList.find((project: iProjectInfoResponse) => {
			return project.id === selectedProjectID;
		});

		const selectedProjectName =
			userInfo && selectedProject
				? selectedProject.name
				: generateRandomProjectName();

		const options = userInfo
			? projectsList &&
			  projectsList.map((project) => {
					return { label: project.name, value: project.id };
			  })
			: [];

		function onProjectChange(project: iSelectOption) {
			(store as any).dispatch(saveSelectedProjectInRedux(parseInt(project.value)));
			window.location.reload();
		}

		const handleCreateTest = async () => {
			const isExtensionInstalled = await checkIfExtensionPresent();
			if (!isExtensionInstalled) {
				setShowInstallExtensionModal(true);
			} else {
				setShowCreateTestModal(true);
			}
		};

		const closeInstallExtensionModal = () => {
			setShowInstallExtensionModal(false);
		};
		const closeShowCreateTestModal = () => {
			setShowCreateTestModal(false);
		};

		const handleExtensionDownloaded = () => {
			closeInstallExtensionModal();
			setShowCreateTestModal(true);
		};

		const handleRunTests = () => {
			runTestsInProject(selectedProjectID)
				.then((e) => {
					redirectToFrontendPath("/app/project/builds");
				})
				.catch((err) => {
					Toast.showError("Create a host first");
				});
		};

		return (
			<div>
				<Head>
					<title>Crusher | Create your first test</title>
					<link
						href="/assets/img/favicon.png"
						rel="shortcut icon"
						type="image/x-icon"
					/>
					<link
						href="/lib/@fortawesome/fontawesome-free/css/all.min.css"
						rel="stylesheet"
					/>
				</Head>
				<div css={mainContainerCSS}>
					<LeftSection selectedProject={selectedProjectName} userInfo={userInfo} />
					<InstallExtensionModal
						isOpen={showInstallExtensionModal}
						onClose={closeInstallExtensionModal}
						onExtensionDownloaded={handleExtensionDownloaded}
					/>
					<CreateTestModal
						isOpen={showCreateTestModal}
						onClose={closeShowCreateTestModal}
					/>
					<div css={contentContainerCSS}>
						<div css={headerCSS}>
							<CrusherLogo />
							<ProjectSelector
								projectsList={projectsList}
								options={options}
								selectedProject={selectedProjectID}
								onChange={onProjectChange}
							/>
							<span css={createTestCSS}>
								<CreateTest onClick={handleCreateTest} />
							</span>
							<span css={runTestsCSS}>
								<RunTestButton onClick={handleRunTests} />
							</span>
						</div>
						<div css={innerContentContainerCSS}>
							<WrappedComponent {...props} />
							<FeedbackComponent />
						</div>
					</div>
				</div>
			</div>
		);
	};

	const wrappedComponentName =
		WrappedComponent.displayName || WrappedComponent.name || "Component";

	WithSidebarLayout.displayName = `withSidebarLayout(${wrappedComponentName})`;

	if (shouldHaveGetInitialProps) {
		WithSidebarLayout.getInitialProps = async (ctx: NextPageContext) => {
			const pageProps =
				WrappedComponent.getInitialProps &&
				(await WrappedComponent.getInitialProps(ctx));
			return { ...pageProps };
		};
	}

	return WithSidebarLayout;
}

const createTestCSS = css`
	margin-left: auto;
	:hover {
		text-decoration: none !important;
	}
`;

const runTestsCSS = css`
	margin-left: 2rem;
	:hover {
		text-decoration: none !important;
	}
`;

const inviteMembersCSS = css`
	cursor: pointer;
	background: #111313;
	color: #fff;
	text-align: center;
	padding: 1.1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	span {
		font-size: 1.125rem;
		margin-left: 0.75rem;
		font-weight: 600;
	}
	&:hover {
		background: #5b76f7;
	}
`;

const mainContainerCSS = css`
	display: flex;
	height: 100vh;
	width: 100vw;
	font-family: DM Sans;
`;

const leftSectionCSS = css`
	display: flex;
	flex-direction: column;
	min-width: 20.75rem;
	background: #fbfbfb;
	color: #fff;
	height: 100vh;
	overflow-y: auto;
`;

const sectionContainerCSS = css`
	padding: 1.2rem 0;
`;

const sectionHeaderItemCSS = css`
	padding: 0 1.5rem;
	font-weight: 500;
	display: flex;
	position: relative;
	cursor: pointer;
`;

const teamIconCSS = css`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 0.8rem 1.12rem;
	font-weight: 900;
	font-size: 0.85rem;
	background: rgba(97, 98, 102, 0.2);
	color: #888888;
	border-radius: 0.3rem;
	width: 3.2rem;
	height: 3.2rem;
`;

const sectionHeaderContentAreaCSS = css`
	margin-left: 1.11rem;
	display: flex;
	flex-direction: column;
	align-self: center;
`;

const sectionHeaderSettingCSS = css`
	margin-left: auto;
	display: flex;
	justify-content: center;
	cursor: pointer;
`;

const primaryMenuCSS = css`
	@media (max-width: 1120px) {
		margin-top: 5rem;
	}
	margin-top: 3.3rem;
	list-style: none;
	padding: 0;

	.active {
		::before {
			position: absolute;
			top: 0;
			left: 0;
			content: url("/svg/sidebarSettings/tab_selected.svg");
		}
		color: #506cf5;
		svg,
		path {
			fill: #506cf5;
		}
	}

	li {
		&:not(:last-child) {
			margin-bottom: 1.9rem;
		}
		a {
			align-items: center;
			display: flex;
		}
		padding: 0 1.625rem;
		position: relative;

		img {
			height: 1.25rem;
		}
		color: #636363;
		font-weight: 500;
		font-size: 1.33rem;
		padding-top: 0.36rem;
		padding-bottom: 0.36rem;
		display: flex;
		align-items: center;
		cursor: pointer;
		span {
			font-size: 1rem;
			margin-left: 1.5rem;
		}
	}
`;

const settingsBottomFixedContainerCSS = css`
	margin-top: auto;
	margin-bottom: 2rem;
`;

const contentContainerCSS = css`
	display: flex;
	background: #fbfbfb;
	flex: 1;
	flex-direction: column;
	height: 100vh;
	margin-left: -2px;
	overflow-y: scroll;
`;
const headerCSS = css`
	display: flex;
	align-items: center;
	padding: 1rem 3rem;
`;
const projectDropdownContainerCSS = css`
	margin-left: 4.62rem;
	align-self: center;
	font-size: 1rem;
`;
const innerContentContainerCSS = css`
	flex: 1;
	border-top-left-radius: 1.35rem;
	border-style: solid;
	border-width: 1px;
	background: #fff;
	border-color: #e2e2e2;
`;
