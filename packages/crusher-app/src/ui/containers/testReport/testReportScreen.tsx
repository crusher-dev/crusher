import { Button } from "dyson/src/components/atoms";
import { CalendarSVG, FailedSVG, InitiatedSVG, PassedSVG, RerunSVG, ReviewRequiredSVG, RunningSVG, TestStatusSVG, ThunderSVG } from "@svg/testReport";
import { css } from "@emotion/react";
import { LayoutSVG } from "@svg/dashboard";
import { Conditional } from "dyson/src/components/layouts";
import { atom, useAtom } from "jotai";
import React, { useEffect } from "react";
import { BackSVG } from "@svg/builds";
import { useBuildReport } from "../../../store/serverState/buildReports";
import { useRouter } from "next/router";
import { timeSince } from "@utils/dateTimeUtils";
import { getAllConfiguration, getStatusString, showReviewButton } from "@utils/pages/buildReportUtils";
import { usePageTitle } from "../../../hooks/seo";
import dynamic from "next/dynamic";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "../../../types/RequestOptions";
import { sendSnackBarEvent } from "@utils/notify";

const ReportSection = dynamic(() => import("./testList"));
function TitleSection() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	return (
		<div>
			<div className={"font-cera text-19 font-700 leading-none flex items-center"} id={"title"}>
				<BackSVG
					height={22}
					className={"mr-12"}
					onClick={() => {
						window.history.back();
					}}
				/>{" "}
				{data?.name} #{data?.id}
			</div>
		</div>
	);
}

function StatusTag({ type }) {
	if (type === "REVIEW_REQUIRED") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, review]}>
				<ReviewRequiredSVG height={18} isMonochrome={true} /> <span className={"ml-16 text-14 font-600 ml-8 leading-none"}>Review required</span>
			</div>
		);
	}
	if (type === "FAILED") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, failed]}>
				<FailedSVG height={18} isMonochrome={true} /> <span className={"ml-16 text-14 font-600 ml-8 leading-none"}>Failed</span>
			</div>
		);
	}
	if (type === "PASSED") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, passed]}>
				<PassedSVG height={20} isMonochrome={true} /> <span className={"ml-16 text-14 font-600 ml-8 leading-none"}>Passed</span>
			</div>
		);
	}
	if (type === "RUNNING") {
		return (
			<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, running]}>
				<RunningSVG height={16} isMonochrome={true} /> <span className={"ml-16 text-14 font-600 ml-8 leading-none"}>Running</span>
			</div>
		);
	}
	return (
		<div className={"flex items-center px-12 justify-center mr-8"} css={[statusTag, waiting]}>
			<InitiatedSVG height={16} isMonochrome={true} /> <span className={"ml-16 text-14 font-600 ml-8 leading-none"}>Waiting</span>
		</div>
	);
}

function NameNStatusSection() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	const title = data.name || `#${data?.id}`;
	usePageTitle(title);
	return (
		<div className={"flex items-center justify-between"}>
			<div className={"flex items-center"}>
				<TitleSection />
				<Button
					size={"small"}
					bgColor={"tertiary-dark"}
					className={"ml-20"}
					css={css`
						width: 96rem;
					`}
					onClick={rerunBuild.bind(this, query.id)}
					title="Rerun this build"
				>
					<div className={"flex items-center justify-center text-13 font-400"}>
						<RerunSVG className={"mr-6"} height={14} />
						Rerun
					</div>
				</Button>
				{/*<ThreeEllipsisSVG className={"ml-22"} width={25} />*/}
			</div>

			<StatusTag type={data.status} isMonochrome={true} />
		</div>
	);
}

const section = [
	{
		name: "Overview",
		icon: <LayoutSVG />,
		key: "overview",
	},
	{
		name: "Test report",
		icon: null,
		key: "reports",
	},
	// {
	// 	name: "History",
	// 	icon: null,
	// },
];

const selectedTabAtom = atom(0);

export const rerunBuild = async (buildId) => {
	await backendRequest(`/builds/${buildId}/actions/rerun`, {
		method: RequestMethod.POST,
	});

	sendSnackBarEvent({ type: "normal", message: "We've started new build" });
};

function TabBar() {
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	return (
		<div css={Tab} className={"flex mt-48 "}>
			{section.map(({ name, icon, key }, i) => (
				<div className={""} onClick={setSelectedTabIndex.bind(this, i)} key={key}>
					<div css={[TabItem, selectedTabIndex === i && selected]} className={"flex items-center justify-center text-15"}>
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

function ConfigurationMethod({ configType, array }) {
	return (
		<div className={"text-13 mb-16"}>
			<span className={"text-13 font-600 capitalize"}>{configType}</span>
			<span
				className={"capitalize ml-32"}
				css={css`
					font-size: 12.8rem;
				`}
			>
				{array.join(", ").toLowerCase()}
			</span>
		</div>
	);
}

function TestOverviewTab() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);
	const [, setSelectedTabIndex] = useAtom(selectedTabAtom);

	const showReview = showReviewButton(data?.status);

	const allConfiguration = getAllConfiguration(data?.tests);

	return (
		<div className={"flex mt-48 justify-between"}>
			<div css={leftSection}>
				<div css={overviewCard} className={"flex flex-col items-center justify-center pt-120 pb-88"}>
					<div className={"flex flex-col items-center"}>
						<div className={"mb-28"}>
							<TestStatusSVG type={data?.status} height={24} width={28} />
						</div>
						<div className={"font-cera text-15 font-500 mb-24"}>{getStatusString(data?.status)}</div>
						<div className={"flex items-center"}>
							<Conditional showIf={showReview}>
								<Button
									bgColor={"tertiary-dark"}
									css={css`
										width: 148rem;
									`}
									onClick={setSelectedTabIndex.bind(this, 1)}
								>
									<span className={"font-400"}>Review</span>
								</Button>
							</Conditional>
							<Button
								bgColor={"tertiary-dark"}
								css={css`
									width: 148rem;
								`}
								className={"ml-16"}
								onClick={rerunBuild.bind(this, query.id)}
								title="Rerun this build"
							>
								<div className={"flex items-center justify-center text-13 font-400"}>
									<RerunSVG className={"mr-6"} height={14} />
									Rerun
								</div>
							</Button>
						</div>
						<div className={"mt-60 text-14 font-600 mb-24"}>Your test were run on</div>

						{Object.entries(allConfiguration).map(([key, value]) => (
							<ConfigurationMethod configType={key} array={value} />
						))}
					</div>
				</div>
			</div>
			<div css={rightSection} className={"ml-36 pt-12"}>
				{/* <div className={"mb-32"}>
					<div className={"font-600 text-14 mb-16"}>Reviewers</div>
					<div css={tag} className={"text-13 px-18 py-7 mb-12"}>
						Himanshu
					</div>
					<div css={tag} className={"text-13 px-18  py-7"}>
						Himanshu
					</div>
				</div> */}
				<div>
					<div className={"font-600 text-14 mb-16"}>Environment</div>
					<div css={tag} className={"text-13 px-18  py-7 mb-12"}>
						Production
					</div>
				</div>
			</div>
		</div>
	);
}

const tag = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1rem solid #171c24;
	border-radius: 4px;
	height: 32px;
`;

const overviewCard = css`
	width: 100%;
	min-height: 500px;
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;
	box-sizing: border-box;
	border-radius: 8px;
`;
const leftSection = css`
	width: 70%;
`;
const rightSection = css`
	width: 30%;
	max-width: 315px;
`;

export const TestReportScreen = () => {
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	useEffect(() => {
		if (query.view_draft) setSelectedTabIndex(1);
	}, [query.view_draft]);
	return (
		<div className={"px-16 mt-56"}>
			<NameNStatusSection />
			<div className={"flex items-center leading-none mt-16 text-13"}>
				<CalendarSVG className={"mr-16"} />
				Ran {timeSince(new Date(data.startedAt))}
			</div>
			<Conditional showIf={selectedTabIndex !== 1}>
				<div className={"flex items-center leading-none mt-60 text-13"}>
					<ThunderSVG className={"mr-16"} />
					Wohoo! You saved 20 hours of testing
				</div>
			</Conditional>
			<Conditional showIf={selectedTabIndex === 1}>
				<div className={"flex leading-none mt-56 mb-52  items-center"}>
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
			<Conditional showIf={selectedTabIndex === 0}>
				<TestOverviewTab />
			</Conditional>
			<Conditional showIf={selectedTabIndex === 1}>
				<ReportSection />
			</Conditional>
		</div>
	);
};

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

const statusTag = css`
	min-width: 140px;
	height: 30px;
	box-sizing: border-box;
	border-radius: 15.5px;
`;

const failed = css`
	background: rgba(152, 38, 127, 0.8);
	border: 1px solid rgba(255, 64, 213, 0.46);
`;

const passed = css`
	background: #416a3e;
	border: 1px solid #64ae59;
`;

const review = css`
	background: #44293c;
	border: 1px solid #77516c;
	min-width: 172px;
`;

const running = css`
	background: #1e242c;
	border: 1px solid #545e6b;
`;

const waiting = css`
	border: 1px solid #545e6b;
`;

const Tab = css`
	border-bottom: 1px solid #1e242c;
`;

const TabItem = css`
	top: 1px;
	position: relative;
	height: 37px;
	min-width: 136px;
	padding: 0 24px;

	:hover {
		color: #fff;
		font-weight: 600;
	}

	min-width: 136px;
`;

const selected = css`
	top: 1px;
	position: relative;
	border: 1px solid #1e242c;
	border-radius: 6px 6px 0 0;
	border-bottom: 1px solid #0a0b0e;
	color: #fff;
	min-width: 136px;
	font-weight: 600;

	padding-top: 2px;
`;
