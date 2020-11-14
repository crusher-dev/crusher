import { WithSidebarLayout } from "@hoc/withSidebarLayout";
import { css } from "@emotion/core";
import { cleanHeaders } from "@utils/backendRequest";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import {
	checkDraftStatus,
	createAndRunDraftTest,
	createTestFromDraft,
	getTest,
} from "@services/test";
import parse from "urlencoded-body-parser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CodeGenerator from "../../../../../code-generator/dist/code-generator/src/index";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { getTestsCountInProject } from "@services/projects";
import { TestInstanceStatus } from "@interfaces/TestInstanceStatus";
import { LogActionCard } from "@ui/components/testActionCard";
import {TestStatus} from "@ui/containers/editor/TestStatus";

function checkDraftStatusAgainAndAgain(id, updateLogsCallback, logsAfter = 0) {
	return checkDraftStatus(id, logsAfter).then((res) => {
		const { status, logs, test } = res;

		if (test && test.result && status === "FETCHED_LOGS") {
			const { images } = test.result;

			if (
				test.status === TestInstanceStatus.ABORTED ||
				test.status === TestInstanceStatus.TIMEOUT
			) {
				updateLogsCallback(status, status, logs, images, id, true, test.videos);
			} else if (test.status === TestInstanceStatus.FINISHED) {
				updateLogsCallback(
					status,
					status,
					logs,
					images ? images : "[]",
					id,
					true,
					test.videos,
				);
			} else {
				const lastCreatedAt =
					logs && logs.length
						? logs.reduce((prev, current) => {
								const createdDate = new Date(current.createdAt);
								return createdDate > prev ? createdDate : prev;
						  }, new Date(0))
						: logsAfter;
				const { currentDraftId } = updateLogsCallback(
					status,
					status,
					logs,
					images ? images : "[]",
					id,
					false,
					test.videos,
				);
				if (currentDraftId === id) {
					return checkDraftStatusAgainAndAgain(
						id,
						updateLogsCallback,
						lastCreatedAt,
					);
				}
			}
		} else {
			const lastCreatedAt =
				logs && logs.length
					? logs.reduce((prev, current) => {
							const createdDate = new Date(current.createdAt);
							return createdDate > prev ? createdDate : prev;
					  }, new Date(0))
					: logsAfter;
			// console.log(test, res);
			const { currentDraftId } = updateLogsCallback(
				status,
				null,
				logs,
				test && test.result ? test.result.images : "[]",
				id,
				false,
				test.videos,
			);
			if (currentDraftId === id) {
				return checkDraftStatusAgainAndAgain(id, updateLogsCallback, lastCreatedAt);
			}
		}
	});
}

const TestState = {
	CREATED: "CREATED",
	RUNNING: "RUNNING",
	COMPLETED: "COMPLETED",
};

function Test(props) {
	let { testId, events, testInfo, isFirstTest, totalTime } = props;
	testInfo = testInfo ? testInfo : {};
	const [actions, setActions] = useState(
		testInfo.events ? JSON.parse(testInfo.events) : JSON.parse(events),
	);
	const [draftInfo, setDraftInfo] = useState(null);
	const [testState, setTestState] = useState(TestState.CREATED);
	const [testResults, setTestResults] = useState(null);
	const [testName, setTestName] = useState(testInfo ? testInfo.name : "");
	const [isRunningTest, setIsRunningTest] = useState(false);
	const [isTestBaseCreated, setIsTestBaseCreated] = useState(false);

	const selectedProjectId = useSelector(getSelectedProject);
	const draftRef = useRef(null);

	let tR = null;
	draftRef.current = draftInfo;

	const receiveLogsCallback = useCallback(
		function (
			status,
			testStatus,
			logs,
			images,
			draftId,
			isTestFinished,
			testInstanceRecording,
		) {
			if (draftId === draftInfo.id) {
				setTestResults({
					logs: [...(tR ? tR.logs : []), ...(logs ? logs : [])],
					images: [...(tR ? tR.images : []), ...(images ? JSON.parse(images) : [])],
					testInstanceRecording,
				});

				if (isTestFinished) {
					setIsRunningTest(false);
				}

				tR = {
					logs: [...(tR ? tR.logs : []), ...(logs ? logs : [])],
					images: [...(tR ? tR.images : []), ...(images ? JSON.parse(images) : [])],
					testInstanceRecording,
				};
				if (testStatus === TestInstanceStatus.FINISHED) {
					setTestState(TestState.COMPLETED);
				}
			}
			// console.log(draftRef.current);
			return { currentDraftId: draftRef.current.id };
		},
		[draftInfo],
	);

	useEffect(() => {
		if (draftInfo && draftInfo.id) {
			const { id } = draftInfo;
			setTestState(TestState.RUNNING);

			checkDraftStatusAgainAndAgain(id, receiveLogsCallback).then((res) => {
				if (res) {
					setIsTestBaseCreated(true);
				} else {
					// console.log("Got nothing");
				}
			});
		}
	}, [draftInfo]);

	useEffect(() => {
		handleRunTest();
	}, [actions]);

	const handleTestNameUpdate = useCallback(
		function (event) {
			setTestName(event.target.value);
		},
		[testName],
	);

	const handleRunTest = useCallback(
		function () {
			const codeGenerator = new CodeGenerator({}, "PLAYWRIGHT");

			const code = codeGenerator.generate(actions, true);

			createAndRunDraftTest(
				testInfo.name ? testInfo.name : "",
				code,
				actions,
				selectedProjectId,
			)
				.then((res) => {
					const { id } = res;
					setDraftInfo(res);
					setIsRunningTest(true);
					setTestResults(null);
				})
				.catch((err) => {
					alert("FAILED");
					console.error(err);
				});
		},
		[draftInfo, actions],
	);

	const handleSaveTest = useCallback(() => {
		if (!!testName === false || testName.trim() === "") {
			alert("Give a name to the test");
			return false;
		}
		if (draftInfo) {
			createTestFromDraft(draftInfo.id, { testName: testName })
				.then((res) => {
					if (!res) {
						throw new Error("Empty response");
					}
					const { insertId } = res;
					if (isFirstTest) {
						redirectToFrontendPath("/app/project/onboarding/integrationIntroduction");
					} else {
						redirectToFrontendPath("/app/project/tests");
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [draftInfo, testName]);

	// const deleteAction = useCallback(
	// 	function (index) {
	// 		setActions(
	// 			actions.filter((val, _index) => {
	// 				return _index !== index;
	// 			}),
	// 		);
	// 	},
	// 	[actions],
	// );

	if (testResults && testResults.testInstanceRecording) {
		alert(`Recorded tests, ${testResults.testInstanceRecording}`);
	}

	// console.log(testResults);

	return (
		<div css={styles.container}>
			<div css={styles.centeredContainer}>
				<div css={styles.placeholderHeaderContainer}>
					<div css={styles.placeholderHeaderTitle}>
						You just created a test in {Math.floor(totalTime/1000)} seconds👏
					</div>
					<div css={styles.placeholderHeaderDesc}>
						<div>Crusher will check UI/Flow for bugs.</div>
						<div>Ship faster by running all tests in few mins.</div>
					</div>
				</div>
				<div css={styles.addTestContainer}>
					<div css={styles.addTestInputWithActionContainer}>
						<div css={styles.addTestInputContainer}>
							<input
								css={styles.addTestInput}
								name="testName"
								placeholder="Name of your test"
								value={testName}
								onChange={handleTestNameUpdate}
							/>
						</div>
						<div
							css={styles.addTestButton}
							style={{
								color: "#eaeaee",
								backgroundColor: "#5b76f7",
							}}
							onClick={handleSaveTest}
						>
							<span>Save test</span>
						</div>
					</div>
				</div>
				<TestStatus actions={actions} logs={testResults ? testResults.logs : []}/>
			</div>
		</div>
	);
}

const styles = {
	container: css`
		display: flex;
		padding-top: 4.25rem;
		height: 100%;
		padding-left: 4.25rem;
		padding-right: 4rem;
		justify-content: center;
	`,
	centeredContainer: css`
		padding-top: 2.75rem;
		width: 36rem;
	`,
	placeholderHeaderContainer: css``,
	placeholderHeaderTitle: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.4rem;
	`,
	placeholderHeaderDesc: css`
		font-family: DM Sans;
		margin-top: 0.6rem;
		font-size: 0.9rem;
		line-height: 1.4rem;
	`,
	leftSide: css`
		width: 54rem;
	`,
	rightSide: css`
		margin-left: auto;
		display: flex;
		padding-left: 4rem;
		flex-direction: column;
	`,
	screenshotsContainer: css`
		margin-top: 2.25rem;
		width: 26rem;
	`,
	screenshotsHeading: css`
		font-weight: 700;
		font-size: 1.1rem;
		color: #2d3958;
	`,
	screenshotsGrid: css`
		margin-top: 1.25rem;
		display: flex;
		flex-wrap: wrap;
	`,
	screenshotItem: css`
		background: rgba(0, 0, 0, 0.05);
		border-radius: 0.2rem;
		width: 7.1rem;
		height: 4.25rem;
		margin-bottom: 1.5rem;
		margin-right: 1.5rem;
		background-repeat: no-repeat;
		background-size: contain;
	`,
	addTestContainer: css`
		margin-top: 1.625rem;
		color: #2d3958;
	`,
	addTestInputLabel: css`
		font-family: DM Sans;
		font-size: 0.8rem;
		font-weight: 500;
	`,
	addTestInputWithActionContainer: css`
		display: flex;
		flex-direction: row;
		margin-top: 2.4rem;
	`,
	addTestInputContainer: css`
		flex: 1;
	`,
	addTestInput: css`
		background: #fff;
		border-radius: 0.25rem;
		border: 1.5px solid #e2e2e2;
		font-size: 0.85rem;
		color: #2d3958;
		padding: 0.5rem 1.1rem;
		width: 100%;
	`,
	addTestButton: css`
		background: #5b76f7;
		border-radius: 5px;
		width: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.9rem;
		padding: 0.5rem 2.75rem;
		margin-left: 0.8rem;
		color: #eaeaee;
		font-weight: 500;
		cursor: pointer;
	`,
	verifyingTestContainer: css`
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 7rem;
		span {
			margin-left: 1rem;
			font-family: DM Sans;
			font-size: 0.9rem;
			color: #2d3958;
			font-style: normal;
			font-weight: 500;
		}
	`,
	liveStepsContainer: css`
		margin-top: 2.1rem;
	`,
	runTestContainer: css`
		margin-top: 1.75rem;
		color: #2d3958;
		width: 26rem;
	`,
	runTestHeading: css`
		font-weight: 700;
		font-size: 1.125rem;
	`,
	saveTestButton: css`
		background: #5b76f7;
		border-radius: 5px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.7rem 0.5rem;
		color: #eaeaee;
		font-size: 0.925rem;
		font-weight: 700;
		margin-top: 1.5rem;
		cursor: pointer;
		span {
			margin-left: 1rem;
		}
	`,
	previewTestButton: css`
		background: #5b76f7;
		border-radius: 5px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.7rem 0.5rem;
		color: #eaeaee;
		font-size: 0.925rem;
		font-weight: 700;
		margin-top: 1.5rem;
		cursor: pointer;
		margin-right: 1.4rem;
		span {
			margin-left: 1rem;
		}
	`,
	testButtonContainer: css`
		display: flex;
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
	logsOverlayContent: css`
		background: #fff;
		padding: 3.575rem 10.125rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 0.8rem;
	`,
	waitingTitle: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.35rem;
	`,
	waitingDesc: css`
		margin-top: 0.6rem;
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 0.9rem;
	`,
};

Test.getInitialProps = async (ctx) => {
	const { res, req, store, query } = ctx;
	try {
		let headers, postData;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
			postData = await parse(req);
		}

		const cookies = getCookies(req);
		const defaultProject = getSelectedProject(store.getState());
		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);

		const testsCount = await getTestsCountInProject(
			selectedProject ? selectedProject : defaultProject,
			headers,
		);

		const isLoggedIn = !!cookies.isLoggedIn || !!cookies.token;
		const { slug } = query;
		const testId = slug && slug[0];

		let events, framework, testInfo;
		events = postData ? postData.events : null;
		framework = postData ? postData.framework : null;
		const totalTime = postData ? postData.totalTime : null;

		if (testId) {
			testInfo = await getTest(testId, headers);
			events = testInfo.events;
			framework = testInfo.framework;
		}
		return {
			isLoggedIn: isLoggedIn,
			events: events ? unescape(events) : "[]",
			testInfo: testInfo,
			testId: testId ? testId : null,
			isFirstTest: testsCount && testsCount.totalTests === 0,
			totalTime: totalTime
		};
	} catch (er) {
		throw er;
		await redirectToFrontendPath("/", res);
		return null;
	}
};

export default WithSidebarLayout(Test);
