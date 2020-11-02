import { css } from "@emotion/core";
import Head from "next/head";
import { DropDown } from "@ui/components/project/DropDown";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
	getProjectsList,
	getSelectedProject,
} from "@redux/stateUtils/projects";
import { saveSelectedProjectInRedux } from "@redux/actions/action";
import { store } from "@redux/store";
import { resolvePathToBackendURI } from "@utils/url";
import React, { useEffect } from "react";
import { toPascalCase } from "@utils/helpers";

// Todo- Breakdown in diff component.
function LeftSection(props) {
	const { userInfo, selectedProject } = props;
	return (
		<div css={styles.leftSection}>
			<div>
				<div css={styles.sectionContainer}>
					<div css={styles.sectionHeaderItem}>
						<div css={styles.projectFavicon}>H</div>
						<div css={styles.sectionHeaderContentArea}>
							<span
								style={{
									color: "#2B2B39",
									fontSize: "1rem",
									fontFamily: "Cera Pro",
									fontWeight: "bold",
								}}
							>
								{toPascalCase(selectedProject ? selectedProject : "")}
							</span>

							{userInfo && (
								<span
									style={{
										color: "#8C8C8C",
										fontFamily: "Gilroy",
										fontStyle: "normal",
										fontSize: "0.8rem",
										marginTop: "0.05rem",
									}}
								>
									{userInfo.name}
								</span>
							)}
						</div>
						<div css={styles.sectionHeaderSetting}>
							{/*<img src={"/svg/settings.svg"} />*/}
						</div>
					</div>
					<ul css={styles.sectionItemList}>
						<li>
							<Link href={"/app/project/dashboard"}>
								<a href={"/app/project/dashboard"}>
									<img src="/svg/sidebarSettings/dashboard.svg" />
									<span>Dashboard</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href={"/app/project/builds"}>
								<a href={"/app/project/builds"}>
									<img src="/svg/sidebarSettings/builds.svg" />
									<span>Builds</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href={"/app/project/tests"}>
								<a href={"/app/project/tests"}>
									<img src="/svg/sidebarSettings/testsList.svg" />
									<span>Tests List</span>
								</a>
							</Link>
						</li>
						<li>
							<Link href={"/app/project/settings/hosts"}>
								<a href={"/app/project/settings/hosts"}>
									<img src="/svg/sidebarSettings/projectSettings.svg" />
									<span>Project Settings</span>
								</a>
							</Link>
						</li>
					</ul>
				</div>
			</div>

			<div css={styles.settingsBottomFixedContainer}>
				{/*<div css={styles.infoSection}>*/}
				{/*	<div css={styles.infoSectionHeading}>*/}
				{/*		<span>Released this week</span>*/}
				{/*		<img*/}
				{/*			src={'/svg/sidebarSettings/info.svg'}*/}
				{/*			style={{ marginLeft: '1.5rem', height: '1.05rem' }}*/}
				{/*		/>*/}
				{/*	</div>*/}
				{/*	<ul css={styles.infoSectionItemList}>*/}
				{/*		<li>*/}
				{/*			<div css={styles.infoSectionItem}>*/}
				{/*				<img*/}
				{/*					src={'/svg/sidebarSettings/live.svg'}*/}
				{/*					style={{ height: '2.2rem' }}*/}
				{/*				/>*/}
				{/*				<div css={styles.infoSectionItemText}>*/}
				{/*					<div style={{ fontWeight: 600 }}>Live Reviews</div>*/}
				{/*					<div*/}
				{/*						style={{*/}
				{/*							fontSize: '0.80rem',*/}
				{/*							fontWeight: 400,*/}
				{/*							marginTop: '0.175rem',*/}
				{/*							color: '#DFDFDF',*/}
				{/*						}}*/}
				{/*					>*/}
				{/*						Get realtime feedback*/}
				{/*					</div>*/}
				{/*				</div>*/}
				{/*			</div>*/}
				{/*		</li>*/}
				{/*	</ul>*/}
				{/*</div>*/}
				<a href={resolvePathToBackendURI("/user/logout")}>
					<div
						style={{
							marginTop: "2.25rem",

							cursor: "pointer",
							marginBottom: "0.4rem",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<img
							src={"/svg/sidebarSettings/logout.svg"}
							style={{ height: "1.15rem" }}
						/>

						<span
							style={{
								marginLeft: "1.5rem",
								color: "#23232F",
								fontFamily: "Gilroy",
								fontWeight: 500,
								fontSize: "0.9rem",
							}}
						>
							Logout
						</span>
					</div>
				</a>
			</div>
		</div>
	);
}

function Logo() {
	return (
		<Link href={"/app/project/dashboard"}>
			<a href={"/app/project/dashboard"}>
				<img
					src={"/svg/logo-dark.svg"}
					style={{ cursor: "pointer", width: "11.62rem" }}
				/>
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
	return (
		<div css={styles.projectDropdownContainer}>
			{props.projectsList && (
				<DropDown
					options={props.options}
					selected={props.selectedProject ? { value: props.selectedProject } : {}}
					onChange={props.onChange}
					placeholder={"Select project"}
				/>
			)}
		</div>
	);
}

function AddTestButton() {
	return (
		<Link href={"/app/project/onboarding/create-test"}>
			<a
				href={"/app/project/onboarding/create-test"}
				css={styles.createTestContainer}
			>
				<img src={"/svg/add.svg"} />
				<span css={styles.createTestLabel}>Create a test</span>
			</a>
		</Link>
	);
}

export function WithSidebarLayout(Component, shouldHaveGetInitialProps = true) {
	const WrappedComponent = function (props) {
		const { userInfo } = props;
		const selectedProject = useSelector(getSelectedProject);
		const projectsList = useSelector(getProjectsList);
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
							<Logo />
							<ProjectSelector
								projectsList={projectsList}
								options={options}
								selectedProject={selectedProject}
								onChange={onProjectChange}
							/>
							<AddTestButton />
						</div>
						<div css={styles.innerContentContainer}>
							<Component {...props} />
						</div>
					</div>
				</div>
				<style jsx global>{`
					body {
						background: #fbfbfb;
						font-family: DM Sans;
					}
					::-webkit-scrollbar {
						width: 2px; /* Remove scrollbar space */
					}
					a {
						text-decoration: none;
						color: inherit;
					}
					a:hover {
						text-decoration: none;
						color: inherit;
					}
				`}</style>
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

const styles = {
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
		padding: 2rem 0rem;
	`,
	sectionHeaderItem: css`
		padding: 0 1.5rem;
		font-weight: 500;
		display: flex;
	`,
	projectFavicon: css`
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 0.8rem 1.12rem;
		font-weight: 900;
		font-size: 0.85rem;
		background: rgba(0, 0, 0, 0.25);
		color: #888888;
		border-radius: 0.3rem;
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
		align-items: center;
		justify-content: center;
		cursor: pointer;
	`,
	sectionItemList: css`
		margin-top: 5.55rem;
		list-style: none;
		padding: 0;
		padding: 0 1.625rem;
		@media (max-width: 1120px) {
			margin-top: 3.55rem;
		}
		li {
			&:not(:last-child) {
				margin-bottom: 2.56rem;
			}

			img {
				height: 1.25rem;
			}
			color: #636363;
			font-weight: 500;
			font-size: 1.33rem;
			display: flex;
			align-items: center;
			cursor: pointer;
			span {
				font-size: 1rem;
				margin-left: 1.45rem;
			}
		}
	`,
	settingsBottomFixedContainer: css`
		margin-top: auto;
		padding-bottom: 1.5rem;
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
		padding-left: 0rem;
		padding-right: 0rem;
		li {
			&:not(:last-child) {
				margin-bottom: 2.1rem;
			}
			background: rgba(22, 22, 22, 0.29);
			border: 1px solid #202026;
			color: #fbfbfb;
			font-weight: 500;
			font-size: 0.9rem;
			padding: 0rem;
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
		overflow-y: scroll;
	`,
	header: css`
		display: flex;
		border-bottom-color: #f2f2f2;

		border-bottom-style: solid;
		// 		border-bottom-width: 0.125rem;
		// padding: 1rem 4.25rem;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		align-items: center;
		padding: 1rem 4.25rem;
	`,
	projectDropdownContainer: css`
		margin-left: 4.62rem;
		align-self: center;
		font-size: 1rem;
	`,
	createTestContainer: css`
		margin-left: auto;
		align-self: center;
		display: flex;
		cursor: pointer;
	`,
	createTestLabel: css`
		margin-left: 1.5rem;
		font-weight: 500;
		font-size: 1.06rem;
		align-self: center;
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
