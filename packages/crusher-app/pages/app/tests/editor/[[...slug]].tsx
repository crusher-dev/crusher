import { withSidebarLayout } from "@hoc/withSidebarLayout";
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { fetchTestsCountInProject } from "@services/projects";
import { TestInstanceStatus } from "@interfaces/TestInstanceStatus";
import { TestStatus } from "@ui/containers/editor/TestStatus";
import CodeGenerator from "@code-generator/src/index";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require("urlencoded-body-parser");

import withSession from "@hoc/withSession";
import { USER_NOT_REGISTERED } from "@utils/constants";

function checkDraftStatusAgainAndAgain(
	id: string,
	updateLogsCallback: any,
	logsAfter = 0,
) {
	return checkDraftStatus(id, logsAfter).then((res: any) => {
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
						? logs.reduce((prev: any, current: any) => {
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
					? logs.reduce((prev: any, current: any) => {
							const createdDate = new Date(current.createdAt);
							return createdDate > prev ? createdDate : prev;
					  }, new Date(0))
					: logsAfter;
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

function Test(props: any) {
	const { testId, events, isFirstTest, totalTime } = props;
	let { testInfo } = props;
	testInfo = testInfo ? testInfo : {};
	const [actions] = useState(
		testInfo.events ? JSON.parse(testInfo.events) : JSON.parse(events),
	);
	const [draftInfo, setDraftInfo]: [any, any] = useState(null);
	const [, setTestState] = useState(TestState.CREATED);
	const [testResults, setTestResults]: [any, any] = useState(null);
	const [testName, setTestName] = useState(testInfo ? testInfo.name : "");
	const [, setIsRunningTest] = useState(false);
	const [, setIsTestBaseCreated] = useState(false);

	const selectedProjectId = useSelector(getSelectedProject);
	const draftRef: any = useRef(null);

	let tR: any = null;
	draftRef.current = draftInfo;

	const receiveLogsCallback = useCallback(
		function (
			_status,
			testStatus,
			logs,
			images,
			draftId,
			isTestFinished,
			testInstanceRecording,
		) {
			if (draftId === draftInfo.id) {
				setTestResults({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
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
			return { currentDraftId: draftRef.current.id };
		},
		[draftInfo],
	);

	useEffect(() => {
		if (draftInfo && draftInfo.id) {
			const { id } = draftInfo;
			setTestState(TestState.RUNNING);

			checkDraftStatusAgainAndAgain(id, receiveLogsCallback).then((res: any) => {
				if (res) {
					setIsTestBaseCreated(true);
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
			const code = new CodeGenerator({}).generate(actions);

			createAndRunDraftTest(
				testInfo.name ? testInfo.name : "",
				code,
				actions,
				selectedProjectId,
			)
				.then((res: any) => {
					setDraftInfo(res);
					setIsRunningTest(true);
					setTestResults(null);
				})
				.catch((err: any) => {
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
			return createTestFromDraft(draftInfo.id, { testName: testName })
				.then((res: any) => {
					if (!res) {
						throw new Error("Empty response");
					}
					if (isFirstTest) {
						redirectToFrontendPath("/app/project/onboarding/integrationIntroduction");
					} else {
						redirectToFrontendPath("/app/project/tests");
					}
				})
				.catch((err: any) => {
					console.error(err);
				});
		} else {
			return false;
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

	return (
		<div css={containerCSS}>
			<div css={centeredContainerCSS}>
				<div>
					<div css={placeholderHeaderTitleCSS}>
						You just created a test in {Math.floor(totalTime / 1000)} seconds👏
					</div>
					<div css={placeholderHeaderDescCss}>
						<div>Crusher will check UI/Flow for bugs.</div>
						<div>Ship faster by running all tests in few mins.</div>
					</div>
				</div>
				<div css={addTestContainerCSS}>
					<div css={addTestInputWithActionContainerCSS}>
						<div css={addTestInputContainerCSS}>
							<input
								css={addTestInputCSS}
								name="testName"
								placeholder="Name of your test"
								value={testName}
								onChange={handleTestNameUpdate}
							/>
						</div>
						<div
							css={addTestButtonCSS}
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
				<TestStatus actions={actions} logs={testResults ? testResults.logs : []} />
				{/*<ModifyTestSettingsModal/>*/}
			</div>
		</div>
	);
}

const containerCSS = css`
	display: flex;
	padding-top: 4.25rem;
	height: 100%;
	padding-left: 4.25rem;
	padding-right: 4rem;
	justify-content: center;
`;

const centeredContainerCSS = css`
	padding-top: 2.75rem;
	width: 36rem;
`;

const placeholderHeaderTitleCSS = css`
	font-family: DM Sans;
	font-style: normal;
	font-weight: bold;
	font-size: 1.4rem;
`;

const placeholderHeaderDescCss = css`
	font-family: DM Sans;
	margin-top: 0.6rem;
	font-size: 0.9rem;
	line-height: 1.4rem;
`;

const addTestContainerCSS = css`
	margin-top: 1.625rem;
	color: #2d3958;
`;

const addTestInputWithActionContainerCSS = css`
	display: flex;
	flex-direction: row;
	margin-top: 2.4rem;
`;

const addTestInputContainerCSS = css`
	flex: 1;
`;

const addTestInputCSS = css`
	background: #fff;
	border-radius: 0.25rem;
	border: 1.5px solid #e2e2e2;
	font-size: 0.85rem;
	color: #2d3958;
	padding: 0.5rem 1.1rem;
	width: 100%;
`;

const addTestButtonCSS = css`
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
`;

Test.getInitialProps = async (ctx: any) => {
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

		const testsCount = await fetchTestsCountInProject(
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
			totalTime: totalTime,
		};
	} catch (er) {
		await redirectToFrontendPath("/", res);
		return null;
	}
};

export default withSession(withSidebarLayout(Test), USER_NOT_REGISTERED);
