import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import WithSession from "@hoc/withSession";
import { getCookies } from "@utils/cookies";
import {
	getAllJobsOfProject,
	getAllProjectLogs,
	getMetaDashboardProjectInfo,
} from "@services/job";
import { redirectToFrontendPath } from "@utils/router";
import { backendRequest, cleanHeaders } from "@utils/backendRequest";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTestsCountInProject } from "@services/projects";
import { serialize } from "cookie";
import { RequestMethod } from "@interfaces/RequestOptions";
import { getTime } from "@utils/helpers";
import { JobReportStatus } from "@interfaces/JobReportStatus";

function getBuildStatus(status: JobReportStatus) {
	if (status === JobReportStatus.FAILED) {
		return "FAILED";
	}

	if (status === JobReportStatus.PASSED) {
		return "PASSED";
	}

	if (status === JobReportStatus.MANUAL_REVIEW_REQUIRED) {
		return "NEEDS REVIEW";
	}

	return "RUNNING";
}

function Build(props: any) {
	const {
		jobId,
		createdAt,
		branchName,
		reportStatus,
		reportId,
		conclusion,
		commitId,
		commitName,
		status,
	} = props;

	return (
		<Link href={`/app/job/review?jobId=${jobId}&reportId=${reportId}`}>
			<a href={`/app/job/review?jobId=${jobId}&reportId=${reportId}`}>
				<li>
					<div css={styles.buildsIdNDate}>
						<div css={styles.buildsId}>#{jobId}</div>
						<div css={styles.buildsDate}>{getTime(new Date(createdAt))}</div>
					</div>
					<div css={styles.commitContainer}>
						<div css={styles.commitName}>{branchName ? branchName : "N/A"}</div>
					</div>
					<div css={[styles.reviewButton]}>
						<img src={"/svg/dashboard/whiteFlag.svg"} style={{ width: "0.6rem" }} />
						<span>{getBuildStatus(reportStatus)}</span>
					</div>
				</li>
			</a>
		</Link>
	);
}

function Activity(props) {
	return (
		<li>
			<div css={styles.userImage}></div>
			<div css={styles.activityInfoContainer}>
				<div css={styles.userName}>Himanshu Dixit</div>
				<div css={styles.activityInfo}>Approved build</div>
			</div>
			<div css={styles.buildsIdNDate} style={{ marginLeft: "auto" }}>
				<div css={styles.buildsId}>#7982</div>
				<div css={styles.buildsDate} style={{ marginTop: "0" }}>
					21 Aug | 9:15 pm
				</div>
			</div>
		</li>
	);
}

function RenderBuilds(props) {
	const { builds } = props;
	const out =
		builds && builds.jobs && Array.isArray(builds.jobs)
			? builds.jobs.map((job) => {
					return (
						<Build
							jobId={job.id}
							reportId={job.reportId}
							reportStatus={job.reportStatus}
							createdAt={job.created_at}
							branchName={job.branch_name}
							commitId={job.commit_id}
							commitName={job.commit_name}
							status={job.status}
							conclusion={job.conclusion}
						/>
					);
			  })
			: [];
	return <ul css={styles.buildsList}>{out}</ul>;
}

function RenderActivities(props) {
	const { activities, userInfo } = props;
	const activitiesOut = activities.map((activity) => {
		return <Activity />;
	});

	if (activitiesOut.length === 0) {
		return (
			<div css={styles.activitiesPlaceholderContainer}>
				<div css={styles.activitiesPlaceholderHeading}>Alas!</div>
				<div css={styles.activitiesPlaceholderMessageContainer}>
					<div>You don’t have any activity to show.</div>
					<div css={styles.blueItalicText}>Need any help</div>
				</div>
			</div>
		);
	}

	return <ul css={styles.activityList}>{activitiesOut}</ul>;
}

function ProjectDashboard(props) {
	const { builds, activities, userInfo, metaDashboardInfo } = props;
	const [dashboardInfo, setDashboardInfo] = useState({
		projectBuilds: builds ? builds : [],
		projectActivities: activities ? activities : [],
		isLoading: false,
	});
	const selectedProjectId = useSelector(getSelectedProject);

	useEffect(() => {
		setDashboardInfo({ ...dashboardInfo, isLoading: true });
		const activitiesPromise = getAllProjectLogs(selectedProjectId);
		const buildsPromise = getAllJobsOfProject(selectedProjectId, 1);
		Promise.all([activitiesPromise, buildsPromise])
			.then(([activities, builds]) => {
				setDashboardInfo({
					projectBuilds: builds,
					projectActivities: activities,
					isLoading: false,
				});
			})
			.catch((err) => {
				// Show some error;
				console.error("Can't perform network requests");
				setDashboardInfo({ ...dashboardInfo, isLoading: false });
			});
	}, [selectedProjectId]);

	const { totalJobsToday } = metaDashboardInfo;
	const { projectBuilds, projectActivities } = dashboardInfo;
	return (
		<div css={styles.container}>
			<div css={styles.productionContainer}>
				<div css={styles.productionHeading}>Production Health</div>
				<div css={styles.productionHealthItemsContainer}>
					<div css={styles.productionHealthItem}>
						<div css={styles.productionHealthItemText}>
							<div css={styles.productionHealthItemHeading}>Status</div>
							<div css={styles.productionHealthItemDesc}>UP</div>
						</div>
						<img
							src={"/svg/dashboard/live.svg"}
							css={styles.productionHealthItemImage}
							style={{ width: "2.5rem" }}
						/>
					</div>
					<div
						css={styles.productionHealthItem}
						style={{ borderColor: "#FB4359", color: "#FB4359" }}
					>
						<div css={styles.productionHealthItemText}>
							<div css={styles.productionHealthItemHeading}>Health</div>
							<div css={styles.productionHealthItemDesc} style={{ color: "#FB4359" }}>
								N/A
							</div>
						</div>
						<img
							src={"/svg/dashboard/health.svg"}
							css={styles.productionHealthItemImage}
							style={{ width: "1.65rem" }}
						/>
					</div>
					<div css={styles.productionHealthItem}>
						<div css={styles.productionHealthItemText}>
							<div css={styles.productionHealthItemHeading}>Jobs ran today</div>
							<div css={styles.productionHealthItemDesc}>{totalJobsToday}</div>
						</div>
						<img
							src={"/svg/dashboard/calendar.svg"}
							css={styles.productionHealthItemImage}
							style={{ width: "1.65rem" }}
						/>
					</div>
				</div>
			</div>
			<div css={styles.buildActivityContainer}>
				<div css={styles.leftSection}>
					<div css={styles.section}>
						<div css={styles.sectionHeadingContainer}>
							<div css={styles.sectionHeading}>Builds</div>
							<div css={styles.sectionHeadingDesc}>Triggered from CI/Github</div>
						</div>
						<RenderBuilds userInfo={userInfo} builds={projectBuilds} />
					</div>
				</div>
				<div css={styles.rightSection}>
					<div css={styles.section}>
						<div css={styles.sectionHeadingContainer}>
							<div css={styles.sectionHeading}>Activity</div>
							<div css={styles.sectionHeadingDesc}>
								See what’s happening here and there
							</div>
						</div>
						<RenderActivities userInfo={userInfo} activities={[]} />
					</div>
				</div>
			</div>
		</div>
	);
}

const styles = {
	button: css`
		cursor: pointer;
	`,
	container: css`
		display: flex;
		padding-top: 2.46rem;
		padding-left: 4.25rem;
		padding-right: 4.25rem;
		flex-direction: column;
		color: #2b2b39;
		height: 100%;
	`,
	productionContainer: css``,
	productionHeading: css`
		font-size: 1.1rem;
		font-weight: 700;
	`,
	productionHealthItemsContainer: css`
		display: flex;
		margin-top: 1.5rem;
		justify-content: space-between;
	`,
	productionHealthItem: css`
		border: 1px solid #d8e9ff;
		border-radius: 0.25rem;
		display: flex;
		flex: 1rem;
		max-width: 20;
		padding: 0.75rem 1.2rem;
	`,
	productionHealthItemText: css``,
	productionHealthItemHeading: css`
		font-size: 0.9rem;
		font-weight: 500;
	`,
	productionHealthItemDesc: css`
		color: #513879;
		font-size: 1.1rem;
		font-weight: 700;
		margin-top: 0.25rem;
	`,
	productionHealthItemImage: css`
		margin-left: auto;
		position: relative;
	`,
	buildActivityContainer: css`
		display: flex;
		justify-content: space-between;
		flex: 1;
		margin-top: 4.25rem;
	`,
	section: css``,
	sectionHeadingContainer: css``,
	sectionHeading: css`
		font-size: 1.1rem;
		font-weight: 700;
	`,
	sectionHeadingDesc: css`
		font-size: 0.875rem;
		margin-top: 0.19rem;
	`,
	leftSection: css`
		flex: 0.48;
		height: 100%;
		max-width: 90%;
	`,
	rightSection: css`
		flex: 0.48;
		max-width: 90%;
	`,
	buildsList: css`
		list-style: none;
		border-radius: 0.25rem;
		padding: 0;
		margin-top: 2.375rem;
		border-radius: 0.2rem;
		border: 1px solid #d8e9ff;
		li {
			position: relative;
			&:not(:last-child) {
				border-bottom: 1px solid #d8e9ff;
			}
			padding: 1rem 1.125rem;
			padding-right: 1.75rem;
			display: flex;
		}
	`,
	activityList: css`
		list-style: none;
		border-radius: 0.25rem;
		padding: 0;
		margin-top: 2.375rem;
		border-radius: 0.2rem;
		border: 1px solid #d8e9ff;
		li {
			position: relative;
			&:not(:last-child) {
				border-bottom: 1px solid #d8e9ff;
			}
			padding: 1rem 1.125rem;
			padding-right: 1.75rem;
			display: flex;
		}
	`,
	userImage: css`
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 1.25rem;
		background: #c4c4c4;
	`,
	activityInfoContainer: css`
		color: #000000;
		flex: 1;
		margin-left: 1.2rem;
	`,
	userName: css`
		font-size: 0.75rem;
		font-weight: 700;
	`,
	activityInfo: css`
		font-size: 0.7rem;
		margin-top: 0.4rem;
		color: #2d3958;
	`,
	buildsIdNDate: css``,
	buildsId: css`
		font-size: 1.1rem;
		color: #513879;
		font-weight: 700;
	`,
	buildsDate: css`
		margin-top: 0.4rem;
		font-size: 0.7rem;
	`,
	commitContainer: css`
		flex: 1;
		display: flex;
		justify-content: center;
		height: 0%;
		position: relative;
		top: 50%;
		transform: translateY(50%);
	`,
	commitName: css`
		background: #f2f2f2;
		color: #000000;
		font-size: 0.7rem;
		font-weight: 500;
		padding: 0.3rem 1rem;
	`,
	buildStatusButton: css`
		font-size: 0.75rem;
		font-weight: 500;
		display: inline-block;
		height: 0%;
		padding: 0.25rem 0.5rem;
		position: relative;
		top: 50%;
		transform: translateY(30%);
		padding: 0.25rem 0.5rem;
		span {
			margin-left: 0.8rem;
		}
		width: 8.5rem;
	`,
	reviewButton: css`
		background: #513879;
		border: 0.06rem solid #36284b;
		border-radius: 0.2rem;
		color: #ffffff;
		font-weight: 500;
		display: inline-block;
		height: 0%;
		padding: 0.25rem 0.5rem;
		padding-right: 1.3rem;
		font-size: 0.7rem;
		position: relative;
		top: 50%;
		transform: translateY(35%);
		span {
			margin-left: 0.8rem;
		}
	`,
	activitiesPlaceholderContainer: css`
		border-radius: 0.25rem;
		padding: 0;
		margin-top: 2.375rem;
		border-radius: 0.2rem;
		border: 1px solid #d8e9ff;
		padding: 7.5rem 5.45rem;
	`,
	activitiesPlaceholderHeading: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.2rem;
		color: #2b2b39;
		text-align: center;
	`,
	activitiesPlaceholderMessageContainer: css`
		margin-top: 1.45rem;
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 0.9rem;
		color: #2b2b39;
		text-align: center;
	`,
	blueItalicText: css`
		color: #5b76f7;
		font-weight: bold;
		font-style: italic;
	`,
};

const handleCliToken = async (cli_token, res, req) => {
	if (!cli_token) return;
	await backendRequest(`/cli/update/${cli_token}`, {
		method: RequestMethod.POST,
		headers: req.headers,
	});

	res.setHeader(
		"Set-Cookie",
		serialize("cli_token", cli_token, { path: "/", maxAge: 0 }),
	);
};

ProjectDashboard.getInitialProps = async (ctx) => {
	const { res, req, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		if (cookies && cookies.cli_token) {
			await handleCliToken(cookies.cli_token, res, req);
		}
		const defaultProject = getSelectedProject(store.getState());
		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);

		const testsCount = await fetchTestsCountInProject(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);

		// If 0 test count redirect to welcome screen
		if (!!testsCount && testsCount.totalTests === 0) {
			await redirectToFrontendPath("/app/project/onboarding/create-test", res);
			return {};
		}

		const buildsPromise = getAllJobsOfProject(
			selectedProject ? selectedProject : defaultProject,
			1,
			headers,
		);
		const activitiesPromise = getAllProjectLogs(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);

		const metaDashboardInfo = await getMetaDashboardProjectInfo(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);

		const [builds, activities] = await Promise.all([
			buildsPromise,
			activitiesPromise,
		]);

		return {
			builds: builds,
			activities: activities,
			metaDashboardInfo: metaDashboardInfo,
		};
	} catch (er) {
		console.error(er);
		await redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSidebarLayout(ProjectDashboard));
