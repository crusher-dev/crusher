import Head from "next/head";
import { Header } from "@ui/containers/reviewPage/BuildHeader";
import React, {useCallback, useEffect, useState} from "react";
import withSession from "@hoc/withSession";

import { css } from "@emotion/core";
import { redirectToFrontendPath } from "@utils/router";
import { cleanHeaders } from "@utils/backendRequest";
import { Platform } from "@interfaces/Platform";
import { approveResult, rejectResult } from "@services/results";
import { getTime, toPascalCase } from "@utils/helpers";
import { LogsBox } from "@ui/components/editor/LogsBox";
import { TestInstanceStatus } from "@interfaces/TestInstanceStatus";
import { JobReportService } from "@services/v2/jobReport";
import Clock from "../../../public/svg/jobReview/clock.svg";
import Play from "../../../public/svg/jobReview/play.svg";
import Passed from "../../../public/svg/jobReview/passed.svg";
import Failed from "../../../public/svg/jobReview/failed.svg";
import ReviewIcon from "../../../public/svg/jobReview/review.svg";

import {setCurrentJobPlatform, setJobInfo} from "@redux/actions/job";
import { useSelector } from "react-redux";
import {
	getCurrentJob,
	getCurrentJobComments,
	getCurrentJobInstances,
	getCurrentJobResults,
	getCurrentJobReviewPlatform,
	getReferenceJob,
} from "@redux/stateUtils/job";
import { store } from "@redux/store";
import { JobInfo } from "@interfaces/JobInfo";
import { TestInstanceService } from "@services/v2/testInstance";
import { getAllTestInstancesLogs } from "@redux/stateUtils/testInstance";

const MODAL_TYPE = {
	TEST_INSTANCE_LOGS: "TEST_INSTANCE_LOGS",
	TEST_INSTANCE_VIDEO: "TEST_INSTANCE_VIDEO",
};

function JobInfoBox() {
    const jobInfo: JobInfo["job"] = useSelector(getCurrentJob);

    const {
        id: jobId,
        branch_name: branchName,
        commit_name: commitName
    } = jobInfo;

    const approveAll = () => {
		alert("Approved");
	};

    return (
		<div className=" mg-t-70">
			<div
				className="card ht-md-100p d-flex justify-content-center "
				style={{ padding: 0 }}
				css={[containerCss, styles.blackTopCard]}
			>
				<div className="d-flex" style={{ display: "flex", padding: "20px 0px" }}>
					<div
						style={{
							display: "flex",

							alignItems: "self-end",
						}}
						className="col-lg-2"
					>
						<div
							className=" d-lg-block align-center"
							style={{
								position: "relative",
								top: "50%",
								transform: "translateY(-50%)",
							}}
						>
							<h4
								className="tx-28 tx-normal mg-b-5 mg-r-5 lh-1 tx-color-01"
								style={{
									color: "#fff",
									fontSize: "1.125rem",
									fontWeight: 600,
									fontFamily: "Cera Pro",
								}}
							>
								#{jobId}
							</h4>
							<h5
								className="tx-13 tx-color-03 mg-b-0 mg-t-15"
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									marginTop: "1.5rem",
								}}
							>
								<img src={"/svg/calendar.svg"} style={{ height: "0.875rem" }} />
								<span
									style={{
										marginLeft: "1.3rem",
										fontSize: "0.875rem",
										fontFamily: "Gilroy",
									}}
								>
									{getTime(new Date(jobInfo.updated_at))}
								</span>
							</h5>
						</div>
					</div>

					<div style={{ display: "flex" }} className="card-body col col-lg-3">
						<div className="d-lg-block align-items-end">
							<div className="d-flex align-items-center">
								{branchName && (
								<code
									className="tx-normal mg-b-0 mg-r-5 lh-1 tx-color-01"
									css={styles.branchContainer}
								>

										<span
											style={{
												fontSize: "0.8375rem",
												fontFamily: "Gilroy",
												color: "#ffffff",
											}}
										>
											{branchName}
										</span>

								</code>		)}
							</div>
							<div className="tx-14 tx-color-03" css={styles.commitName}>
								{commitName && (
									<span
										style={{
											fontSize: "0.875rem",
											fontFamily: "Gilroy",
											color: "#ffffff",
										}}
									>
										{commitName}
									</span>
								) }
							</div>
						</div>
					</div>

					<div className="card-body col col-lg-4 ml-5"></div>

					<div
						className="card-body col col-lg1 d-flex justify-content-center align-items-center"
						style={{ paddingRight: "0.3rem" }}
					>
						<div
							className="tx-bold d-flex"
							css={styles.approveButton}
							style={{ marginLeft: "auto" }}
						>
							<img
								src="/svg/unselectedThumbsIcon.svg"
								width={14}
								height={18}
								className="ml-2"
							/>
							<div
								className="text-center flex-1"
								style={{
									marginLeft: "1.6rem",
									marginRight: "1.4rem",
									fontSize: "0.8rem",
								}}
								onClick={approveAll}
							>
								Approve All
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function RenderScreenshotComparison({
    screenshot,
    result
}) {
	// null value means that the status of screenshot is getting loaded
	const {
        name: screenshotName,
        url: screenshotUrl
    } = screenshot;

	const [approvedScreenshot, setScreenshotApproved] = useState(
		result ? result.status === "PASSED" : false,
	);

	const {
        diff_image_url
    } = result || {} as any;
	const [shouldShowCommentsBox, setShouldShowCommentsBox] = useState(false);

	useEffect(() => {
		setShouldShowCommentsBox(!shouldShowCommentsBox);
	}, [screenshot]);

	async function handleThumbsUp() {
		if (!result) {
			return;
		}

		const approved = !approvedScreenshot;
		setScreenshotApproved(null);
		try {
			if (approved) {
				await approveResult(result.instance_result_set_id, result.id);
			} else {
				await rejectResult(result.instance_result_set_id, result.id);
			}
			setScreenshotApproved(approved);
		} catch {
			setScreenshotApproved(!approved);
		}
	}

	let approvedIcon = null;

	if (approvedScreenshot === null) {
		approvedIcon = "/svg/loadingIcon.svg";
	} else if (approvedScreenshot) {
		approvedIcon = "/svg/thumbsUp.svg";
	} else {
		approvedIcon = "/svg/unselectedThumbsIcon.svg";
	}

	return (
		<div className="pos-relative pb-3">
			<div className="pos-absolute t-0 wd-2" style={{ height: "100%", left: 6 }}>
				<div
					className="pos-relative"
					css={styles.instanceBorder}
					style={{
						width: "0.01rem",
						position: "relative",
						top: "-1rem",
						cursor: "pointer",
					}}
				>
					<img
						src={approvedIcon}
						onClick={handleThumbsUp}
						className="mt-n1"
						width={14}
						height={18}
						style={{ position: "absolute", top: 55, left: -6 }}
					/>
				</div>
			</div>
			<div className="tx-white d-flex justify-content-between mg-l-25 pd-l-35 pd-r-55 pt-3">
				<div style={{ width: "100%" }}>
					<span className="tx-medium tx-13">{screenshotName} screenshot</span>
					<div className="row pd-0 mg-0 mt-4" style={{ width: "100%" }}>
						<div className="col col-6 d-flex pd-0 pr-0 mr-0" css={styles.visualImage}>
							<img src={screenshotUrl} width={"auto"} style={{ maxWidth: "100%" }} />
						</div>
						<div className="col col-6 d-flex pd-0 pr-0 mr-0" css={styles.visualImage}>
							{diff_image_url && (
								<img src={diff_image_url} width={"auto"} style={{ maxWidth: "100%" }} />
							)}
						</div>
					</div>
					<div className="row pd-0 mg-0 mg-t-20 justify-content-end">
						<div className="col mt-2 col-6 d-flex flex-column pd-0 pr-0 mr-0 "></div>
					</div>
				</div>
			</div>
		</div>
	);
}

function OverlayModal(props) {
	const { shouldShow, children, closeModalCallback } = props;
	if (!shouldShow) return null;
	return <>
        <div css={styles.overlay} onClick={closeModalCallback}></div>
        <div
            style={{
                position: "fixed",
                zIndex: 100_001,
                left: "50%",
                transform: "translate(-50%, -50%)",
                top: "50%",
            }}
        >
            {children}
        </div>
    </>;
}

function GetStatusImage(props: any) {
	const { conclusion } = props;

	if (conclusion === "PASSED") {
		return <Passed style={{ height: "1.5rem" }} />;
	} else if (conclusion === "FAILED") {
		return <Failed style={{ height: "1.5rem" }} />;
	} else if (conclusion === "MANUAL_REVIEW_REQUIRED") {
		return <ReviewIcon style={{ height: "1.5rem" }} />;
	} else if (conclusion === "RUNNING_CHECKS") {
		return (
			<img style={{ height: "1.5rem" }} src={"/svg/jobReview/loading.svg"} />
		);
	} else {
		return null;
	}
}

function TestInstanceReview({
	instance,
	reportId,
	showVideoModalCallback,
	showLogsModalCallback,
}) {
    const {
        id: instance_id,
        test_name,
        images: screenshots,
        recorded_video_uri
    } = instance;
    const jobResults = useSelector(getCurrentJobResults);
    const jobComments = useSelector(getCurrentJobComments);
    const sortedScreenshots = screenshots.sort((a, b) => {
		return a.name < b.name ? -1 : 1;
	});

    const screenshotsOut = sortedScreenshots.map((screenshot) => {
		const result =
			jobResults[instance_id]?.results
				? jobResults[instance_id].results.filter((result) => {
						return result.screenshot_id === screenshot.id;
				  })[0]
				: null;

		const comments =
			jobComments && result && jobComments[result.id]
				? jobComments[result.id]
				: [];

		return (
			<RenderScreenshotComparison
				instance={instance}
				result={result}
				reportId={reportId}
				comments={comments}
				screenshot={screenshot}
			/>
		);
	});

    const results = jobResults[instance_id]?.results;

    function playVideo() {
		showVideoModalCallback(recorded_video_uri, instance_id);
	}

    function showLogsInModal() {
		showLogsModalCallback(instance_id);
	}

    const instanceReportConclusion = jobResults[instance_id]
		? jobResults[instance_id].conclusion
		: null;

    const handleThumbToggle = () => {
		console.log(JSON.stringify(jobResults[instance_id].conclusion));
	};

    const instanceFinishedRunning =
		instance.status !== TestInstanceStatus.RUNNING &&
		instance.status !== TestInstanceStatus.QUEUED;

    return (
		<div className="" css={styles.bodyBackground}>
			<div
				className="card-header"
				style={{
					paddingLeft: "2.5rem",
					paddingTop: "0.7rem",
					paddingBottom: "0.7rem",
					paddingRight: "2.5rem",
					background: "#15181E",
					position: "relative",
					zIndex: 3,
				}}
			>
				<div css={containerCss} className="d-flex pos-relative">
					<img
						src="/svg/thumbsUp.svg"
						className="mt-n1"
						style={{ cursor: "pointer" }}
						onClick={handleThumbToggle}
					/>
					<div
						css={testInstanceStripContainerCss}
						className="tx-white d-flex justify-content-between pl-3"
					>
						<h6 className="lh-5 mb-0 tx-white" css={styles.pinBoxHeading}>
							{test_name}
						</h6>
						<div
							style={{
								fontWeight: 500,
								display: "flex",
								flex: 1,
								paddingLeft: "5rem",
								flexDirection: "row",
								alignItems: "center",
								fontFamily: "Gilroy",
								fontSize: "0.825rem",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									marginRight: "2.875rem",
								}}
							>
								<div>
									<Clock style={{ height: "1.125rem" }} />
								</div>
								<div style={{ marginLeft: "1rem" }}>
									{instanceFinishedRunning
										? Math.floor(
												((new Date(instance.updated_at) - new Date(instance.created_at)) /
													1000) *
													10,
										  ) / 10
										: "N/A"}{" "}
									Sec
								</div>
							</div>
							{instance && instance.platform === Platform.CHROME ? (
								<div
									onClick={playVideo}
									style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
								>
									<div>
										<Play style={{ height: "1.125rem" }} />
									</div>
									<div style={{ marginLeft: "1rem" }}>Play test recording</div>
								</div>
							) : null}
						</div>
						{/*<div className="d-flex" css={styles.darkApproveButton}>*/}
						{/*	<img*/}
						{/*		src="/svg/unselectedThumbsIcon.svg"*/}
						{/*		style={{*/}
						{/*			height: "0.9375rem",*/}
						{/*			position: "relative",*/}
						{/*			top: "50%",*/}
						{/*			transform: "translateY(-50%)",*/}
						{/*		}}*/}
						{/*		className="ml-2"*/}
						{/*	/>*/}
						{/*	<div*/}
						{/*		className="text-center flex-1"*/}
						{/*		style={{*/}
						{/*			marginLeft: "1.6rem",*/}
						{/*			marginRight: "1.4rem",*/}
						{/*			fontSize: "1rem",*/}
						{/*			fontFamily: "Gilroy",*/}
						{/*		}}*/}
						{/*		onClick={approve}*/}
						{/*	>*/}
						{/*		Approve*/}
						{/*	</div>*/}
						{/*</div>*/}
					</div>
				</div>
			</div>
			<div css={containerCss} className="tx-white pos-relative pd-b-30">
				<div
					className="tx-white pt-3 mg-b-10"
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						paddingTop: "1rem",
						padding: "1rem 3rem",
					}}
				>
					<div style={{ display: "flex", alignItems: "center" }}>
						<div>
							<GetStatusImage conclusion={instanceReportConclusion} />
						</div>
						<div style={{ marginLeft: "1rem" }}>
							Test {toPascalCase(instanceReportConclusion)}
						</div>
					</div>
					<div style={{ marginLeft: "auto", display: "flex", flexDirection: "row" }}>
						<div
							onClick={showLogsInModal}
							style={{
								fontFamily: "Poppins",
								fontSize: "0.8rem",
								fontWeight: 700,
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								cursor: "pointer",
								marginLeft: "3rem",
							}}
						>
							<img src={"/svg/debug.svg"} width={22} />
							<span style={{ marginLeft: "0.8rem", marginTop: "0.1rem" }}>
								Debug info
							</span>
						</div>
					</div>
				</div>

				{screenshotsOut}
			</div>
		</div>
	);
}

function RenderTestInstances(props) {
	const { showVideoModalCallback, showLogsModalCallback, reportId } = props;
	const testInstancesMap = useSelector(getCurrentJobInstances);
	const currentPlatform = useSelector(getCurrentJobReviewPlatform);

	const out = Object.values(testInstancesMap)
		.filter((instance: any) => {
			return instance.platform === currentPlatform;
		})
		.map((instance) => {
			return (
				<TestInstanceReview
					instance={instance}
					reportId={reportId}
					showLogsModalCallback={showLogsModalCallback}
					showVideoModalCallback={showVideoModalCallback}
				/>
			);
		});

	return <>{out}</>;
}

function VideoModal({ video_uri }) {
	return (
		<div css={styles.videoOverlayContent}>
			<video
				controls={true}
				style={{ width: "40" }}
				autoPlay={true}
				src={video_uri}
			/>
		</div>
	);
}

function LogsModal({ logs }) {
	return (
		<div css={styles.logsOverlayContent}>
			<LogsBox
				style={{ background: "#fff" }}
				status={TestInstanceStatus.FINISHED}
				testInfo={{ logs, status: TestInstanceStatus.QUEUED }}
			/>
		</div>
	);
}

function JobReviews(props) {
	const { reportId } = props;
	const platform = useSelector(getCurrentJobReviewPlatform);
	const referenceJob = useSelector(getReferenceJob);

	const handlePlatformChange = async (platform) => {
		return store.dispatch(setCurrentJobPlatform(platform));
	};

	const [modalStatus, setModalStatus] = useState({
		shown: false,
		type: null,
		instanceId: null,
		value: null,
	});

	const testsLogsForInstancesMap = useSelector(getAllTestInstancesLogs);

	const showLogsModalCallback = useCallback(
		function (instanceId) {
			TestInstanceService.fetchLogsForTestInstance(instanceId);
			setModalStatus({
				shown: true,
				type: MODAL_TYPE.TEST_INSTANCE_LOGS,
				instanceId: instanceId,
				value: null,
			});
		},
		[modalStatus],
	);

	const showVideoModalCallback = useCallback(
		function (videoUrl, instanceId) {
			setModalStatus({
				shown: true,
				type: MODAL_TYPE.TEST_INSTANCE_VIDEO,
				instanceId: instanceId,
				value: { uri: videoUrl },
			});
		},
		[modalStatus],
	);

	function closeModal() {
		setModalStatus({ shown: false, type: null, instanceId: null, value: null });
	}

	// @ts-ignore
	return (
        <div
			className=""
			style={{ display: "flex", flexDirection: "column", background: "#131415" }}
		>
			<Head>
				<title>Add a Test Group | Control center to maintain all your tests</title>
				<link
					href="/assets/img/favicon.png"
					rel="shortcut icon"
					type="image/x-icon"
				/>
				<link
					href="/lib/@fortawesome/fontawesome-free/css/all.min.css"
					rel="stylesheet"
				/>
				<link href="/lib/ionicons/css/ionicons.min.css" rel="stylesheet" />

				<link href="/assets/css/dashforge.css" rel="stylesheet" />
				<link href="/assets/css/dashforge.dashboard.css" rel="stylesheet" />
			</Head>
			<div>Hi everyone!!</div>
			<Header
				onPlatformChanged={handlePlatformChange}
				platform={platform}
				referenceJob={referenceJob}
				reportId={reportId}
			></Header>

			<div style={{ height: "100vh", backgroundColor: "#131415" }}>
				<JobInfoBox />
				<RenderTestInstances
					showLogsModalCallback={showLogsModalCallback}
					showVideoModalCallback={showVideoModalCallback}
					reportId={reportId}
				/>
			</div>

			{modalStatus?.shown &&
				modalStatus.type === MODAL_TYPE.TEST_INSTANCE_VIDEO && (
					<OverlayModal closeModalCallback={closeModal} shouldShow={true}>
						<VideoModal video_uri={modalStatus.value.uri} />
					</OverlayModal>
				)}
			{modalStatus?.shown &&
				modalStatus.type === MODAL_TYPE.TEST_INSTANCE_LOGS && (
					<OverlayModal closeModalCallback={closeModal} shouldShow={true}>
						{testsLogsForInstancesMap[modalStatus.instanceId] ? (
							<LogsModal logs={testsLogsForInstancesMap[modalStatus.instanceId]} />
						) : (
							<div>Loading.....</div>
						)}
					</OverlayModal>
				)}
		</div>
    );
}

JobReviews.getInitialProps = async ({ req, res, query, store }) => {
	const { jobId, reportId } = query;
	let headers = null;
	if (req) {
		headers = req.headers;
		cleanHeaders(headers);
	}

	if (!jobId) {
		await redirectToFrontendPath("/", res);
	}

	await JobReportService.getJobReportFull(reportId, headers)
		.then((res) => {
			store.dispatch(setJobInfo("CHROME", res));
			return res;
		})
		.catch(async () => {
			await redirectToFrontendPath("/error", res);
		});

	return {
		reportId: reportId,
	};
};

export default withSession(JobReviews);

const containerCss = css`
	max-width: 70vw;
	margin: 0 auto;
`;

const testInstanceStripContainerCss = css`
	width: 100%;
	border: none !important;
	margin-left: 0.9375rem;
`;

const styles = {
	branchContainer: css`
		background: #272829;
		border-radius: 4px;
		font-weight: 500;
		font-size: 12px;
		text-align: center;
		padding: 5px 20px;
		padding-top: 8px;
		font-family: Poppins;
	`,
	commitId: css`
		marginleft: 12px;
	`,
	commitName: css`
		font-size: 0.85rem;
		margin-top: 1.25rem;
	`,
	statusBox: css`
		background: #83f3bd;
		border: 1.25px solid #5cda9d;
		border-radius: 4px;
		color: #2c7a55;
	`,
	approveButton: css`
		color: #ffffff;
		background: #5b76f7;
		font-weight: 600;
		border: 1px solid #3553e1;
		border-radius: 0.1rem;
		padding-left: 12px !important;
		padding-top: 8px !important;
		padding-bottom: 8px !important;
		cursor: pointer;
	`,
	darkApproveButton: css`
		color: #ffffff;
		background: rgb(12, 15, 22);
		border: 0px solid #2e3945;
		border-radius: 0.1rem;
		padding-left: 12px !important;
		padding-top: 6px !important;
		padding-bottom: 6px !important;
		cursor: pointer;
		font-weight: 600;
		font-family: Cera Pro;
	`,
	bodyBackground: css`
		background-color: #131415;
		overflow-y: hidden;
	`,
	blackInstanceCard: css`
		border-radius: 0;
		color: white !important;
		border: none;
		background-color: #1d1f25;

		.card-header {
			background-color: #161719;
		}
		.tx-color-01 {
			color: white !important;
		}
		h6 {
			color: white !important;
		}
		.tx-color-03 {
			color: white !important;
		}
		.tx-color-02 {
			color: white !important;
		}
	`,
	blackTopCard: css`
		background-color: #131415;
		color: white !important;
		font-family: Poppins;
		border: none !important;

		.tx-color-01 {
			color: white !important;
		}
		.tx-color-03 {
			color: white !important;
		}
		.tx-color-02 {
			color: white !important;
		}
	`,
	pinBoxHeading: css`
		display: flex;
		align-items: center;
		font-family: Cera Pro;
		font-size: 1.1rem;
	`,
	instanceBorder: css`
		background: #1e2327;
		height: 100%;
	`,
	visualImage: css`
		background: #1d1f25;
		background-repeat: no-repeat;
		background-size: contain;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		padding: 1rem;
	`,
	thumbsUpContainer: css`
		background: #1fd852;
		border-radius: 4px;
		padding: 1.2px 9px;
		padding-bottom: 0px;
	`,
	commentIconContainer: css`
		background: #51aafc;
		border-radius: 4px;
		padding: 1.2px 9px;
		padding-bottom: 0px;
	`,
	waitPlatformName: css`
		font-weight: 600;
		font-size: 14px;
		text-align: center;
		margin-top: 20px;
	`,
	commentBoxContainer: css`
		width: 100%;
		background: #171a1e;
		border-radius: 0.9rem;
		padding: 1.5rem 1.35rem;
		margin-top: 1.8rem;
	`,
	commentsList: css`
		list-style: none;
		padding: 0;
		position: relative;
		max-height: 24rem;
		overflow-y: scroll;
	`,
	commentItem: css`
		display: flex;
		background: #171a1e;
		z-index: 2;
		&:not(:last-child) {
			margin-bottom: 2.6rem;
		}
	`,
	commentAvatarContainer: css`
		font-family: Poppins;
		font-size: 0.75rem;
		font-weight: 600;
	`,
	commentAvatar: css`
		padding: 0.5rem 0.8rem;
		background: #0e1114;
		border-radius: 0.25rem;
	`,
	commentContentContainer: css`
		margin-left: 1rem;
		margin-right: 1.6rem;
		flex: 1;
	`,
	commentHeadingContainer: css`
		display: flex;
	`,
	commentUserName: css`
		font-size: 0.78rem;
		font-family: Poppins;
		font-weight: 600;
		color: #b6babe;
	`,
	commentHeadingSettings: css`
		margin-left: auto;
		display: flex;
		align-items: center;
	`,
	commentMessage: css`
		margin-top: 0.6rem;
		font-size: 0.75rem;
		color: #ffffff;
		font-family: Poppins;
	`,
	timeAgoText: css`
		font-family: Poppins;
		color: #4a4f56;
		font-size: 0.67rem;
	`,
	commentCountContainer: css`
		margin-left: 1.1rem;
		display: flex;
		align-items: center;
	`,
	commentCount: css`
		font-family: Poppins;
		color: #4a4f56;
		font-size: 0.75rem;
		font-weight: 600;
		margin-left: 0.7rem;
	`,
	commentBoxInputContainer: css`
		border-radius: 0.5rem;
		background: #121518;
		margin-top: 1.5rem;
		font-size: 0.75rem;
		color: #4a4f56;
		padding: 0.9rem 1.4rem;
	`,
	commentBox: css`
		font-size: 0.75rem;
		color: #4a4f56;
		font-family: Poppins;
		padding-right: 3.4rem;
		color: #fff;
		&:empty:before {
			color: #4a4f56;
			content: attr(placeholder);
		}
	`,
	commentIcon: css`
		position: absolute;
		right: 0;
		top: 0;
		margin: 0.9rem 1.4rem;
		cursor: pointer;
	`,
	overlay: css`
		position: fixed;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.5);
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	`,
	videoOverlayContent: css`
		background: #090a0a;
		padding: 0.175rem 0.125rem;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-align-items: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		border-radius: 0.8rem;
	`,
	logsOverlayContent: css`
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,
};
