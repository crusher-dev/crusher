import { css } from "@emotion/core";
import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import { Pagination } from "@ui/components/common/Pagination";
import WithSession from "../../../src/hoc/withSession";
import { redirectToFrontendPath } from "@utils/router";
import { getCookies } from "@utils/cookies";
import { getAllJobsOfProject } from "@services/job";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { cleanHeaders } from "@utils/backendRequest";
import { getTime } from "@utils/helpers";
import { useRouter } from "next/router";
import { Player } from "@lottiefiles/react-lottie-player";
import Head from "next/head";
import Link from "next/link";
import { JobConclusion } from "@interfaces/JobConclusion";
import { JobStatus } from "@interfaces/JobStatus";

function RenderStatusImage(props) {
	const { status, conclusion, postCheckConclusion } = props;

	if (status === JobStatus.ABORTED) {
		return (
			<img
				src={"/svg/tests/buttons/failed.svg"}
				css={styles.button}
				style={{ width: "8.8rem" }}
			/>
		);
	}

	if (
		status === JobStatus.FINISHED &&
		postCheckConclusion === JobConclusion.PASSED
	) {
		return (
			<img
				src={"/svg/tests/buttons/approved.svg"}
				css={styles.button}
				style={{ width: "8.8rem" }}
			/>
		);
	}

	switch (conclusion) {
		case "PASSED":
			if (postCheckConclusion === JobConclusion.PASSED) {
				return (
					<img
						src={"/svg/tests/buttons/approved.svg"}
						css={styles.button}
						style={{ width: "8.8rem" }}
					/>
				);
			}
		case "FAILED":
			return (
				<img
					src={"/svg/tests/buttons/failed.svg"}
					css={styles.button}
					style={{ width: "8.8rem" }}
				/>
			);
		case "MANUAL_REVIEW_REQUIRED":
			return (
				<img
					src={"/svg/tests/buttons/needsReview.svg"}
					css={styles.button}
					style={{ width: "8.8rem" }}
				/>
			);
	}

	return (
		<img
			src={"/svg/tests/buttons/running.svg"}
			css={styles.button}
			style={{ width: "8.8rem" }}
		/>
	);
}

function Build(props) {
	const {
		jobId,
		createdAt,
		branchName,
		conclusion,
		commitId,
		commitName,
		status,
		totalScreenshotCount,
		passedScreenshotCount,
		reviewRequiredScreenshotCount,
	} = props;

	const testInstanceReviewLink = `/app/job/review?jobId=${jobId}`;

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
								<div css={styles.buildCommitBranch}>
									{branchName ? branchName : "N/A"}
								</div>
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
									<img src={"/svg/tests/screenshot.svg"} style={{ width: "1.15rem" }} />
									<span>
										{`${totalScreenshotCount ? totalScreenshotCount : 0} `}{" "}
										<span style={{ fontWeight: 600 }}> Screenshots</span>
									</span>
								</div>
								<div css={styles.buildShortInfo} style={{ margin: "0 auto" }}>
									<img src={"/svg/tests/passed.svg"} style={{ width: "1.15rem" }} />
									<span>
										{`${passedScreenshotCount ? passedScreenshotCount : 0} `}{" "}
										<span style={{ fontWeight: 600 }}> passed</span>
									</span>
								</div>
							</div>
							<div css={styles.buildShortItemsContainer}>
								<div css={styles.buildShortInfo}>
									<img src={"/svg/tests/review.svg"} style={{ width: "1.15rem" }} />
									<span>
										{`${
											reviewRequiredScreenshotCount ? reviewRequiredScreenshotCount : 0
										} `}{" "}
										<span style={{ fontWeight: 600 }}> Review required</span>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div css={styles.buttonContainer} style={{ marginLeft: "auto" }}>
						<RenderStatusImage
							postCheckConclusion={
								totalScreenshotCount === passedScreenshotCount
									? JobConclusion.PASSED
									: JobConclusion.FAILED
							}
							conclusion={conclusion}
							status={status}
						/>
					</div>
				</div>
			</li>
		</Link>
	);
}

function RenderBuilds(props) {
	const { builds } = props;
	const { jobs } = builds;
	console.log(jobs);
	const out = jobs
		? jobs.map((job) => {
				return (
					<Build
						jobId={job.id}
						createdAt={job.created_at}
						branchName={job.branch_name}
						commitId={job.commit_id}
						totalScreenshotCount={job.screenshotCount}
						passedScreenshotCount={job.passedScreenshotCount}
						reviewRequiredScreenshotCount={job.reviewRequiredScreenshotCount}
						commitName={job.commit_name}
						status={job.status}
						conclusion={job.conclusion}
					/>
				);
		  })
		: [];

	return <ul css={styles.buildsListContainer}>{out}</ul>;
}

function ProjectBuilds(props) {
	const { builds } = props;
	const router = useRouter();
	const [projectBuilds, setProjectBuilds] = useState(builds ? builds : []);
	const [isLoading, setIsLoading] = useState(false);
	const selectedProjectId = useSelector(getSelectedProject);
	const isInitialMount = useRef(true);
	const currentPage = router.query.page ? parseInt(router.query.page as any) : 1;

	const { totalPages } = (projectBuilds ? projectBuilds : {}) as any;

	function resolvePaginationUrl(pageNumber) {
		return `?page=${pageNumber}`;
	}

	return (
		<div
			style={{
				display: "flex",
				paddingTop: "2.41rem",
				paddingLeft: "4.25rem",
				paddingRight: "4.25rem",
				flexDirection: "column",
				color: "#2B2B39",
			}}
		>
			<Head>
				<script
					src={
						"https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
					}
					defer
				/>
			</Head>
			<div css={styles.heading}>Recent Builds</div>
			{!isLoading &&
			projectBuilds &&
			projectBuilds.jobs &&
			projectBuilds.jobs.length ? (
				<>
					<RenderBuilds builds={projectBuilds} />
					<Pagination
						totalPages={totalPages ? totalPages : 1}
						currentPage={currentPage}
						resolvePaginationUrl={resolvePaginationUrl}
					/>
				</>
			) : (
				<div css={styles.activitiesPlaceholderContainer}>
					<Player
						autoplay={true}
						src={"https://assets2.lottiefiles.com/packages/lf20_S6vWEd.json"}
						speed={1}
						background={"transparent"}
						style={{ width: 220, height: 220, margin: "0 auto" }}
						loop={true}
					/>
					<div css={styles.activitiesPlaceholderHeading}>Alas!</div>
					<div css={styles.activitiesPlaceholderMessageContainer}>
						<div>You don’t have any builds to show.</div>
						<div css={styles.blueItalicText}>Need any help</div>
					</div>
				</div>
			)}
		</div>
	);
}

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
	buildsIdNDate: css``,
	buildsId: css`
		font-size: 1.1rem;
		font-weight: 700;
		color: #202029;
		font-family: Cera Pro;
	`,
	buildsDate: css`
		margin-top: 0.5rem;
		font-size: 0.75rem;
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
		padding: 0.3rem 1rem;
		color: #000000;
		font-size: 0.75rem;
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
			margin-left: 0.95rem;
			position: relative;
			top: 50%;
			transform: translateY(-50%);
			font-size: 0.775rem;
			font-weight: 700;
		}
	`,
	buildShortItemsContainer: css`
		margin-top: 1rem;
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

ProjectBuilds.getInitialProps = async (ctx) => {
	const { res, req, store, query } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const defaultProject = getSelectedProject(store.getState());

		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);
		const page = query.page ? query.page : 1;

		const builds = await getAllJobsOfProject(
			selectedProject ? selectedProject : defaultProject,
			page,
			headers,
		);

		return {
			builds: builds,
			firstProjectId: selectedProject ? selectedProject : defaultProject,
			page: page,
		};
	} catch (er) {
		throw er;
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSidebarLayout(ProjectBuilds));
