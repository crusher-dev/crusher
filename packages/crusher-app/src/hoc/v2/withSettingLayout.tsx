import { css } from "@emotion/core";
import Head from "next/head";
import PlusSVG from "../../../public/svg/sidebarSettings/plus.svg";
import BackSVG from "../../../public/svg/settings/back.svg";
import TeamSVG from "../../../public/svg/settings/team.svg";

import React, { useCallback, useState } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { Conditional } from "@ui/components/common/Conditional";
import { CreateProjectModal } from "@ui/containers/modals/createProjectModal";
import ReactDOM from "react-dom";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import { useSelector } from "react-redux";
import { InviteTeamMemberModal } from "@ui/containers/modals/inviteTeamMemberModal";
import { store } from "@redux/store";
import { saveSelectedProjectInRedux } from "@redux/actions/project";
import { getEdition } from "@utils/helpers";
import { EDITION_TYPE } from "@crusher-shared/types/common/general";

const projectMenuData = {
	title: "Project",
	primarySVG: TeamSVG,
	subMenu: [
		{
			id: "project-basic-settings",
			title: "Basic",
			link: "/app/settings/project/basic",
		},
		{
			id: "project-members-settings",
			title: "Project members",
			link: "/app/settings/project/members",
			children: ["/app/settings/project/invite-members"],
		},
		{
			id: "project-monitoring-settings",
			title: "Hosts/Monitoring",
			link: "/app/settings/project/monitoring",
			children: ["/app/settings/project/add-monitoring", "/app/settings/project/add-host"],
		},
	],
};

const teamMenuData = {
	title: "Team",
	primarySVG: TeamSVG,
	subMenu: [
		{
			id: "team-members-settings",
			title: "Team members",
			link: "/app/settings/team/members",
			children: ["/app/settings/team/invite-members"],
		},
	],
};

export function WithSettingsLayout(Component, shouldHaveGetInitialProps = true) {
	const WrappedComponent = function (props) {
		const [shouldShowCreateProjectModal, setShouldShowCreateProjectModal] = useState(false);

		const [shouldShowAddTeamMemberModal, setShouldShowAddTeamMemberModal] = useState(false);

		const showCreateProjectModal = () => {
			setShouldShowCreateProjectModal(true);
		};

		const showAddTeamMemberModal = () => {
			setShouldShowAddTeamMemberModal(true);
		};

		const closeCreateProjectModal = () => {
			ReactDOM.render(null as any, document.getElementById("overlay"));
			setShouldShowCreateProjectModal(false);
		};
		const closeAddTeamMemberModal = () => {
			ReactDOM.render(null as any, document.getElementById("overlay"));
			setShouldShowAddTeamMemberModal(false);
		};

		return (
			<div>
				<Head>
					<title>Crusher | Create your first test</title>
					<link href="/assets/img/favicon.png" rel="shortcut icon" type="image/x-icon" />
				</Head>
				<div css={settingsPage}>
					<ProjectContainer showCreateProjectModal={showCreateProjectModal} />
					<MenuContainer showAddTeamMemberModal={showAddTeamMemberModal} showCreateProjectModal={showCreateProjectModal} />
					<div style={{ flex: 1, overflowY: "auto" }}>
						<Component {...props} />
					</div>
					<Conditional If={shouldShowCreateProjectModal}>
						<CreateProjectModal onClose={closeCreateProjectModal} />
					</Conditional>
					<Conditional If={shouldShowAddTeamMemberModal}>
						<InviteTeamMemberModal onClose={closeAddTeamMemberModal} />
					</Conditional>
				</div>
			</div>
		);
	};
	if (shouldHaveGetInitialProps) {
		WrappedComponent.getInitialProps = async (ctx) => {
			const pageProps = Component.getInitialProps && (await Component.getInitialProps(ctx));
			return pageProps;
		};
	}

	return WrappedComponent;
}

interface iProjectContainerProps {
	showCreateProjectModal: any;
}
function ProjectContainer(props: iProjectContainerProps) {
	const { showCreateProjectModal } = props;
	const selectedProject = useSelector(getSelectedProject);
	const projectsList = useSelector(getProjects);

	const handleProjectChange = (projectId: number) => {
		if (selectedProject !== projectId) {
			store.dispatch(saveSelectedProjectInRedux(projectId));
			Router.replace("/app/project/dashboard");
		}
	};

	const getProjectItems = useCallback(() => {
		return projectsList.map((projectItem) => {
			return (
				<div
					key={projectItem.id}
					css={[projectIcon, projectItem.id === selectedProject ? selectedProjectIconCSS : null]}
					onClick={handleProjectChange.bind(this, projectItem.id)}
				>
					{projectItem.name[0].toUpperCase()}
				</div>
			);
		});
	}, [projectsList]);

	const projectItems = getProjectItems();

	const addProject = () => {
		showCreateProjectModal();
	};

	return (
		<div css={projectBar}>
			{projectItems}
			{getEdition() === EDITION_TYPE.EE && (
				<div id="add-project" onClick={addProject}>
					<PlusSVG />
				</div>
			)}
		</div>
	);
}

interface iMenuContainerProps {
	showAddTeamMemberModal: () => any;
	showCreateProjectModal: () => any;
}

function MenuContainer(props: iMenuContainerProps) {
	const { showAddTeamMemberModal, showCreateProjectModal } = props;

	const goBackToApp = () => {
		Router.replace("/app");
	};

	return (
		<div css={menuBar}>
			<div css={topMenuSection}>
				<div id="back-container">
					<div id="arrow-icon" onClick={goBackToApp}>
						<BackSVG />
					</div>
					<div id="back-text">Settings</div>
				</div>
				<div id="plan-container"></div>
			</div>

			<MainMenuItem data={projectMenuData} />

			<MainMenuItem data={teamMenuData} />

			<div style={{ marginTop: "auto" }}>
				<div css={menuBottomLink} onClick={showAddTeamMemberModal}>
					<PlusSVG /> <span>Add team member</span>
				</div>
				{getEdition() === EDITION_TYPE.EE && (
					<div css={menuBottomLink} onClick={showCreateProjectModal}>
						<PlusSVG /> <span>Add project</span>
					</div>
				)}
			</div>
		</div>
	);
}

const menuBottomLink = css`
	cursor: pointer;
	display: flex;
	align-items: center;
	margin-bottom: 1.35rem;
	svg {
		height: 1.15rem;
		width: 1.15rem;
	}
	svg > path {
		fill: #323232;
	}
	padding: 0 2rem 0 1.5rem;
	span {
		margin-left: 0.75rem;
		font-weight: 600;
		line-height: 0.82rem;
		color: #636363;
		font-size: 0.82rem;
	}

	:hover {
		span {
			color: #636363 !important;
		}
	}
`;

function MainMenuItem({ data }) {
	const SVG = data.primarySVG;
	const router = useRouter();
	const currentRoute = router.pathname;

	const handleItemClick = (item: any) => {
		Router.replace(item.link);
	};

	return (
        <div css={mainMenu}>
			<div className="menu-heading">
				<SVG /> <span>{data.title}</span>
			</div>
			{data.subMenu?.map(item => {
                return (
                    <div
                        css={menuItem}
                        onClick={handleItemClick.bind(this, item)}
                        className={currentRoute === item.link || (item.children && item.children.includes(currentRoute)) ? "selected" : ""}
                    >
                        <div className="selected-bar"></div>
                        <div className="menu-text">{item.title}</div>
                    </div>
                );
            })}
		</div>
    );
}

const menuItem = css`
	position: relative;
	:hover {
		.menu-text {
			background: #f3f3f3;
			color: #323232;
		}
		cursor: pointer;
	}
	.menu-text {
		padding: 0.65rem 0.95rem;

		margin-left: 2.5rem;
		margin-right: 2rem;
		border-radius: 4px;
		font-family: Gilroy;
		font-weight: 500;
		font-size: 0.875rem;
		line-height: 0.875rem;
		color: #636363;
	}
	margin-bottom: 0.25rem;
`;

const mainMenu = css`
	margin-bottom: 3rem;
	.menu-heading {
		display: flex;
		padding: 0 2rem 0 1.5rem;
		span {
			margin-left: 0.75rem;
			font-size: 0.94rem;
			line-height: 0.94rem;
			font-weight: 700;
		}
		margin-bottom: 1.03rem;
		color: #323232;
	}

	.selected {
		.menu-text {
			background: #f3f3f3;
		}

		.selected-bar {
			position: absolute;
			left: 0;
			height: 100%;
			width: 3px;
			background: #506cf5;
			border-top-right-radius: 12px;
			border-bottom-right-radius: 13px;
		}
	}
`;

const projectIcon = css`
	border-radius: 5px;
	width: 2.2rem;
	height: 2.36rem;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.75rem;
	font-weight: 800;
	font-size: 13px;
	color: #323232;
	text-transformation: uppercase;
	background: #e4e4e4;
	:hover {
		cursor: pointer;
		background: #fff;
		border: 2px solid #eae8e8;
	}
`;

const selectedProjectIconCSS = css`
	background: #2b2b39;
	color: #f4f4f4;
	:hover {
		cursor: pointer;
		background: #2b2b39b8 !important;
		border: 2px solid #2b2b39b8 !important;
	}
`;

const projectBar = css`
	align-item: center;
	height: 100vh;
	background: #f3f3f3;
	border: 1px solid #eae8e8;
	padding: 0 0.65rem;
	padding-top: 2rem;

	#add-project {
		cursor: pointer;
		display: flex;
		justify-content: center;
		svg {
			height: 1.15rem;
			width: 1.15rem;
		}
		svg > path {
			fill: #323232;
		}
	}

	#add-project:hover {
		svg > path {
			fill: #5b76f7;
		}
	}
`;

const topMenuSection = css`
	display: flex;
	padding-top: 2.5rem;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 2.725rem;
	padding: 0 2rem 0 1.5rem;
	color: #323232;
	margin-bottom: 2.875rem;

	#plan-container,
	#back-container {
		cursor: pointer;
		display: flex;
		flex-direction: row;
		justify-conter: center;
		align-items: end;
	}

	#plan-container {
		svg {
			width: 0.75rem;
			height: 0.75rem;
		}
		align-items: end;
	}
	#back-text {
		font-family: "Cera Pro";
		font-weight: 700;
		font-size: 0.97rem;
		line-height: 0.97rem;
	}

	#plan-text {
		font-family: "Cera Pro";
		font-weight: 600;
		font-size: 0.825rem;
		line-height: 0.825rem;
	}
	#back-text,
	#plan-text {
		margin-left: 0.75rem;
	}
`;

const menuBar = css`
	width: 20rem;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #fbfbfb;
	border: 1px solid #eae8e8;
	overflow-y: auto;
`;

const settingsPage = css`
	display: flex;
	height: 100vh;
`;
