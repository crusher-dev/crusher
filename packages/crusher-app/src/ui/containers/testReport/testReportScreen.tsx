import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

import { useAtom } from "jotai";

import { Button, Text } from "dyson/src/components/atoms";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Conditional } from "dyson/src/components/layouts";

import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";
import { CorrentSVG } from "@svg/builds";
import { ExternalIcon, PlayIcon, ReloadIcon } from "@svg/dashboard";
import { GithubSquare } from "@svg/social";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { usePageTitle } from "../../../hooks/seo";
import { updateMeta } from "../../../store/mutators/metaData";
import { useBuildReport } from "../../../store/serverState/buildReports";
import { RequestMethod } from "../../../types/RequestOptions";
import { selectedTabAtom } from "./atoms";
import { ConfigChange } from "./components/common/config";
import { ReviewSection } from "./components/review/reviewComponent";
import { HomeSection } from "./container/home";
import { COLORS } from "dyson/src/constant/color";

const ReportSection = dynamic(() => import("./container/testList"));
function BuildInfoTop() {
	const { data } = useReportData();
	const title = data.name || `#${data?.id}`;

	const { status } = data;


	return (
		<div>
			<div className={"font-cera text-18 font-700 leading-none flex pt-8"} id={"title"}>
				{title || `${data?.name} #${data?.id}`} <CorrentSVG height={18} width={18} className="ml-16" />
			</div>
			<div className="flex items-center mt-16" css={flexGap}>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>
						Status:
					</Text>
					<Text color="#E7E7E7" fontSize={13} className="ml-4">
						{status === "PASSED" ? `All passed` : status.toLowerCase()}
					</Text>
				</div>
				<div className="flex items-center">
					<GithubSquare className="mr-8" />
					<Text color="#E7E7E7" fontSize={13}>
						Github #2132
					</Text>
				</div>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>
						duration :{" "}
					</Text>
					<Text color="#E7E7E7" fontSize={13}>
						12s
					</Text>
				</div>
				<div className="flex items-center">
					<Text color="#696969" fontSize={13}>
						test count :{" "}
					</Text>
					<Text color="#E7E7E7" fontSize={13}>
						{data.tests.length}
					</Text>
				</div>
			</div>
		</div>
	);
}

const flexGap = css`
	gap: 28rem;
`;

const useReportData = () => {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	return { data }
}

function ReportInfoTOp() {
	const { data } = useReportData()

	const title = data.name || `#${data?.id}`;
	usePageTitle(title);
	return (
		<div className={"flex"}>
			<ImageSection src={data.hostScreenshot} />

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
	const { data: { meta } } = useReportData();
	const { github } = meta;


	return (
		<React.Fragment>
			<div className="mt-32" css={css`min-height: 13px;`}>
				<Conditional showIf={!!github}>
					<a href={github.repoLink} css={link} target="_blank">
						<TextBlock color="#696969" fontSize={13} className="flex items-center" css={link}>
							{github.githubCommitMessage} <ExternalIcon className="ml-6" />

						</TextBlock>
					</a>
				</Conditional>
			</div>
			<div className="flex justify-between items-start mt-80">
				<div className="flex" css={flexGapInfo}>
					<div>
						<TextBlock color="#696969" fontSize={13}>
							host
						</TextBlock>
						<TextBlock color="#D0D0D0" fontSize={13} className="mt-8">
							<a href={"https://crusher.dev"} css={link} className="flex items-center" target="_blank">
								crusher.dev  <ExternalIcon className="ml-6" />
							</a>
						</TextBlock>
					</div>
					<div>
						<TextBlock color="#696969" fontSize={13}>
							host
						</TextBlock>
						<TextBlock color="#D0D0D0" fontSize={13} className="mt-8">
							crusher.dev
						</TextBlock>
					</div>
				</div>
				<div className="flex items-center">
					<GithubSquare className="mr-12" />
					<Text color="#696969" fontSize={13}>
						by himanshu
					</Text>
				</div>
			</div>
		</React.Fragment>
	);
}

const link = css`
	:hover {
		text-decoration: underline !important;
	}
`;

const flexGapInfo = css`
	gap: 40rem;
`;

function BuildInfoButtons() {
	return (
		<div className="flex items-start" css={btnGap}>
			<Reload />
			<ReviewSection />
			<RunLocally />
		</div>
	);
}

const btnGap = css`
	gap: 12rem;
`;

function Reload() {
	const { query } = useRouter();
	const runProjectTest = useCallback(() => {
		rerunBuild(query.id);
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

function RunLocally() {
	const { query } = useRouter();

	const runProjectTest = useCallback(() => {
		(async () => {

		})();
	}, []);

	return (
		<a href={`crusher://run-local-build?buildId=${query.id}`}>
			<Button size="medium" bgColor={"tertiary"} title="run test locally" css={runTestCSS}>
				<div className={"flex items-center"}>
					<PlayIcon className={"mr-6"} />
					<span className="mt-2">run locally</span>
				</div>
			</Button>
		</a>
	);
}

const runTestCSS = css`
	padding: 0 10rem;
	height: 30rpx;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: ${COLORS.purple[700]};
	border: 1px solid ${COLORS.purple[700]};
	border-radius: 8px;

	:hover {
		background: ${COLORS.purple[700]};
		filter: brighntess(.8);
		border: 1px solid ${COLORS.purple[700]};
	}
`;

const creatTestCSS = css`
	padding: 0 10rem;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 13px;

	color: #ffffff;

	width: max-content;

	background: #0d0d0d;
	border: 0.5px solid rgba(219, 222, 255, 0.16);
	border-radius: 8px;

	:hover {
		background: #313131;
		filter: brighntess(0.8);
	}
`;
const section = [
	{
		name: "Home",
		icon: null,
		key: "reports",
	},
	{
		name: "Tests",
		icon: null,
		key: "insights",
	},
	// {
	// 	name: "Insights & Alert",
	// 	icon: null,
	// 	key: "insights",
	// },
	// {
	// 	name: "log",
	// 	icon: null,
	// },
];

export const rerunBuild = async (buildId) => {
	await backendRequest(`/builds/${buildId}/actions/rerun`, {
		method: RequestMethod.POST,
	});

	sendSnackBarEvent({ type: "normal", message: "We've started new build" });
};

function ImageSection({ src }) {
	if (!src) {

		return (<div css={[previewImgCss, errorImageCSS]} className="mr-46">
			<div className="flex items-center mb-12">
				<TextBlock color="#BDBDBD" fontSize={16} weight={700} className="mr-6">screeshot failed</TextBlock>
				<div css={dot}></div>
			</div>
			<TextBlock fontSize={13} color="#696969">couldn't get screenshot</TextBlock>
		</div>)
	}
	return (
		<img src={src} css={previewImgCss} className="mr-46" />
	);
}

const dot = css`
min-width: 6px;
min-height: 6px;

background: #FF4874;
border-radius: 21px;
`

const errorImageCSS = css`
	border: 1.5px solid rgb(255 255 255 / 6%);
	padding: 20rem 24rem;

`

const previewImgCss = css`
	min-width: 304rem;
	height: 220rem;
	border: 0.5px solid rgb(255 255 255 / 6%);
	border-radius: 16rem;
	object-fit: cover;
`;
function TabBar() {
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	return (
		<div css={Tab} className={"flex"}>
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
		</div>
	);
}

export const TestReportScreen = () => {
	// Change this
	const [selectedTabIndex] = useAtom(selectedTabAtom);
	// const [selectedTabIndex] = [1];
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
		<div
			className={"pt-46 flex flex-col items-center"}
			css={css`
				background: #0c0c0c;
			`}
		>
			<div css={buildContainerWidth}>
				<ReportInfoTOp />
				<div className="flex justify-between mt-84 items-center">
					<TabBar />
					<ConfigChange />
				</div>
			</div>
			<Conditional showIf={selectedTabIndex === 0}>
				<HomeSection />
			</Conditional>
			<Conditional showIf={selectedTabIndex === 1}>
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

const Tab = css``;

const TabItem = css`
	position: relative;
	height: 26rem;
	margin-right: 12rem;
	padding: 0 12rem;

	color: #a7a7a7;
	letter-spacing: 0.4px;
	border-radius: 8rem;
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
