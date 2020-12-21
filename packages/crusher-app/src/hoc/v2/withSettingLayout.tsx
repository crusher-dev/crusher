import { css } from "@emotion/core";
import Head from "next/head";
import PlusSVG from "../../../public/svg/sidebarSettings/plus.svg";
import BackSVG from "../../../public/svg/settings/back.svg";
import StarSVG from "../../../public/svg/settings/star.svg";
import UserSVG from "../../../public/svg/settings/user.svg";
import BuildingSVG from "../../../public/svg/settings/building.svg";
import TeamSVG from "../../../public/svg/settings/team.svg";

import React from "react";

const accountMenuData = {
	title: "Account",
	primarySVG: UserSVG,
	subMenu: [
		{ title: "Profile" },
		{ title: "Preferences" },
		{ title: "Notification" },
	],
};
const workspaceMenuData = {
	title: "Workspace",
	primarySVG: BuildingSVG,
	subMenu: [
		{ title: "General" },
		{ title: "Plan" },
		{ title: "Billing" },
		{ title: "Members" },
		{ title: "Import/Export" },
	],
};
const projectMenuData = {
	title: "Project",
	primarySVG: TeamSVG,
	subMenu: [
		{ title: "Manage host" },
		{ title: "Team members" },
		{ title: "Integration" },
		{ title: "Notifications" },
		{ title: "Other" },
	],
};

export function WithSettingsLayout(
	Component,
	shouldHaveGetInitialProps = true,
) {
	const WrappedComponent = function (props) {
		return (
			<div>
				<Head>
					<title>Crusher | Create your first test</title>
					<link
						href="/assets/img/favicon.png"
						rel="shortcut icon"
						type="image/x-icon"
					/>
				</Head>
				<div css={settingsPage}>
					{ProjectContainer()}
					{MenuContainer()}
					<div style={{ flex: 1 }}>
						<Component {...props} />
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

function ProjectContainer() {
	const ProjectItem = () => <div css={projectIcon}>C</div>;
	return (
		<div css={projectBar}>
			<ProjectItem />
			<div id="add-project">
				<PlusSVG />
			</div>
		</div>
	);
}

function MenuContainer() {
	return (
		<div css={menuBar}>
			<div css={topMenuSection}>
				<div id="back-container">
					<div id="arrow-icon">
						<BackSVG />
					</div>
					<div id="back-text">Settings</div>
				</div>
				<div id="plan-container">
					<StarSVG /> <span id="plan-text">Pro Plan </span>
				</div>
			</div>

			<MainMenuItem data={accountMenuData} />
			<MainMenuItem data={workspaceMenuData} />
			<MainMenuItem data={projectMenuData} />
			<div style={{ marginTop: "1.8rem" }}>
				<div css={menuBottomLink}>
					<PlusSVG /> <span>Add team member</span>
				</div>
				<div css={menuBottomLink}>
					<PlusSVG /> <span>Add project</span>
				</div>
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
	return (
		<div css={mainMenu}>
			<div className="menu-heading">
				<SVG /> <span>{data.title}</span>
			</div>
			{data.subMenu &&
				data.subMenu.map((item, i) => (
					<div css={menuItem} className={i === 0 ? "selected" : ""}>
						<div className="selected-bar"></div>
						<div className="menu-text">{item.title}</div>
					</div>
				))}
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
	height: 100%;
`;
