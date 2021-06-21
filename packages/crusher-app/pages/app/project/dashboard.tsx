import { css } from "@emotion/core";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import withSession from "@hoc/withSession";
import { getCookies } from "@utils/cookies";
import {
	getAllJobsOfProject,
	getAllProjectLogs,
	getMetaDashboardProjectInfo,
} from "@services/job";
import { redirectToFrontendPath } from "@utils/router";
import {backendRequest} from "@utils/backendRequest";
import { getSelectedProject } from "@redux/stateUtils/projects";
import React from "react";
import Link from "next/link";
import { fetchTestsCountInProject } from "@services/projects";
import { serialize } from "cookie";
import { RequestMethod } from "@interfaces/RequestOptions";
import { getTime } from "@utils/helpers";
import { JobReportStatus } from "@interfaces/JobReportStatus";
import { iPageContext } from "@interfaces/pageContext";

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
        reportStatus,
        reportId
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
						{/*<div css={styles.commitName}>{branchName ? branchName : "N/A"}</div>*/}
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

function Tests({test}) {
	return (
		<li>
			<div css={styles.activityInfoContainer}>
				<div css={styles.userName}>{test.testName}</div>
				<div css={styles.activityInfo}>Approved build</div>
			</div>
			<div css={styles.buildsIdNDate} style={{ marginLeft: "auto" }}>
				<div css={styles.buildsId}>Working</div>
				<div css={styles.buildsDate} style={{ marginTop: "0" }}>
					{test.lastRunAt}
				</div>
			</div>
		</li>
	);
}

function RenderBuilds(props) {
	const { builds } = props;
	const out =
		builds?.jobs && Array.isArray(builds.jobs)
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

function RenderTests(props) {
	const { tests } = props;
	return <ul css={styles.activityList}>{tests.map((test) =>{
		return <Tests test={test} />;
	})}</ul>;
}

function OverviewItem(props: { heading: string, itemStatus: string, desc: string, src: string }) {
	return (<div css={styles.overviewItem}>
		<div css={styles.productionHealthItemText}>
			<div className={'heading'}>{props.heading}</div>
			<div css={styles.productionHealthItemDesc}>{props.itemStatus}</div>
			<div css={styles.overviewItemInfo}>{props.desc}</div>

		</div>
		<img
			src={props.src}
			css={styles.productionHealthItemImage}
			style={{ width: '2.5rem' }}
		/>
	</div>);
}

function ProjectDashboard(props) {
	const { builds: projectBuilds, userInfo, metaDashboardInfo, tests } = props;

	const { lastStatus, last30DaysStatus, hoursSaved, buildTime } = metaDashboardInfo;
	return (
		<div css={styles.container}>
			<div css={styles.productionContainer}>
				<div css={styles.productionHeading}>Production Health</div>
				<div css={styles.overviewContainer}>
				<OverviewItem heading={"Last run status"} itemStatus={lastStatus.status} desc={lastStatus.info} src={"/svg/dashboard/live.svg"} />
				<OverviewItem heading={"Last 30 days status"} itemStatus={last30DaysStatus.status} desc={last30DaysStatus.info} src={"/svg/dashboard/live.svg"} />
				<OverviewItem heading={"Hours Saved"} itemStatus={hoursSaved.status} desc={hoursSaved.info} src={"/svg/dashboard/live.svg"} />
				<OverviewItem heading={"Average Build time"} itemStatus={buildTime.status} desc={buildTime.info} src={"/svg/dashboard/live.svg"} />
				</div>
				</div>

			<div css={styles.buildActivityContainer}>
				<div css={styles.leftSection}>
					<div css={styles.section}>
						<div css={styles.sectionHeadingContainer}>
							<div css={styles.sectionHeading}>Builds</div>
						</div>
						<RenderBuilds userInfo={userInfo} builds={projectBuilds} />
					</div>
				</div>

				<div css={styles.rightSection}>
					<div css={styles.section}>
						<div css={styles.sectionHeadingContainer}>
							<div css={styles.sectionHeading}>Tests</div>
						</div>
						<RenderTests userInfo={userInfo} tests={tests} />
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
	overviewContainer: css`
		display: flex;
		margin-top: 1.5rem;
		justify-content: space-between;
	`,
	overviewItem: css`
		border: 1px solid #C4C4C4;
    border-bottom: 4px solid #C4C4C4;
		border-radius: 0.55rem;
		display: flex;
		flex: 1rem;
		max-width: 25%;
		padding: 0.75rem 1.2rem;
		
		.heading{
			font-size: 1rem;
      font-weight: bold;
		
      color: #636363B2;
    }
		&:not(:first-child) {
			margin-left: 2rem;
		}
	`,
	productionHealthItemText: css``,
	overviewItemInfo: css`
		font-size: 0.9rem;
    margin-top: .25rem;
		color: #636363;
	`,
	productionHealthItemDesc: css`
		color: #513879;
		font-size: 1.5rem;
		font-weight: 700;
		margin-top: 1rem;
    text-transform: uppercase;
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
		margin-left: .5rem;
	`,
	userName: css`
		font-size: 0.95rem;
		font-weight: 700;
	`,
	activityInfo: css`
		font-size: 0.7rem;
		margin-top: 0.4rem;
		color: #2d3958;
	`,
	buildsIdNDate: css``,
	buildsId: css`
		font-size: 1rem;
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

ProjectDashboard.getInitialProps = async (ctx: iPageContext) => {
	const { res, req, store } = ctx;
	try {
		const cookies = getCookies(req);
		if (cookies?.cli_token) {
			await handleCliToken(cookies.cli_token, res, req);
		}

		const selectedProject = getSelectedProject(store.getState());
		const testsCount = await fetchTestsCountInProject(
			selectedProject,
			ctx.metaInfo.headers,
		);

		// If 0 test count redirect to welcome screen
		if (testsCount && testsCount.totalTests === 0) {
			await redirectToFrontendPath("/app/project/onboarding/create-test", res);
			return {};
		}

		const buildsPromise = getAllJobsOfProject(
			selectedProject,
			null,
			ctx.metaInfo.headers,
		);
		const testPromise = getAllProjectLogs(
			selectedProject,
			ctx.metaInfo.headers,
		);

		const metaDashboardInfo = await getMetaDashboardProjectInfo(
			selectedProject,
			ctx.metaInfo.headers,
		);

		const [builds, tests] = await Promise.all([
			buildsPromise,
			testPromise,
		]);


		return {
			builds,
			tests,
			metaDashboardInfo,
		};
	} catch (er) {
		console.error(er);
		await redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(withSidebarLayout(ProjectDashboard));
