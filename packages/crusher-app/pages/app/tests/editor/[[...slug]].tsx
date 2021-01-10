import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { iPageContext } from "@interfaces/pageContenxt";
import { checkIfUserLoggedIn } from "@redux/stateUtils/user";
import { redirectToFrontendPath } from "@utils/router";
import { NextApiRequest } from "next";
import {
	_getLiveLogs,
	createAndRunDraftTest,
	createTestFromDraft,
	getDraftTest,
	getTest,
} from "@services/test";
import { css } from "@emotion/core";
import { Conditional } from "@ui/components/common/Conditional";
import { EDITOR_TEST_TYPE } from "@crusher-shared/types/editorTestType";
import { withSidebarLayout } from "@hoc/withSidebarLayout";
import { recordLiveLogs, saveTestMetaInfo } from "@redux/actions/tests";
import { iTestMetaInfo } from "@interfaces/testMetaInfo";
import { useSelector } from "react-redux";
import { getTestLiveLogs, getTestMetaInfo } from "@redux/stateUtils/tests";
import { TestStatus } from "@ui/containers/editor/TestStatus";
import CodeGenerator from "@code-generator/src";
import { getSelectedProject } from "@redux/stateUtils/projects";
import { iDraft } from "@crusher-shared/types/db/draft";
import { store } from "@redux/store";
import {
	DRAFT_LOGS_STATUS,
	iDraftLogsResponse,
} from "@crusher-shared/types/response/draftLogsResponse";
import { InstanceStatus } from "@crusher-shared/types/instanceStatus";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require("urlencoded-body-parser");

function checkDraftStatusAgainAndAgain(draftId: number, logsAfter = 0) {
	return _getLiveLogs(draftId, logsAfter).then((res: iDraftLogsResponse) => {
		const { status, logs, test } = res;

		if (test && status === DRAFT_LOGS_STATUS.UPDATE_LOGS) {
			if (
				test.status === InstanceStatus.ABORTED ||
				test.status === InstanceStatus.TIMEOUT ||
				test.status === InstanceStatus.FINISHED
			) {
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

	const testInfo = useSelector(getTestMetaInfo);
	const liveLogs = useSelector(getTestLiveLogs);
	const selectedProjectId = useSelector(getSelectedProject);

	const handleTestNameUpdate = (event: ChangeEvent<HTMLInputElement>) => {
		setTestName(event.target.value);
	};

	const handleRunTest = useCallback(
		function () {
			if (!testInfo.id) {
				const code = new CodeGenerator().generate(testInfo.actions);

				createAndRunDraftTest(testName, code, testInfo.actions, selectedProjectId)
					.then((res: iDraft) => {
						if (res) {
							store.dispatch(
								saveTestMetaInfo({
									...metaInfo,
									id: res.id,
									testType: EDITOR_TEST_TYPE.SAVED_DRAFT,
								}),
							);
						}
					})
					.catch((err: any) => {
						alert("FAILED");
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

	const handleSaveTest = () => {
		if (!!testName === false || testName.trim() === "") {
			alert("Give a name to the test");
			return false;
		}
		if (testInfo.testType === EDITOR_TEST_TYPE.SAVED_DRAFT && testInfo.id) {
			return createTestFromDraft(testInfo.id, { testName: testName })
				.then((res: any) => {
					if (!res) {
						throw new Error("Empty response");
					}
					redirectToFrontendPath("/app/project/tests");
				})
				.catch((err: any) => {
					console.error(err);
				});
		} else {
			return false;
		}
	};

	return (
		<div css={containerCSS}>
			<div css={centeredContainerCSS}>
				<div>
					<div css={placeholderHeaderTitleCSS}>
						<Conditional If={metaInfo.totalTime}>
							<span>
								You just created a test in {Math.floor(metaInfo.totalTime! / 1000)}{" "}
								seconds👏
							</span>
						</Conditional>
						<Conditional If={!metaInfo.totalTime}>
							<span>Welcome back👏</span>
						</Conditional>
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
				<TestStatus actions={testInfo.actions} logs={liveLogs} />
			</div>
		</div>
	);
};

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

const parseTestMetaInfo = async (
	req: NextApiRequest,
	testType: EDITOR_TEST_TYPE,
	id: number,
	headers: any = null,
): Promise<iTestMetaInfo | null> => {
	switch (testType) {
		case EDITOR_TEST_TYPE.UNSAVED: {
			const postData = await parse(req);
			if (!postData.events && !postData.totalTime) {
				throw new Error("No recorded actions passed to run test for");
			}

			return {
				actions: JSON.parse(unescape(postData.events)),
				testType: testType,
				id: id,
				totalTime: postData.totalTime,
			};
		}
		case EDITOR_TEST_TYPE.SAVED_TEST: {
			const testInfo = await getTest(id, headers);

			return {
				actions: JSON.parse(testInfo.events),
				testType: testType,
				id: id,
			};
		}
		case EDITOR_TEST_TYPE.SAVED_DRAFT: {
			const testInfo = await getDraftTest(id, headers);

			return {
				actions: JSON.parse(testInfo.events),
				testType: testType,
				id: id,
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
		const testMetaInfo = await parseTestMetaInfo(
			req!,
			type,
			id,
			metaInfo.headers,
		);

		if (testMetaInfo) {
			store.dispatch(saveTestMetaInfo(testMetaInfo));
		}

		return {
			isLoggedIn: isLoggedIn,
			metaInfo: testMetaInfo,
		};
	} catch (err) {
		return redirectToFrontendPath("/404", res);
	}
};

export default withSidebarLayout(TestEditor);
