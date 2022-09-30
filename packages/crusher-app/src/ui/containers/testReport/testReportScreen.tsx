import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { atom, useAtom } from "jotai";

import { Button, Text } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";


import { PassedSVG } from "@svg/testReport";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { usePageTitle } from "../../../hooks/seo";
import { useBuildReport } from "../../../store/serverState/buildReports";
import { RequestMethod } from "../../../types/RequestOptions";
import { updateMeta } from "../../../store/mutators/metaData";
import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { ReviewSection } from "./testList";
import { CorrentSVG } from "@svg/builds";
import { GithubSquare } from "@svg/social";
import { CommentIcon, PlayIcon, ReloadIcon } from "@svg/dashboard";
import Download from "../dashboard/Download";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";

const ReportSection = dynamic(() => import("./testList"));
function BuildInfoTop() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	const name = "feats: integrated test GTM #517";

	return (
		<div>
			<div className={"font-cera text-18 font-700 leading-none flex pt-8"} id={"title"}>
				{name || `${data?.name} #${data?.id}`} <CorrentSVG height={18} width={18} className="ml-16" />
			</div>
			<div className="flex items-center mt-16" css={flexGap}>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>Status : </Text>
					<Text color="#E7E7E7" fontSize={13}>All passed</Text>
				</div>
				<div className="flex items-center">
					<GithubSquare className="mr-8" />
					<Text color="#E7E7E7" fontSize={13}>Github #2132</Text>
				</div>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>duration : </Text>
					<Text color="#E7E7E7" fontSize={13}>12s</Text>
				</div>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>test count : </Text>
					<Text color="#E7E7E7" fontSize={13}>12</Text>
				</div>
			</div>

		</div>
	);
}


const flexGap = css`
	gap: 28rem;
`


function ReportInfoTOp() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	const title = data.name || `#${data?.id}`;
	usePageTitle(title);
	return (
		<div className={"flex"}>

			<ImageSection />

			<div className="w-full">
				<div id="build-info-top" className="flex justify-between w-full">
					<BuildInfoTop />
					<BuildInfoButtons />
				</div>
				<BuildMainInfo />
			</div>
		</div>
	);
}



function BuildMainInfo() {
	return <React.Fragment>
		<div className="mt-32">
			<TextBlock color="#696969" fontSize={13}>Failed for few configuration</TextBlock>
		</div>
		<div className="flex justify-between items-start mt-80">
			<div className="flex" css={flexGapInfo}>
				<div>
					<TextBlock color="#696969" fontSize={13}>host</TextBlock>
					<TextBlock color="#D0D0D0" fontSize={13} className="mt-8">crusher.dev</TextBlock>
				</div>
				<div>
					<TextBlock color="#696969" fontSize={13}>host</TextBlock>
					<TextBlock color="#D0D0D0" fontSize={13} className="mt-8">crusher.dev</TextBlock>
				</div>
			</div>
			<div className="flex items-center">
				<GithubSquare className="mr-12" />
				<Text color="#696969" fontSize={13}>by himanshu</Text>
			</div>
		</div>
	</React.Fragment>;
}

const flexGapInfo = css`
	gap: 40rem;
`

function BuildInfoButtons() {
	return <div className="flex items-start" css={btnGap}>

		<Reload />
		<Review />
		<RunLocally />
	</div>;
}

const btnGap = css`
	gap: 12rem;
`

function Reload() {
	const { query } = useRouter()
	const runProjectTest = useCallback(() => {
		rerunBuild(query.id)
	}, []);

	return (
		<React.Fragment>
			<Button size="medium" bgColor={"tertiary"} title="Rerun this build" onClick={runProjectTest.bind(this)} css={creatTestCSS}>
				<div className={"flex items-center"}>
					<ReloadIcon />
				</div>
			</Button>
		</React.Fragment>
	);
}

function Review() {
	const [showCreateTest, setShowCreateTest] = useState(false)

	const runProjectTest = useCallback(() => {

	}, []);

	return (
		<React.Fragment>
			<Conditional showIf={showCreateTest}>
				<Download onClose={setShowCreateTest.bind(this, false)} />
			</Conditional>
			<Button size="medium" title="leave a comment/review" bgColor={"tertiary"} onClick={runProjectTest} css={creatTestCSS}>
				<div className={"flex items-center"}>
					<CommentIcon className={"mr-6"} />
					<span className="mt-1">
						review
					</span>
				</div>
			</Button>
		</React.Fragment>
	);
}

function RunLocally() {
	// const router = useRouter();
	// const { currentProject } = useProjectDetails()
	// const { query } = router;
	// const [filters] = useAtom(buildFiltersAtom);
	// const [, updateMetaData] = useAtom(updateMeta);

	const runProjectTest = useCallback(() => {
		(async () => {
			// await handleTestRun(currentProject?.id, query, filters, router, updateMetaData);

			// updateMetaData({
			// 	type: "user",
			// 	key: USER_META_KEYS.RAN_TEST,
			// 	value: true,
			// });

			// updateMetaData({
			// 	type: "project",
			// 	key: PROJECT_META_KEYS.RAN_TEST,
			// 	value: true,
			// });
		})();
	}, []);

	return (
		<Button size="medium" bgColor={"tertiary"} title="run test locally" onClick={runProjectTest} css={runTestCSS}>
			<div className={"flex items-center"}>
				<PlayIcon className={"mr-6"} />
				<span className="mt-2">
					run locally
				</span>
			</div>
		</Button>
	);
}

const runTestCSS = css`
	padding: 0 10rem;
	height: 30rpx;

	font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13px;

color: #FFFFFF;

width: max-content;


background: #A742F7;
border: 1px solid #7D41AD;
border-radius: 8px;

:hover{
	background: #A742F7;
	filter: brighntess(.7);
	border: 1px solid #7D41AD;
}
`

const creatTestCSS = css`
padding: 0 10rem;
font-family: 'Gilroy';
font-style: normal;
font-weight: 600;
font-size: 13px;

color: #FFFFFF;

width: max-content;

background: #0D0D0D;
border: 0.5px solid rgba(219, 222, 255, 0.16);
border-radius: 8px;

:hover{
	background: #313131;
	filter: brighntess(.8);
}
`
const section = [
	{
		name: "Home",
		icon: null,
		key: "reports",
	},
	{
		name: "Tests",
		icon: null,
		key: "insights"
	},
	{
		name: "Insights & Alert",
		icon: null,
		key: "insights"
	},
	{
		name: "log",
		icon: null,
	},
];

const selectedTabAtom = atom(0);

export const rerunBuild = async (buildId) => {
	await backendRequest(`/builds/${buildId}/actions/rerun`, {
		method: RequestMethod.POST,
	});

	sendSnackBarEvent({ type: "normal", message: "We've started new build" });
};

function ImageSection() {
	return <div className="mr-46">
		<img src="https://i.imgur.com/GT2hLO9.png" css={previewImgCss} />
	</div>;
}

const previewImgCss = css`
	min-width: 304rem;
    height: 220rem;
    border: 0.5px solid rgb(255 255 255 / 6%);
    border-radius: 15px;
`
function TabBar() {
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	return (
		<div css={Tab} className={"flex mt-88	 "}>
			{section.map(({ name, icon, key }, i) => (
				<div onClick={setSelectedTabIndex.bind(this, i)} key={key}>
					<div css={[TabItem, selectedTabIndex === i && selected]} className={`flex items-center justify-center text-14`}>
						<Conditional showIf={icon}>
							<span className={"mr-8"}>{icon}</span>
						</Conditional>
						{name}
					</div>
				</div>
			))}
			<div css={css`margin-left: auto;`}>
				<ReviewSection />
			</div>
		</div>
	);
}

export const TestReportScreen = () => {
	const [selectedTabIndex] = useAtom(selectedTabAtom);
	const { query } = useRouter();
	const [, updateMetaData] = useAtom(updateMeta);

	useEffect(() => {
		updateMetaData({
			type: "user",
			key: USER_META_KEYS.VIEW_REPORT,
			value: true,
		});

		updateMetaData({
			type: "project",
			key: PROJECT_META_KEYS.VIEW_REPORT,
			value: true,
		});

		// if (query.view_draft) setSelectedTabIndex(0);
	}, [query.view_draft]);
	return (
		<div className={"pt-46 flex flex-col items-center"} css={css`background: #0C0C0C;`}>
			<div css={buildContainerWidth}>
				<ReportInfoTOp />

				<Conditional showIf={selectedTabIndex === 1}>
					<div className={"flex leading-none mt-56 mb-52  items-center invisible"}>
						<div
							className={"text-13"}
							css={css`
								width: 100px;
								line-height: 19rem;
							`}
						>
							Last build
						</div>
						<div css={timeLine} className={"ml-40 relative"}>
							<div className={"absolute flex flex-col items-center"} css={currentSelected}>
								<div className={"mb-8 text-12"}>12Jun</div>
								<div>
									<PassedSVG />
								</div>
							</div>

							<div className={"absolute flex flex-col items-center"} css={timelineItem}>
								<div>
									<PassedSVG />
								</div>
							</div>
						</div>
					</div>
				</Conditional>
				<TabBar />
			</div>
			<Conditional showIf={selectedTabIndex === 0}>
				<ReportSection />
			</Conditional>
		</div>
	);
};

export const buildContainerWidth = css`
max-width: 1300rem;
width: calc(100vw - 296rem) !important;
// width: calc(100vw - 352rem) !important;
	margin: 0 auto;
`;
const timeLine = css`
	height: 2px;
	width: 100%;
	background: #1e242c;
`;

const currentSelected = css`
	position: absolute;
	transform: translateY(-72%);
`;

const timelineItem = css`
	position: absolute;
	transform: translateY(-50%);
	left: 50%;
`;

const Tab = css``;

const TabItem = css`
	position: relative;
	height: 28rem;
	padding: 0 16rem;
	padding-top: 1rem !important;

	margin-right: 4rem;
	border-radius: 6rem;
	:hover {
		background: rgba(255, 255, 255, 0.12);
	}
`;

const selected = css`
	border-radius: 6px;
	color: #fff;
	font-weight: 500;
	background: rgba(255, 255, 255, 0.12);
`;
