import React, { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { iPageContext } from "@interfaces/pageContext";
import { checkIfUserLoggedIn, getUserInfo } from "@redux/stateUtils/user";
import { redirectToFrontendPath } from "@utils/router";
import { NextApiRequest, NextApiResponse } from "next";
import { _getLiveLogs, createAndRunDraftTest, createTestFromDraft, getDraftTest, getTest } from "@services/test";
import { css } from "@emotion/core";
import { EDITOR_TEST_TYPE } from "@crusher-shared/types/editorTestType";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import { markTestAborted, recordLiveLogs, saveTestMetaInfo } from "@redux/actions/tests";
import { iTestMetaInfo } from "@interfaces/testMetaInfo";
import { useSelector } from "react-redux";
import { checkIsTestAborted, getTestLiveLogs, getTestMetaInfo } from "@redux/stateUtils/tests";
import { TestStatus } from "@ui/containers/editor/TestStatus";
import { CodeGenerator } from "@code-generator/src/generator";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { iDraft } from "@crusher-shared/types/db/draft";
import { store } from "@redux/store";
import { DRAFT_LOGS_STATUS, iDraftLogsResponse } from "@crusher-shared/types/response/draftLogsResponse";
import { InstanceStatus } from "@crusher-shared/types/instanceStatus";
import { BROWSER } from "@crusher-shared/types/browser";
import { AuthModal } from "@ui/containers/modals/authModal";
import Cookies from "js-cookie";
import { Store } from "redux";
import { getShortDate, submitPostDataWithForm } from "@utils/helpers";
import { Toast } from "@utils/toast";
import { getRelativeSize } from "@utils/styleUtils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require("urlencoded-body-parser");

function checkDraftStatusAgainAndAgain(draftId: number, logsAfter = 0) {
	return _getLiveLogs(draftId, logsAfter).then((res: iDraftLogsResponse) => {
		const { status, logs, test } = res;
		console.log("Test status", test);
		if (test.status === InstanceStatus.ABORTED) {
			store.dispatch(markTestAborted());
		}

		if (test && status === DRAFT_LOGS_STATUS.UPDATE_LOGS) {
			if (test.status === InstanceStatus.ABORTED || test.status === InstanceStatus.TIMEOUT || test.status === InstanceStatus.FINISHED) {
				return store.dispatch(recordLiveLogs(logs!));
			} else {
				const lastCreatedAt =
					logs && logs.length
						? logs.reduce((prev: any, current: any) => {
								const createdDate = new Date(current.createdAt);
								return createdDate > prev ? createdDate : prev;
						  }, new Date(0))
						: logsAfter;
				store.dispatch(recordLiveLogs(logs!));
				return checkDraftStatusAgainAndAgain(draftId, lastCreatedAt);
			}
		} else {
			const lastCreatedAt =
				logs && logs.length
					? logs.reduce((prev: any, current: any) => {
							const createdDate = new Date(current.createdAt);
							return createdDate > prev ? createdDate : prev;
					  }, new Date(0))
					: logsAfter;

			return checkDraftStatusAgainAndAgain(draftId, lastCreatedAt);
		}
	});
}

interface iTestEditorProps {
	isLoggedIn: boolean;
	metaInfo: iTestMetaInfo;
}

const TestEditor = (props: iTestEditorProps) => {
	const { metaInfo } = props;
	const [testName, setTestName] = useState("");

	const userInfo = useSelector(getUserInfo);
	const testInfo = useSelector(getTestMetaInfo);
	const liveLogs = useSelector(getTestLiveLogs);
	const selectedProjectId = useSelector(getSelectedProject);
	const isTestAborted = useSelector(checkIsTestAborted);
	const authCheckerInterval = useRef(null as any);

	const handleTestNameUpdate = (event: ChangeEvent<HTMLInputElement>) => {
		setTestName(event.target.value);
	};

	const handleRunTest = useCallback(
		function () {
			if (!testInfo.id) {
				const code = new CodeGenerator({
					shouldRecordVideo: true,
					isLiveLogsOn: true,
					browser: BROWSER.CHROME,
					isHeadless: false,
				}).parse(testInfo.actions);

				createAndRunDraftTest(testName, code, testInfo.actions, selectedProjectId)
					.then(async (res: iDraft) => {
						if (res) {
							store.dispatch(
								saveTestMetaInfo({
									...metaInfo,
									id: res.id,
									testType: EDITOR_TEST_TYPE.SAVED_DRAFT,
								}),
							);
							await createTestFromDraft(res.id, {
								testName: getShortDate(new Date()),
							});
							redirectToFrontendPath("/app/project/tests");
						}
					})
					.catch((err: any) => {
						Toast.showError("Some error occurred when running test");
						console.error(err);
					});
			}
		},
		[testInfo.actions],
	);

	useMemo(() => {
		if (testInfo.testType === EDITOR_TEST_TYPE.SAVED_DRAFT && testInfo.id) {
			checkDraftStatusAgainAndAgain(testInfo.id).then((res: any) => {
				console.log(res);
			});
		}
	}, [testInfo.testType, testInfo.id]);

	useMemo(() => {
		handleRunTest();
	}, [testInfo.actions]);

	const handleSaveTest = async () => {
		if (!!testName === false || testName.trim() === "") {
			alert("Give a name to the test");
			return false;
		}
		if (testInfo.testType === EDITOR_TEST_TYPE.SAVED_DRAFT && testInfo.id) {
			await createTestFromDraft(testInfo.id, { testName: testName });
			redirectToFrontendPath("/app/project/tests");
		} else {
			return false;
		}
	};

	useMemo(() => {
		if (!userInfo) {
			authCheckerInterval.current = setInterval(() => {
				if (Cookies.get("isLoggedIn") === "true") {
					clearInterval(authCheckerInterval.current);
					submitPostDataWithForm(window.location.href, metaInfo.postData ? metaInfo.postData : {});
					authCheckerInterval.current = null;
				}
			}, 100);
		}
	}, [userInfo]);

	return (
		<div css={containerCSS}>
			<AuthModal isOpen={!!userInfo === false} />
			<div css={centeredContainerCSS}>
				<img src={"/svg/loadingElipsis.svg"} css={loadingCSS} />
				<span css={loadingTextCSS}>Loading...</span>

				{/*<div>*/}
				{/*	<div css={placeholderHeaderTitleCSS}>*/}
				{/*		<Conditional If={metaInfo.totalTime}>*/}
				{/*			<span>*/}
				{/*				You just created a test in {Math.floor(metaInfo.totalTime! / 1000)}{" "}*/}
				{/*				seconds👏*/}
				{/*			</span>*/}
				{/*		</Conditional>*/}
				{/*		<Conditional If={!metaInfo.totalTime}>*/}
				{/*			<span>Welcome back👏</span>*/}
				{/*		</Conditional>*/}
				{/*	</div>*/}
				{/*	<div css={placeholderHeaderDescCss}>*/}
				{/*		<div>Crusher will check UI/Flow for bugs.</div>*/}
				{/*		<div>Ship faster by running all tests in few mins.</div>*/}
				{/*	</div>*/}
				{/*</div>*/}
				{/*<div css={addTestContainerCSS}>*/}
				{/*	<div css={addTestInputWithActionContainerCSS}>*/}
				{/*		<div css={addTestInputContainerCSS}>*/}
				{/*			<input*/}
				{/*				css={addTestInputCSS}*/}
				{/*				name="testName"*/}
				{/*				placeholder="Name of your test"*/}
				{/*				value={testName}*/}
				{/*				onChange={handleTestNameUpdate}*/}
				{/*			/>*/}
				{/*		</div>*/}
				{/*		<div*/}
				{/*			css={addTestButtonCSS}*/}
				{/*			style={{*/}
				{/*				color: "#eaeaee",*/}
				{/*				backgroundColor: "#5b76f7",*/}
				{/*			}}*/}
				{/*			onClick={handleSaveTest}*/}
				{/*		>*/}
				{/*			<span>Save test</span>*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*</div>*/}
				{/*<TestStatus*/}
				{/*	isAborted={isTestAborted}*/}
				{/*	actions={testInfo.actions}*/}
				{/*	logs={liveLogs}*/}
				{/*/>*/}
			</div>
		</div>
	);
};

const loadingCSS = css`
	height: ${getRelativeSize(80)}rem;
`;
const loadingTextCSS = css`
	position: relative;
	top: -1rem;
	font-weight: 500;
`;
const containerCSS = css`
	display: flex;
	height: 100%;
	padding-left: 4.25rem;
	padding-right: 4rem;
	justify-content: center;
	align-items: center;
`;

const centeredContainerCSS = css`
	width: 36rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
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

const parseTestMetaInfo = async (
	req: NextApiRequest,
	res: NextApiResponse,
	testType: EDITOR_TEST_TYPE,
	id: number,
	cookies: any = null,
	headers: any = null,
	store: Store,
): Promise<iTestMetaInfo | null> => {
	const postDataFromReq = await parse(req);
	const isComingFromCrusherExtension = postDataFromReq && postDataFromReq.events;
	const encodedSavedPostTestData = cookies!.testPostData;
	const savedPostTestData = encodedSavedPostTestData ? JSON.parse(decodeURIComponent(encodedSavedPostTestData)) : null;

	const postData = isComingFromCrusherExtension ? postDataFromReq : savedPostTestData;

	switch (testType) {
		case EDITOR_TEST_TYPE.UNSAVED: {
			if (!postData.events && !postData.totalTime) {
				throw new Error("No recorded actions passed to run test for");
			}

			return {
				actions: JSON.parse(unescape(postData.events)),
				testType: testType,
				id: id,
				totalTime: postData.totalTime,
				postData: postData,
			};
		}
		case EDITOR_TEST_TYPE.SAVED_TEST: {
			const testInfo = await getTest(id, headers);

			return {
				actions: JSON.parse(testInfo.events),
				testType: testType,
				id: id,
				postData: postData,
			};
		}
		case EDITOR_TEST_TYPE.SAVED_DRAFT: {
			const testInfo = await getDraftTest(id, headers);

			return {
				actions: JSON.parse(testInfo.events),
				testType: testType,
				id: id,
				postData: postData,
			};
		}
	}
	return null;
};

TestEditor.getInitialProps = async (ctx: iPageContext) => {
	const { req, query, metaInfo, res, store } = ctx;

	const { slug } = query;
	if (!slug) {
		return redirectToFrontendPath("/404", res);
	}

	const type = slug[0] as EDITOR_TEST_TYPE;

	// const { cookies, headers } = ctx.metaInfo;
	const isLoggedIn = checkIfUserLoggedIn(store.getState());
	if (!Object.values(EDITOR_TEST_TYPE).includes(type)) {
		return redirectToFrontendPath("/404", res);
	}
	const id = parseInt(slug[1]);

	try {
		const testMetaInfo = await parseTestMetaInfo(req!, res!, type, id, metaInfo.cookies, metaInfo.headers, store);

		if (testMetaInfo) {
			store.dispatch(saveTestMetaInfo(testMetaInfo));
		}

		return {
			isLoggedIn: isLoggedIn,
			metaInfo: testMetaInfo,
		};
	} catch (err) {
		throw err;
		return redirectToFrontendPath("/404", res);
	}
};

export default withSidebarLayout(TestEditor);
