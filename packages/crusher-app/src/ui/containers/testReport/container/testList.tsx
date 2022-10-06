import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React from "react";

import { useAtom } from "jotai";

import { useBuildReport } from "@store/serverState/buildReports";
import { CheckSVG } from "@svg/builds";
import { TestOverview } from "@ui/containers/testReport/container/testOverview";

import { selectedTestAtom } from "../atoms";

const getStatusFromTestInstances = (testInstances) => {
	const failed = testInstances.find((a) => a.status === "FAILED");
	if (failed) return "FAILED";
	return "PASSED";
};

const stepSectionCSS = css`
	border-right-style: solid;
	border-right-width: 1rem;
	border-right-color: rgba(196, 196, 196, 0.08);
	padding-left: 132rem;
	padding-right: 20rem;
`;

const testLeftSideCard = (selected) => css`
	width: 238rem;
	height: 32rem;
	border-radius: 10px;
	margin-bottom: 10px;
	border: 0.5px solid transparent;
	padding: 0 28rem;

	:hover {
		background: #101010;
		border: 0.5px solid rgba(255, 255, 255, 0.05);
	}

	${selected &&
	`
background: #101010;
border: 0.5px solid rgba(255, 255, 255, 0.05);

`}

	#name {
		white-space: nowrap;
		overflow: hidden;

		font-size: 14rem;

		${selected &&
		`
		font-weight: 600;
		`}
	}
`;

const reportSectionCSS = css`
	width: 100%;
	background: #090909;
	min-height: 100vh;
	display: flex;
	border-top-color: rgba(255, 255, 255, 0.04);
	border-top-width: 0.5rem;
	border-top-style: solid;
`;

function TestList(props: any) {
	const { data, selectedTest, setSelectedTest } = props;
	return (
		<div css={stepSectionCSS}>
			<div className="pl-28 pt-32" css={testListHeadingStyle}>
				tests | 12
			</div>
			<ul css={testListStyle}>
				{data?.tests.map((testData, i) => (
					<li className="px24 py-12" css={testLeftSideCard(i === selectedTest)} onClick={setSelectedTest.bind(this, i)}>
						<CheckSVG type={getStatusFromTestInstances(testData?.testInstances)} height={"14rem"} width={"14rem"} />
						<span id="name">{testData!.name}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

function ReportSection() {
	const [selectedTest, setSelectedTest] = useAtom(selectedTestAtom);
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	return (
		<div className={"mt-20"} css={reportSectionCSS}>
			<TestList data={data} selectedTest={selectedTest} setSelectedTest={setSelectedTest} />

			<div className={"py-4 flex-1"}>{data?.tests.length && <TestOverview />}</div>
		</div>
	);
}

const testListStyle = css`
	margin-top: 40rem;

	li {
		display: flex;
		align-items: center;
		gap: 8rem;
		:hover {
			opacity: 0.8;
		}
	}
`;
const testListHeadingStyle = css`
	font-family: "Cera Pro";
	font-style: normal;
	font-weight: 600;
	font-size: 15rem;
	color: rgba(255, 255, 255, 0.79);
	letter-spacing: 0.1px;
`;

export default ReportSection;
