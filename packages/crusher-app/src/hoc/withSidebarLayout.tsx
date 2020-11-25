import { css } from "@emotion/core";
import Head from "next/head";
import { DropDown } from "@ui/components/project/DropDown";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import {
	addProjectInRedux,
	saveSelectedProjectInRedux,
} from "@redux/actions/action";
import { store } from "@redux/store";
import { resolvePathToBackendURI } from "@utils/url";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { toPascalCase } from "@utils/helpers";
import { Logo } from "@ui/components/common/Atoms";
import { FeedbackComponent } from "@ui/components/app/feedbackComponent";
import DasgboardSvg from "../../public/svg/sidebarSettings/dashboard.svg";
import BuildsSVG from "../../public/svg/sidebarSettings/builds.svg";
import TestsSVG from "../../public/svg/sidebarSettings/testsList.svg";
import ProjectSettings from "../../public/svg/sidebarSettings/projectSettings.svg";
import NewFeatures from "../../public/svg/sidebarSettings/newFeatures.svg";
import Help from "../../public/svg/sidebarSettings/help.svg";
import Logout from "../../public/svg/sidebarSettings/logout.svg";
import DropdownSVG from "../../public/svg/sidebarSettings/drodpown.svg";
import { CreateTest } from "@ui/components/app/CreateTestButton";
import { useRouter } from "next/router";
import { SidebarTeamDropdown } from "@ui/containers/sidebar/dropdown";
import { CreateProjectModal } from "@ui/containers/modals/createProjectModal";
import ReactDOM from "react-dom";
import { addProject } from "@services/projects";
import { AddPaymentModel } from "@ui/containers/modals/addPaymentModal";

interface NavItem {
	name: string;
	link: string;
	icon: string;
}

interface NavListProps {
	navItems: Array<NavItem>;
	style?: CSSProperties;
}

function NavList(props: NavListProps) {
	const { navItems, style } = props;
	const router = useRouter();
	return (
		<ul style={style} css={styles.primaryMenu}>
			{navItems.map((item: NavItem, i) => {
				const SVGImage = item.icon;
				return (
					<li
						className={(router as any).pathname === item.link ? "active" : null}
						key={i}
					>
						<Link href={item.link}>
							<a href={item.link}>
								<SVGImage />
								<span>{item.name}</span>
							</a>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

// Todo- Breakdown in diff component.
function LeftSection(props: any) {
	const { userInfo, selectedProject } = props;
	const [showDropDown, setShowDropDwon] = useState(false);
	const [showAddProject, setShowAddProject] = useState(false);

	const closeProjectModal = () => {
		ReactDOM.render(null, document.getElementById("overlay"));
		setShowAddProject(false);
	};

	const mainNavLinks = [
		{
			name: "Dashboard",
			link: "/app/project/dashboard",
			icon: DasgboardSvg,
		},
		{
			name: "Builds",
			link: "/app/project/builds",
			icon: BuildsSVG,
		},
		{
			name: "Tests",
			link: "/app/project/tests",
			icon: TestsSVG,
		},
		{
			name: "Project Settings",
			link: "/app/project/settings/hosts",
			icon: ProjectSettings,
		},
	];

	const bottomNavLinks = [
		{
			name: "New features",
			link: "/app/new-features",
			icon: NewFeatures,
		},
		{
			name: "Help & Support",
			link: "/app/help-support",
			icon: Help,
		},
		{
			name: "Logout",
			link: resolvePathToBackendURI("/user/logout"),
			icon: Logout,
		},
	];

	const toggleSettingsDropDown = () => {
		setShowDropDwon(!showDropDown);
	};

	const userFistCharacter = userInfo.name.slice(0, 1);
	const closePaymentModal = () => {
		setPaymentShow(false);
		ReactDOM.render(null, document.getElementById("overlay"));
	};

	const [showPayment, setPaymentShow] = useState(false);
	return (
		<div css={styles.leftSection}>
			<div css={styles.sectionContainer}>
				<div css={styles.sectionHeaderItem}>
					{/*@Note :- Change hardcoded text*/}
					<div css={styles.teamIcon} onClick={toggleSettingsDropDown}>
						{userFistCharacter}
					</div>
					<div css={styles.sectionHeaderContentArea}>
						<span
							style={{
								color: "#2B2B39",
								fontSize: "1rem",
								fontFamily: "Cera Pro",
								fontWeight: "bold",
							}}
							onClick={toggleSettingsDropDown}
						>
							{toPascalCase(selectedProject && selectedProject)} project
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
							{userInfo.name}
						</span>

						<div onClick={setPaymentShow.bind(this, true)} css={addPaymentOnTrial}>
							14 days left. Add payment.
						</div>
						{showPayment && (
							<AddPaymentModel onClose={closePaymentModal} />
						)}
					</div>
					<div css={styles.sectionHeaderSetting} onClick={toggleSettingsDropDown}>
						<DropdownSVG style={{ marginTop: ".5rem" }} />
					</div>
					{showDropDown && (
						<SidebarTeamDropdown
							onAddProjectCallback={setShowAddProject.bind(this, true)}
							onOutsideClick={toggleSettingsDropDown}
						/>
					)}
					{showAddProject && <CreateProjectModal onClose={closeProjectModal} />}
				</div>

				<NavList navItems={mainNavLinks} />
			</div>
			<div css={styles.settingsBottomFixedContainer}>
				<NavList navItems={bottomNavLinks} />
			</div>
			<div css={styles.inviteMembers}>
				<img src="/svg/sidebarSettings/team_member.svg" />
				<span>Invite members</span>
			</div>
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
	onChange: (project) => void;
}) {
	const router = useRouter();
	const [isShowingCreateProjectModal, setIsShowingCreateProjectModal] = useState(
		false,
	);

	const { options, onChange, selectedProject } = props;
	const modifiedOption = [
		{ label: "Add new project", value: "add_project" },
		...options,
		{ label: "View all project", value: "view_all" },
	];
	const handleChange = (option) => {
		if (option.value === "add_project") {
			setIsShowingCreateProjectModal(true);
		} else if (option.value === "view_all") {
			router.push("/app/project/list");
		} else {
			onChange(option);
		}
	};

	const closeProjectModal = useCallback(() => {
		ReactDOM.render(null, document.getElementById("overlay"));
		setIsShowingCreateProjectModal(false);
	}, [isShowingCreateProjectModal]);

	return (
		<div css={styles.projectDropdownContainer}>
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

export function WithSidebarLayout(Component, shouldHaveGetInitialProps = true) {
	const WrappedComponent = function (props) {
		const { userInfo } = props;
		const selectedProject = useSelector(getSelectedProject);
		const projectsList = useSelector(getProjects);
		const selectedProjectName = projectsList.find((project) => {
			return project.id === selectedProject;
		});

		const options =
			projectsList &&
			projectsList.map((project) => {
				return { label: project.name, value: project.id };
			});

		useEffect(() => {
			if (!selectedProject) {
				store.dispatch(
					saveSelectedProjectInRedux(
						projectsList && projectsList.length ? projectsList[0].id : null,
					),
				);
			}
		}, [projectsList]);

		function onProjectChange(project) {
			store.dispatch(saveSelectedProjectInRedux(project.value));
		}

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
				<div css={styles.mainContainer}>
					<LeftSection
						selectedProject={
							selectedProjectName ? selectedProjectName.name : selectedProject
						}
						userInfo={userInfo}
					/>
					<div css={styles.contentContainer}>
						<div css={styles.header}>
							<CrusherLogo />
							<ProjectSelector
								projectsList={projectsList}
								options={options}
								selectedProject={selectedProject}
								onChange={onProjectChange}
							/>
							<Link href={"/app/project/onboarding/create-test"}>
								<a href={"/app/project/onboarding/create-test"} css={styles.createTest}>
									<CreateTest />
								</a>
							</Link>
						</div>
						<div css={styles.innerContentContainer}>
							<Component {...props} />
							<FeedbackComponent />
						</div>
					</div>
				</div>
			</div>
		);
	};
	if (shouldHaveGetInitialProps) {
		WrappedComponent.getInitialProps = async (ctx) => {
			const pageProps =
				Component.getInitialProps && (await Component.getInitialProps(ctx));
			return { ...pageProps };
		};
	}

	return WrappedComponent;
}

const addPaymentOnTrial = css`
	margin-top: 1rem;
	font-family: Gilroy;

	font-weight: 500;
	font-size: 0.95rem;

	text-decoration-line: underline;

	color: #2b2b39;
`;
const styles = {
	createTest: css`
		margin-left: auto;
		:hover {
			text-decoration: none !important;
		}
	`,
	inviteMembers: css`
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
	`,
	mainContainer: css`
		display: flex;
		height: 100vh;
		width: 100vw;
		font-family: DM Sans;
	`,
	leftSection: css`
		display: flex;
		flex-direction: column;
		min-width: 20.75rem;
		background: #fbfbfb;
		color: #fff;
		height: 100vh;
		overflow-y: scroll;
	`,
	sectionContainer: css`
		padding: 1.2rem 0;
	`,
	sectionHeaderItem: css`
		padding: 0 1.5rem;
		font-weight: 500;
		display: flex;
		position: relative;
		cursor: pointer;
	`,
	teamIcon: css`
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
	`,
	sectionHeaderContentArea: css`
		margin-left: 1.11rem;
		display: flex;
		flex-direction: column;
		align-self: center;
	`,
	sectionHeaderSetting: css`
		margin-left: auto;
		display: flex;
		justify-content: center;
		cursor: pointer;
	`,
	primaryMenu: css`
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
				content: url(/svg/sidebarSettings/tab_selected.svg);
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
	`,
	settingsBottomFixedContainer: css`
		margin-top: auto;
		margin-bottom: 2rem;
	`,
	infoSection: css`
		display: flex;
		flex-direction: column;
		padding: 0 1.625rem;
		color: #f3f3f3;
	`,
	infoSectionHeading: css`
		font-size: 0.925rem;
		font-weight: 500;
	`,
	infoSectionItemList: css`
		margin-top: 1.5rem;
		list-style: none;
		padding: 0;
		padding-left: 0;
		padding-right: 0;
		li {
			&:not(:last-child) {
				margin-bottom: 2.1rem;
			}
			background: rgba(22, 22, 22, 0.29);
			border: 1px solid #202026;
			color: #fbfbfb;
			font-weight: 500;
			font-size: 0.9rem;
			padding: 0;
			cursor: pointer;
			border-radius: 0.25rem;
		}
	`,
	infoSectionItem: css`
		display: flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
	`,
	infoSectionItemText: css`
		font-size: 0.92rem;
		margin-left: 1.15rem;
		text-align: left;
		line-height: 1.5rem;
	`,
	contentContainer: css`
		display: flex;
		background: #fbfbfb;
		flex: 1;
		flex-direction: column;
		height: 100vh;
		margin-left: -2px;
		overflow-y: scroll;
	`,
	header: css`
		display: flex;
		align-items: center;
		padding: 1rem 3rem;
	`,
	projectDropdownContainer: css`
		margin-left: 4.62rem;
		align-self: center;
		font-size: 1rem;
	`,
	innerContentContainer: css`
		flex: 1;
		border-top-left-radius: 1.35rem;
		border-style: solid;
		border-width: 1px;
		background: #fff;
		border-color: #e2e2e2;
	`,
};
