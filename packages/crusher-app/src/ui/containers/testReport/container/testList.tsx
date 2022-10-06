import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useBlockLayout, useTable } from "react-table";

import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";

import { Button } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Modal } from "dyson/src/components/molecules/Modal";

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { ActionStatusEnum } from "@crusher-shared/lib/runnerLog/interface";
import { useBuildReport } from "@store/serverState/buildReports";
import { CheckSquare, CheckSVG, FullImageView, ShowSidebySide } from "@svg/builds";
import { LoadingSVG, PlaySVG } from "@svg/dashboard";
import { InfoSVG } from "@svg/testReport";
import {
	getActionLabel,
	getAllConfigurationForGivenTest,
	getBaseConfig,
	getFailedConfigurationForTest,
	getStepsFromInstanceData,
	getTestIndexByConfig,
} from "@utils/core/buildReportUtils";
import { getAssetPath, getCollapsedTestSteps } from "@utils/helpers";

import { selectedTestAtom, testCardConfigAtom } from "../atoms";
import { useBasicTestData } from "../hooks";
import { TestLogs } from "@ui/containers/testReport/components/steps/testLogs";
import { PlayVideo, TestVideoUrl } from "@ui/containers/testReport/container/playVideo";

const CompareImage = dynamic(() => import("../components/compareImages"));

enum TestTabEnum {
	OVERVIEW = "overview",
	LOGS = "logs",
}

/*
	How reports will work
	1.) Filter test instances by config
	2.) Save individual state for each test
			1. Step
			2.) Current state
 */

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
`

const testLeftSideCard = (selected) => css`
width: 238rem;
height: 36rem;
border-radius: 8px;
margin-bottom:10px;
border: 0.5px solid transparent;
padding: 0 28rem;

:hover{
	background: #101010;
	border: 0.5px solid rgba(255, 255, 255, 0.05);

}

${selected && `
background: #101010;
border: 0.5px solid rgba(255, 255, 255, 0.05);

`}

#name{
	white-space: nowrap;
	overflow: hidden;

	font-size: 14rem;

	${selected && `
		font-weight: 600;
		`
	}
}
`

const reportSectionCSS = css`
width: 100%;
background: #090909;
min-height: 100vh;
display: flex;
border-top-color: rgba(255, 255, 255, 0.04);
border-top-width: 0.5rem;
border-top-style: solid;
`

function TestList(props: any) {

	const { data, selectedTest, setSelectedTest } = props
	return <div
		css={stepSectionCSS}
	>
		<div className="pl-28 pt-32" css={testListHeadingStyle}>
			tests | 12
		</div>
		<ul css={testListStyle}>
			{data?.tests.map((testData, i) => (
				<li
					className="px24 py-12"
					css={testLeftSideCard(i === selectedTest)}
					onClick={setSelectedTest.bind(this, i)}
				>
					<CheckSVG
						type={getStatusFromTestInstances(testData?.testInstances)}
						height={"14rem"}
						width={"14rem"}
					/>
					<span
						id="name"
					>
						{testData!.name}
					</span>
				</li>
			))}
		</ul>
	</div>;
}

function ReportSection() {
	const [selectedTest, setSelectedTest] = useAtom(selectedTestAtom);
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	return (
		<div
			className={"mt-20"}
			css={reportSectionCSS}
		>

			<TestList data={data} selectedTest={selectedTest} setSelectedTest={setSelectedTest} />

			<div
				className={"py-4 flex-1"}
			>
				{data?.tests.length ? <TestCard /> : ""}
			</div>
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
const imageViewAtom = atomWithImmer<"side" | "compare">("side");

export const imageTabCSS = css`
	top: -24rem;
	div {
		width: 48px;
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
	}
	div:hover {
		background: #181b1e;
	}
	.selected {
		background: #181b1e;
	}
`;

function RenderImageInfo({ data, index }) {
	const { meta } = data;
	const imageName = meta.outputs?.[index].name;
	const previousImage = getAssetPath(meta.outputs?.[index].targetScreenshotUrl);
	const currentImage = getAssetPath(meta.outputs?.[index].value);

	const [imageViewType, setImageViewType] = useAtom(imageViewAtom);

	if (!imageName) return null;

	return (
		<div className={"  pl-44 mt-4 text-11"} css={imageTestStep}>
			<div className={"flex justify-between text-12 mb-20 "}>
				<span>{imageName}</span>
				<div>
					<div css={imageTabCSS} className={"flex relative"}>
						<div onClick={setImageViewType.bind(this, "side")} className={String(imageViewType === "side" && "selected")}>
							<FullImageView />
						</div>
						<div onClick={setImageViewType.bind(this, "compare")} className={`ml-2 ${imageViewType === "compare" && "selected"}`}>
							<ShowSidebySide />
						</div>
					</div>
				</div>
			</div>
			<Conditional showIf={imageViewType === "side"}>
				<div className={"flex"}>
					<img
						src={currentImage}
						css={css`
							max-width: 49%;
						`}
					/>{" "}
					<img
						src={getAssetPath(meta.outputs[index].diffImageUrl)}
						css={css`
							margin-left: 2%;
							max-width: 49%;
						`}
					/>
				</div>
			</Conditional>
			<Conditional showIf={imageViewType === "compare"}>
				<div>
					<CompareImage leftImage={previousImage} rightImage={currentImage} />
				</div>
			</Conditional>
		</div>
	);
}

const imageTestStep = css``;

function ErrorComponent({ testInstanceData, actionType, actionName, message }) {
	const videoUrl = testInstanceData?.output?.video;
	const isVideoAvailable = !!videoUrl;
	const [openVideoModal, setOpenVideoModal] = useState(false);
	return (
		<div className={"  py-16 px-22 mt-8"} css={errorBox}>
			<Conditional showIf={isVideoAvailable && openVideoModal}>
				<TestVideoUrl videoUrl={videoUrl} setOpenVideoModal={setOpenVideoModal.bind(this)} />
			</Conditional>
			<div className={"font-cera text-14 font-600 leading-none"}>Error at : {actionName || getActionLabel(actionType)}</div>
			<div className={"text-13 mt-8"}>{message}</div>
			<Conditional showIf={isVideoAvailable}>
				<div className={"flex  mt-24"}>
					<div className={"text-13 flex items-center"} id={"play-button"} onClick={setOpenVideoModal.bind(this, true)}>
						<PlaySVG /> <span className={" ml-12 leading-none"}> Play To See Recording</span>
					</div>
				</div>
			</Conditional>
		</div>
	);
}

function RenderAssertElement({ logs }) {
	return (
		<div className="assertTable mt-24" css={assertTableContainerStyle}>
			<table css={assertTableCss}>
				<tr>
					<th style={{ color: "#8A8A8A" }}>Expected:</th>
					<th>Visible:</th>
				</tr>
				<tr>
					<td style={{ padding: "4rem 0rem" }}></td>
				</tr>

				{logs.map((log) => {
					return (
						<tr>
							<td>
								<div style={{ color: "#8A8A8A" }}>
									<pre>{log.meta.field}</pre> should be
								</div>
								<div className="para-line">
									<span className="highlight-old">{log.meta.valueToMatch}</span>
								</div>
							</td>
							<td>
								<div style={{ color: "#8A8A8A" }}>
									<pre>{log.meta.field}</pre> is
								</div>
								<div className="para-line">
									<span className={log.status === "FAILED" ? "highlight-current" : "highlight-old"}>{log.meta.elementValue}</span>
								</div>
							</td>
						</tr>
					);
				})}
				<tr>
					<td style={{ padding: "8px" }}></td>
				</tr>
			</table>
		</div>
	);
}

const assertTableCss = css`
	background: rgba(65, 63, 63, 0.03);
	border-radius: 8rem;
	box-sizing: border-box;
	color: #fff;
	padding: 4px 16px;

	border-spacing: 10px;
	border-collapse: collapse;
	width: 540rem;
	font-family: Cera Pro;
	th,
	td {
		border-right: 1px solid rgba(255, 255, 255, 0.09);
		border-left: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 10px;
		padding: 4px 16px;
		width: 260px;
	}
	tr th:nth-of-type(1),
	tr td:nth-of-type(1) {
		border-left: none !important;
	}
	tr th:nth-of-type(2),
	tr td:nth-of-type(2) {
		border-right: none !important;
	}
	th {
		padding: 14px 16px;
		text-align: left;
	}
	.para-line {
		margin-top: 4px;
	}
	.highlight-current {
		color: #ff59a9;
	}
	.highlight-old {
		color: #afce6d;
	}
	pre {
		display: inline-block;
		margin: 0;
	}
`;

const assertTableContainerStyle = css`
	border: 1px solid rgba(255, 255, 255, 0.09);
	display: inline-block;
	border-radius: 9rem;
`;

const leftSide = (isFirst) => css`
width: 13px;
height: 44rem;
align-items: center;

	margin-right: -6px;

#first{
	${isFirst && `visibility: hidden;`}
}

#mark{

	min-width: 13px;
min-height: 13px;

position: absolute;

${isFirst && `
	background: #1F1F1F;
	border-radius: 12px;
`}

${!isFirst && `
	background: #0B0B0B;
	border: 0.5px solid #1F1F1F;
`}



left: 50%;
top: 50%;
transform: translate(-50%, -50%);
}

#second{
	height: 50%;
}

#first,#second{
	background: #1C1C1C;
	height: 27px;
	width: 1px;
}
`

const stepBottom = css`
border-bottom: .5px solid rgba(217, 217, 217, 0.08);
`
function RenderStep({ data, testInstanceData, setIsShowingVideo, testId, index }) {
	const [showStepInfoModal, setShowStepInfoModal] = useState(false);
	const { status, message, actionType, meta } = data;


	const actionName = getActionLabel(actionType);
	const actionDescription = meta?.actionName ? meta.actionName : message;

	const openStepInfoModal = () => {
		setShowStepInfoModal(true);
	};

	const isFirst = index === 0;

	return (
		<div className={"relative"} css={stepCSS}>
			<div className="flex item-center w-full">

				<div css={leftSide(isFirst)} className="relative flex flex-col">
					<div id="first"></div>
					<div id="mark"></div>
					<div id="second"></div>
				</div>
				<div className="flex items-center pl-24 w-full" css={stepBottom}>
					<div className="flex items-center">
						<CheckSquare />
						{/* <TestStatusSVG
						css={
							status === ActionStatusEnum.STALLED
								? css`
										path {
											fill: #e1c973;
										}
								  `
								: css``
						}
						type={status}
						height={"20rem"}
						width={"20rem"}
					/> */}
					</div>

					<Conditional showIf={status !== "FAILED"}>
						<div
							className={"ml-12 flex items-center"}

							css={css`
							align-items: center;
						`}
						>
							<span
								className={"text-13 font-600"}
								css={css`
								color: #d0d0d0;
							`}
							>
								{actionName} {status === ActionStatusEnum.STALLED ? "(Stalled)" : ""}
							</span>
							<Conditional showIf={actionDescription && actionDescription.trim().length}>
								<span
									className={"text-12 ml-16"}
									css={css`
									color: #656565;
									letter-spacing: .3px;
								`}
								>
									{meta?.actionName ? meta.actionName : message}
								</span>
							</Conditional>
						</div>
					</Conditional>
					<Conditional showIf={status === "FAILED"}>
						<ErrorComponent actionName={meta?.actionName} testInstanceData={testInstanceData} actionType={actionType} message={message} />
						<span
							className={"ml-12"}
							css={css`
							:hover {
								opacity: 0.9;
							}
						`}
							onClick={openStepInfoModal}
						>
							<InfoSVG
								css={css`
								width: 12rem;
								height: 12rem;
							`}
							/>
						</span>
					</Conditional>
				</div>
			</div>
			<Conditional showIf={[ActionsInTestEnum.ELEMENT_SCREENSHOT, ActionsInTestEnum.PAGE_SCREENSHOT, ActionsInTestEnum.CUSTOM_CODE].includes(actionType)}>
				{data.meta?.outputs ? data.meta.outputs.map((_, index) => <RenderImageInfo data={data} index={index} />) : null}
			</Conditional>
			<div className={"px-34 mt-12"}>
				{[ActionsInTestEnum.ASSERT_ELEMENT].includes(actionType) &&
					data.meta &&
					data.meta.meta &&
					data.meta.meta.meta &&
					data.meta.meta.meta.logs &&
					status === "FAILED" ? (
					<RenderAssertElement logs={data.meta.meta.meta.logs} />
				) : (
					""
				)}
				<Conditional showIf={status === "FAILED"}>
					<div className="mt-36">
						<div
							css={css`
								display: flex;
							`}
						>
							<a href={`crusher://replay-test?testId=${testId}`}>
								<Button
									css={css`
										width: 144px;
									`}
								>
									Run locally
								</Button>
							</a>
							<Button
								className={"ml-16"}
								bgColor={"tertiary"}
								css={css`
									width: 148rem;
								`}
								onClick={setIsShowingVideo.bind(this, true)}
							>
								<span className={"font-400"}>View Video</span>
							</Button>
						</div>
						<div
							className="mt-38"
							css={css`
								display: flex;
								flex-direction: column;
							`}
						>
							<div
								css={css`
									font-family: Cera Pro;
									font-size: 14px;
								`}
							>
								Screenshot when test failed
							</div>
							{data.meta?.screenshotDuringError ? (
								<img
									className={"mt-26"}
									src={data.meta.screenshotDuringError.endingScreenshot}
									css={css`
										max-width: 49%;
									`}
								/>
							) : (
								""
							)}
						</div>
					</div>
				</Conditional>
			</div>
			<Conditional showIf={showStepInfoModal}>
				<StepInfoModal data={data} setOpenStepInfoModal={setShowStepInfoModal} />
			</Conditional>
		</div>
	);
}

const errorBox = css`
	background: rgba(46, 25, 45, 0.5);
	border: 1px solid #6f3e6c;
	box-sizing: border-box;
	border-radius: 6rem;
	width: 100%;

	#play-button {
		:hover {
			text-decoration: underline;
		}
	}
`;

function getAllKeys() {
	const keys: any = {};
	for (const key of Object.keys(item)) {
		keys[key] = true;
	}

	return Object.keys(sortObjectByPropertyKeyAsc(keys));
}

function sortObjectByPropertyKeyAsc(obj: any) {
	return Object.keys(obj)
		.sort()
		.reduce((result: any, key) => {
			result[key] = obj[key];
			return result;
		}, {});
}

const scrollbarWidth = () => {
	// thanks too https://davidwalsh.name/detect-scrollbar-width
	const scrollDiv = document.createElement("div");
	scrollDiv.setAttribute("style", "width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;");
	document.body.appendChild(scrollDiv);
	const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return scrollbarWidth;
};

function Table({ columns, data }) {
	// Use the state and functions returned from useTable to build your UI

	const defaultColumn = React.useMemo(
		() => ({
			width: 210,
		}),
		[],
	);

	const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

	const { getTableProps, getTableBodyProps, headerGroups, rows, totalColumnsWidth, prepareRow } = useTable(
		{
			columns,
			data,
			defaultColumn,
		},
		useBlockLayout,
	);

	const RenderRow = React.useCallback(
		({ index, style }) => {
			const row = rows[index];
			prepareRow(row);
			return (
				<div
					{...row.getRowProps({
						style,
					})}
					className="tr"
				>
					{row.cells.map((cell) => {
						return (
							<div {...cell.getCellProps()} className="td">
								{cell.render("Cell")}
							</div>
						);
					})}
				</div>
			);
		},
		[prepareRow, rows],
	);

	// Render the UI for your table
	return (
		<div {...getTableProps()} className="table" style={{ fontSize: "13.5rem" }}>
			<div style={{ fontWeight: "bold" }}>
				{headerGroups.map((headerGroup) => (
					<div {...headerGroup.getHeaderGroupProps()} className="tr">
						{headerGroup.headers.map((column) => (
							<div {...column.getHeaderProps()} className="th">
								{column.render("Header")}
							</div>
						))}
					</div>
				))}
			</div>

			<div {...getTableBodyProps()} style={{ marginTop: "26rem" }}>
				<FixedSizeList height={200} itemCount={rows.length} itemSize={50} width={totalColumnsWidth + scrollBarSize}>
					{RenderRow}
				</FixedSizeList>
			</div>
		</div>
	);
}

function StepInfoModal({ setOpenStepInfoModal, data }) {
	const { meta } = data;

	const { actionName } = meta;

	const metaInfo = meta.meta || meta;

	return (
		<Modal
			onClose={setOpenStepInfoModal.bind(this, false)}
			onOutsideClick={setOpenStepInfoModal.bind(this, false)}
			modalStyle={css`
				padding: 28rem 36rem 36rem;
			`}
		>
			<div className={"font-cera text-16 font-600 leading-none"}>Step Info 🦖</div>
			<div className={"text-13 mt-8 mb-24"}>Debug info listed below</div>
			<hr />
			<div className={"mt-44"}>
				<Conditional showIf={actionName}>
					<div className={"text-13 mt-8 mb-24 flex text-bold"}>
						<span css={{ fontWeight: "bold" }}>Step name</span>
						<span css={{ marginLeft: "auto" }}>{actionName}</span>
					</div>
				</Conditional>
				<Conditional showIf={meta.beforeUrl}>
					<div className={"text-13 mt-8 mb-24 flex text-bold"}>
						<span css={{ fontWeight: "bold" }}>Page Url (before action)</span>
						<span css={{ marginLeft: "auto" }}>{meta.beforeUrl}</span>
					</div>
				</Conditional>
				<Conditional showIf={meta.afterUrl}>
					<div className={"text-13 mt-8 mb-24 flex"}>
						<span css={{ fontWeight: "bold" }}>Page Url (after action)</span>
						<span css={{ marginLeft: "auto" }}>{meta.afterUrl}</span>
					</div>
				</Conditional>

				<Conditional showIf={metaInfo?.result?.length}>
					<div style={{ fontWeight: "bold", color: "#fff", fontSize: "13rem" }}>Result (Total {metaInfo?.result ? metaInfo.result.length : 0} items): </div>
					<div css={tableStyle}>
						<Table
							data={metaInfo?.result && metaInfo.result.map((t) => ({ ...t, exists: t.exists.toString() }))}
							columns={
								metaInfo?.result &&
								getAllKeys().map((key) => ({
									id: key,
									Header: key,
									accessor: key,
									key: key,
								}))
							}
						/>
					</div>
				</Conditional>
			</div>
		</Modal>
	);
}

const tableStyle = css`
	padding: 1rem;
	margin-top: 24rem;

	table {
		border-spacing: 0;
		border: 1px solid black;
		font-size: 14rem;

		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			:last-child {
				border-right: 0;
			}
		}
	}
`;

function TestOverviewTabTopSection({ currentTestTab, testInstanceData, expand, isShowingVideo, setIsShowingVideo, setCurrentTestTab }) {
	const videoUrl = testInstanceData?.output?.video;

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				width: 100%;
			`}
		>
			<Conditional showIf={isShowingVideo}>
				<TestVideoUrl setOpenVideoModal={setIsShowingVideo} videoUrl={videoUrl} />
			</Conditional>
			<div
				css={css`
					gap: 32rem;
				`}
				className={"px-56 flex items-center leading-none text-15 font-600"}
			>
				<div
					css={[testNavBarItemStyle, currentTestTab === TestTabEnum.OVERVIEW ? selectedTabStyle : undefined]}
					onClick={() => {
						setCurrentTestTab("overview");
					}}
				>
					Overview
				</div>
				<div
					css={[testNavBarItemStyle, currentTestTab === TestTabEnum.LOGS ? selectedTabStyle : undefined]}
					onClick={() => {
						setCurrentTestTab("logs");
					}}
				>
					logs
				</div>

			</div>

			<div className={"flex items-center mr-60"}>
				<PlayVideo videoUrl={testInstanceData?.output?.video} expand={expand} />
			</div>
		</div>
	);
}

const selectedTabStyle = css`
	font-weight: 700;
	color: #C071FF;
	text-decoration: none;
`;
const testNavBarItemStyle = css`
	font-weight: 500;
	font-size: 14rem;

	color: #696969;
	text-decoration: underline;
	:hover {
	
		color: #fff;
	}
`;

function ExpanDNew(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M1 4V1m0 0h3M1 1l3.75 3.75M13 4V1m0 0h-3m3 0L9.25 4.75M1 10v3m0 0h3m-3 0l3.75-3.75M13 13L9.25 9.25M13 13v-3m0 3h-3"
				stroke="#D766FF"
				strokeWidth={1.3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
function ExpandableStepGroup({
	steps,
	testInstanceData,
	setIsShowingVideo,
	testId,
	count,
	show = false,
}: {
	steps: any[];
	testInstanceData: any;
	count: number;
	show?: boolean;
	setIsShowingVideo: any;
	testId: any;
}) {
	const [expandTestStep, setExpandTestStepSteps] = React.useState(show);
	const expandHandler = React.useCallback(() => {
		setExpandTestStepSteps(true);
	}, []);

	return (
		<>
			<Conditional showIf={!expandTestStep}>
				<Conditional showIf={count > 0}>

					<div className={"relative"} css={stepCSS}>
						<div className="flex item-center w-full" onClick={expandHandler}>

							<div css={leftSide(false)} className="relative flex flex-col">
								<div id="first"></div>
								<div id="mark"></div>
								<div id="second"></div>
							</div>
							<div className="flex items-center pl-20 w-full" css={stepBottom}>
								<div className="flex items-center">
									<ExpanDNew />
								</div>
								<div className="ml-20">
									<span className={"text-13 font-600 leading-none expand-highlight pt-4"} css={css`color: #D0D0D0;`}>
										<span className="underline">expand</span> {count} steps</span>
								</div>
							</div>

						</div>
					</div>
				</Conditional>
			</Conditional>
			<Conditional showIf={expandTestStep}>
				{steps.map((step, index) => (
					<RenderStep testId={testId} setIsShowingVideo={setIsShowingVideo} testInstanceData={testInstanceData} data={step} key={index} index={index} />
				))}
			</Conditional>
		</>
	);
}


const stepCSS = css`
	height: 44rem;
	display: flex;
    align-items: center;
	padding-left: 56rem;
	:hover{
		background: #101010;
	}
`


function RenderSteps({ steps, testInstanceData, testId, setIsShowingVideo }: { steps: any[]; testInstanceData: any; setIsShowingVideo: any; testId: any }) {
	const groupSteps = React.useMemo(() => getCollapsedTestSteps(steps), [steps]);
	return (
		<div className={"mt-20 w-full"}>
			<div className={"py-22"}>
				{groupSteps.map(({ type, from, to, count }: any) => (
					<ExpandableStepGroup
						testId={testId}
						setIsShowingVideo={setIsShowingVideo}
						testInstanceData={testInstanceData}
						steps={steps.slice(from, to + 1)}
						count={count}
						show={type === "show"}
					/>
				))}
			</div>
		</div>
	);
}

function TestCard() {
	const [selectedTest] = useAtom(selectedTestAtom);

	const { testData } = useBasicTestData();
	const id = selectedTest;

	const { name, testInstances } = testData;
	const [expand, setExpand] = useState(false);
	const [showLoading] = useState(false);
	const allConfiguration = getAllConfigurationForGivenTest(testData);

	const [testCardConfig, setTestCardConfig] = useAtom(testCardConfigAtom);
	const [isShowingVideo, setIsShowingVideo] = React.useState(false);
	const [currentTestTab, setCurrentTestTab] = React.useState(TestTabEnum.OVERVIEW);

	const testIndexByFilteration = getTestIndexByConfig(testData, testCardConfig);

	const failedTestsConfiguration = getFailedConfigurationForTest(testData);
	const testInstanceData = testInstances[testIndexByFilteration];
	const steps = getStepsFromInstanceData(testInstanceData);

	useEffect(() => {
		if (failedTestsConfiguration.length >= 1) {
			setExpand(true);
		}

		setTestCardConfig(getBaseConfig(allConfiguration));
	}, []);

	return (
		<div css={testCard} className={" flex-col pt-30"} id={`test-card-${id}`}>
			<TestOverviewTabTopSection
				isShowingVideo={isShowingVideo}
				setIsShowingVideo={setIsShowingVideo}
				name={name}
				testInstanceData={testInstanceData}
				expand={expand}
				testCardConfig={testCardConfig}
				allConfiguration={allConfiguration}
				setTestCardConfig={setTestCardConfig}
				setCurrentTestTab={setCurrentTestTab}
				currentTestTab={currentTestTab}
			/>
			{currentTestTab === TestTabEnum.OVERVIEW && (
				<RenderSteps testId={testData.testId} setIsShowingVideo={setIsShowingVideo} steps={steps} testInstanceData={testInstanceData} />
			)}

			{currentTestTab === TestTabEnum.LOGS && <TestLogs testId={testData.testId} testInstanceData={testInstanceData} />}

			<Conditional showIf={expand && showLoading}>
				<div className={"flex flex-col items-center w-full mt-80 mb-80"}>
					<LoadingSVG height={"20rem"} />

					<div className={"mt-12 text-13"}>Loading</div>
				</div>
			</Conditional>
		</div>
	);
}
const testCard = css`
	:hover {
		.test-card-header {
			background: rgb(16, 18, 21);
			box-sizing: border-box;
		}
	}

	#click-to-open {
		visibility: hidden;
	}

	:hover {
		#click-to-open {
			visibility: visible;
		}
	}

	box-sizing: border-box;
	border-radius: 8px;
`;

export default ReportSection;
