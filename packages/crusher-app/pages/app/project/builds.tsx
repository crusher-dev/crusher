import React, { useEffect } from "react";
import { css } from "@emotion/core";
import withSession from "@hoc/withSession";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import { BuildList } from "@ui/containers/BuildList";
import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { getAllJobsOfProject } from "@services/job";
import Link from "next/link";
import { getTime } from "@utils/helpers";
import { JobReportStatus } from "@interfaces/JobReportStatus";
import { PAGE_TYPE } from "@constants/page";
import { ANALYTICS } from "@services/analytics";
import { Conditional } from "@ui/components/common/Conditional";
import { EmptyBuildListContainer } from "@ui/containers/builds/emptyBuildListContainer";

const AVAILABLE_FILTERS = [
	{ title: "Monitoring", value: 1 },
	{ title: "Manual", value: 2 },
];

function RenderStatusImage(props: any) {
	const { status } = props;

	if (status === JobReportStatus.FAILED) {
		return (
			<img
				src={"/svg/tests/buttons/failed.svg"}
				css={styles.button}
				style={{ width: "10.37500rem" }}
			/>
		);
	}

	if (status === JobReportStatus.PASSED) {
		return (
			<img
				src={"/svg/tests/buttons/approved.svg"}
				css={styles.button}
				style={{ width: "10.37500rem" }}
			/>
		);
	}

	if (status === JobReportStatus.MANUAL_REVIEW_REQUIRED) {
		return (
			<img
				src={"/svg/tests/buttons/needsReview.svg"}
				css={styles.button}
				style={{ width: "10.37500rem" }}
			/>
		);
	}

	return (
		<img
			src={"/svg/tests/buttons/running.svg"}
			css={styles.button}
			style={{ width: "10.37500rem" }}
		/>
	);
}

function BuildItem(props: any) {
	const {
        jobId,
        reportId,
        reportStatus,
        createdAt,
        commitId,
        commitName,
        totalScreenshotCount,
        passedScreenshotCount,
        reviewRequiredScreenshotCount
    } = props;

	const testInstanceReviewLink = `/app/job/review?jobId=${jobId}&reportId=${reportId}`;

	return (
        <Link href={testInstanceReviewLink as any}>
			<li css={styles.step}>
				<div
					style={{
						width: "0.25rem",
						background: "#F2F2F2",
						borderColor: "#F2F2F2",
						borderWidth: "0.05rem",
						borderTopLeftRadius: "0.25rem",
						borderBottomLeftRadius: "0.25rem",
						borderStyle: "solid",
					}}
				/>
				<div css={styles.innerStep}>
					<div css={styles.buildsIdNDate}>
						<div css={styles.buildsId}>#{jobId}</div>
						<div css={styles.buildsDate}>{getTime(new Date(createdAt))}</div>
					</div>
					<div css={styles.buildInfo}>
						<div>
							<div css={styles.buildCommitIds}>
								{/*<div css={styles.buildCommitBranch}>{branchName ? branchName : "N/A"}</div>*/}
								{commitId && (
									<div css={styles.buildCommit}>
										{commitId ? commitId.slice(0, 5) : "** No Commit **"}
									</div>
								)}
							</div>
							<div css={styles.buildCommitName}>{commitName}</div>
						</div>
					</div>
					<div css={styles.buildShortInfoParentContainer}>
						<div style={{ margin: "0 auto" }}>
							<div css={styles.buildShortTwoItemsContainer}>
								<div css={styles.buildShortInfo}>
									<img
										src={"/svg/tests/screenshot.svg"}
										style={{ width: "1.3125rem" }}
									/>
									<span>
										{`${totalScreenshotCount || 0} `}{" "}
										<span style={{ fontWeight: 600 }}> Screenshots</span>
									</span>
								</div>
								<div css={styles.buildShortInfo} style={{ margin: "0 auto" }}>
									<img src={"/svg/tests/passed.svg"} style={{ width: "1.3125rem" }} />
									<span>
										{`${passedScreenshotCount || 0} `}{" "}
										<span style={{ fontWeight: 600 }}> passed</span>
									</span>
								</div>
							</div>
							<div css={styles.buildShortItemsContainer}>
								<div css={styles.buildShortInfo}>
									<img src={"/svg/tests/review.svg"} style={{ width: "1.3125rem" }} />
									<span>
										{`${
											reviewRequiredScreenshotCount || 0
										} `}{" "}
										<span style={{ fontWeight: 600 }}> Review required</span>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div css={styles.buttonContainer} style={{ marginLeft: "auto" }}>
						<RenderStatusImage status={reportStatus} />
					</div>
				</div>
			</li>
		</Link>
    );
}

function buildList(props: any) {
	const { items: builds } = props;
	const { jobs } = builds;
	const out = jobs
		? jobs.map((job: any) => {
				return (
					<BuildItem
						reportId={job.reportId}
						jobId={job.id}
						createdAt={job.created_at}
						branchName={job.branch_name}
						commitId={job.commit_id}
						totalScreenshotCount={job.screenshotCount}
						passedScreenshotCount={job.passedScreenshotCount}
						reviewRequiredScreenshotCount={job.reviewRequiredScreenshotCount}
						commitName={job.commit_name}
						status={job.status}
						reportStatus={job.reportStatus}
						conclusion={job.conclusion}
					/>
				);
		  })
		: [];

	return <ul css={styles.buildsListContainer}>{out}</ul>;
}

function resolvePaginationUrl(pageNumber: number) {
	return `?page=${pageNumber}`;
}

function resolveCategoryUrl(category: number) {
	return `?category=${category}`;
}

const BuildPage = (props: any) => {
	const { builds, category, page } = props;
	useEffect(() => {
		ANALYTICS.trackPage(PAGE_TYPE.BUILD_PAGE);
	}, []);

	const isBuildsPresent = builds.jobs?.length;
	return (
		<div
			css={[
				containerCSS,
				isBuildsPresent ? containerPaddingCSS : emptyBuildsContainerPaddingCSS,
			]}
		>
			<Conditional If={isBuildsPresent}>
				<div css={filterContainerCss}>
					<div css={headingCSS}>Previous Builds</div>
					<div css={filterPaginationContainerCSS}>
						<BuildList
							categories={AVAILABLE_FILTERS}
							resolvePaginationUrl={resolvePaginationUrl}
							resolveCategoryUrl={resolveCategoryUrl}
							currentPage={parseInt(page)}
							totalPages={builds.totalPages}
							items={builds}
							itemsPerPage={10}
							selectedCategory={category}
							itemsListComponent={buildList}
						/>
					</div>
				</div>
			</Conditional>
			<Conditional If={!isBuildsPresent}>
				<EmptyBuildListContainer />
			</Conditional>
		</div>
	);
};

const containerCSS = css`
	height: 100%;
`;

const containerPaddingCSS = css`
	padding-top: 2.46rem;
	padding-left: 4.25rem;
	padding-right: 4.25rem;
`;

const emptyBuildsContainerPaddingCSS = css`
	padding-bottom: 4rem;
`;

const headingCSS = css`
	color: #454551;
	font-family: Cera Pro;
	font-weight: bold;
	font-size: 1.5rem;
`;

const filterContainerCss = css`
	margin-top: 1rem;
`;

const filterPaginationContainerCSS = css`
	margin-top: 1.5rem;
`;
const styles = {
	heading: css`
		font-size: 1.2rem;
		font-weight: 700;
	`,
	buildsListContainer: css`
		list-style: none;
		padding: 0;
		margin-top: 3rem;
		li {
			background: #ffffff;
			border: 1px solid #f2f2f2;
			background-radius: 0.25rem;
			border-radius: 0.25rem;
			display: flex;
			&:not(:last-child) {
				margin-bottom: 2.3rem;
			}
		}
	`,
	step: css`
		display: flex;
		border: 0.05rem solid #f2f2f2;
		border-radius: 0.25rem;
		cursor: pointer;
		&:not(:last-child) {
			margin-bottom: 2.2rem;
		}
	`,
	innerStep: css`
		display: flex;
		flex: 1;
		position: relative;
		z-index: 999;
		padding: 1.7rem 2rem;
		background-color: #fff;
	`,
	buildsIdNDate: css`
		flex: 0.1;
	`,
	buildsId: css`
		font-size: 1.375rem;
		font-weight: bold;
		font-style: normal;
		color: #202029;
		font-family: Cera Pro;
	`,
	buildsDate: css`
		margin-top: 0.75rem;
		font-size: 0.875rem;
		color: #2d3958;
		font-family: Gilroy;
		font-style: normal;
		font-weight: normal;
	`,
	buildInfo: css`
		margin-left: 2.25rem;
		flex: 0.35;
		display: flex;
		flex-direction: column;
		align-items: center;
	`,
	buildCommitIds: css`
		display: flex;
	`,
	buildCommitBranch: css`
		background: #f2f2f2;
		border-radius: 0.25rem;
		font-family: Gilroy;
		padding: 0.375rem 1.25rem;
		color: #000000;
		font-size: 0.875rem;
		font-weight: 500;
	`,
	buildCommit: css`
		flex: 1;
		margin-left: 1.25rem;
		color: #4d4a4a;
		font-weight: 500;
		display: flex;
		align-items: center;
		font-size: 0.75rem;
	`,
	buildCommitName: css`
		margin-top: 0.9rem;
		color: #8d8d8d;
		font-size: 0.75rem;
	`,
	buildShortInfoParentContainer: css`
		margin-left: 2rem;
		flex: 0.4;
	`,
	buildShortTwoItemsContainer: css`
		color: #5d5d5d;
		display: flex;
		align-items: center;
	`,
	buildShortInfo: css`
		color: #5d5d5d;
		font-family: Gilroy;
		& > span {
			margin-left: 1rem;
			position: relative;
			top: 50%;
			transform: translateY(-50%);
			font-size: 0.9375rem;
			font-weight: 700;
		}
	`,
	buildShortItemsContainer: css`
		margin-top: 1.5rem;
		color: #5d5d5d;
	`,
	buttonContainer: css`
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 0.2;
	`,
	button: css`
		cursor: pointer;
	`,
	activitiesPlaceholderContainer: css`
		border-radius: 0.25rem;
		padding: 0;
		margin-top: 2.375rem;
		border-radius: 0.2rem;
		padding: 5rem 5.45rem;
	`,
	activitiesPlaceholderHeading: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.5rem;
		color: #2b2b39;
		text-align: center;
	`,
	activitiesPlaceholderMessageContainer: css`
		margin-top: 1rem;
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 1.15rem;
		line-height: 2rem;
		color: #2b2b39;
		text-align: center;
	`,
	blueItalicText: css`
		color: #5b76f7;
		font-weight: bold;
		font-style: italic;
	`,
};

BuildPage.getInitialProps = async (ctx: any) => {
	const {
        req,
        store,
        query
    } = ctx;
	try {
        let headers;
        if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

        const cookies = getCookies(req);
        const defaultProject = getSelectedProject(store.getState());

        const selectedProject = JSON.parse(
			cookies.selectedProject || null,
		);
        const {
            page = 1,
            category = 0
        } = query;

        const selectedProjectId = selectedProject || defaultProject;
        const builds = await getAllJobsOfProject(
			selectedProjectId,
			category,
			page,
			headers,
		);

        return {
			builds: builds,
			projectId: selectedProjectId,
			category: category,
			page: page,
		};
    } catch (er) {
        throw er;
    }
};

export default withSession(withSidebarLayout(BuildPage));
