import { Button } from "dyson/src/components/atoms";
import {
	BottomSVG,
	CalendarSVG,
	RerunSVG,
	TestStatusSVG,
	ThreeEllipsisSVG,
	ThunderSVG,
	PassedSVG,
	FailedSVG,
	ReviewRequiredSVG,
	RunningSVG,
	InitiatedSVG,
} from "@svg/testReport";
import { css } from "@emotion/react";
import { LayoutSVG, PlaySVG } from "@svg/dashboard";
import { Conditional } from "dyson/src/components/layouts";
import { atom, useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { BackSVG } from "@svg/builds";
import { useBuildReport } from "../../../store/serverState/buildReports";
import { useRouter } from "next/router";
import { timeSince } from "@utils/dateTimeUtils";
import { getActionLabel, getStatusString, showReviewButton } from '@utils/pages/buildReportUtils';
import { TTestInfo, Test } from "@crusher-shared/types/response/iBuildReportResponse";
import { usePageTitle } from "../../../hooks/seo";
import { Modal } from "../../../../../dyson/src/components/molecules/Modal";
import { VideoComponent } from "../../../../../dyson/src/components/atoms/video/video";

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

	const title = data.name ||  `#${data?.id}`
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
				>
					<div className={"flex items-center justify-center text-13 font-400"}>
						<RerunSVG className={"mr-6"} height={14} />
						Rerun
					</div>
				</Button>
				<ThreeEllipsisSVG className={"ml-22"} width={25} />
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

function TestOverviewTab() {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);
	const [selectedTabIndex, setSelectedTabIndex] = useAtom(selectedTabAtom);

	const showReview = showReviewButton(data?.status)
	return (
		<div className={"flex mt-48 justify-between"}>
			<div css={leftSection}>
				<div css={overviewCard} className={"flex flex-col items-center justify-center pt-120 pb-88"}>
					<div className={"flex flex-col items-center"}>
						<div></div>

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
							>
								{" "}
								<div className={"flex items-center justify-center text-13 font-400"}>
									<RerunSVG className={"mr-6"} height={14} />
									Rerun
								</div>
							</Button>
						</div>
						<div className={"mt-60 text-14 font-600 mb-24"}>Your test were run on</div>

						<div className={"text-13 mb-16"}>
							<span className={"text-13 font-600"}>Browser</span>
							<span
								className={" ml-32"}
								css={css`
									font-size: 12.8rem;
								`}
							>
								Chrome, Firefox, Safari
							</span>
						</div>
						<div className={"text-13 mb-16"}>
							<span className={"text-13 font-600"}>Browser</span>
							<span
								className={" ml-32"}
								css={css`
									font-size: 12.8rem;
								`}
							>
								Chrome, Firefox, Safari
							</span>
						</div>
						<div className={"text-13 "}>
							<span className={"text-13 font-600"}>Browser</span>
							<span
								className={" ml-32"}
								css={css`
									font-size: 12.8rem;
								`}
							>
								Chrome, Firefox, Safari
							</span>
						</div>
					</div>
				</div>
			</div>
			<div css={rightSection} className={"ml-36 pt-12"}>
				<div className={"mb-32"}>
					<div className={"font-600 text-14 mb-16"}>Reviewers</div>
					<div css={tag} className={"text-13 px-18 py-7 mb-12"}>
						Himanshu
					</div>
					<div css={tag} className={"text-13 px-18  py-7"}>
						Himanshu
					</div>
				</div>
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

function FilterBar() {
	return (
		<div className={"flex items-center text-14"}>
			<div className={"text-14"}>
				Filter by <img className={"ml-8"} src={"/browsers.png"} height={16} />
			</div>
			<div className={"ml-48"}>
				<span className={"text-14 font-500"}>Version</span>
				<span className={"text-14 ml-8 underline"}>All</span>
			</div>
			<div className={"ml-48"}>
				<span className={"text-14 font-500"}>Version</span>
				<span className={"text-14 ml-8 underline"}>All</span>
			</div>
		</div>
	);
}

function RenderImageInfo({data}) {
	const {meta} = data;
	const imageName = meta.outputs[0].name;
	const firstImage = meta.outputs[0].value;
	const currentImage = meta.outputs[0].value
	return <div className={"  pl-44 mt-12"} css={imageTestStep}>
		<div className={"text-12"}>{imageName}</div>
		<div className={"mt-20 flex"}>
			<img src={firstImage}/> <img src={currentImage} css={css`margin-left: 2%`}/>
		</div>
	</div>;
}

const imageTestStep = css`
	img{
		max-width: 49%;
    border-radius: 6rem;
	}
`

function RenderStep({data}) {
	const {status, message, actionType} = data
	const isPassed = status === "COMPLETED"
	return (
	<div className={"relative mb-32"}>
		<div className={" flex px-44"}>
			<div css={tick}>
				<TestStatusSVG type={isPassed ? "PASSED" : "FAILED"} height={20} width={20} />
			</div>
			<div className={"mt-4"}>
				<span
					className={"text-13 font-600"}
					css={css`
            color: #d0d0d0;
					`}
				>
					{getActionLabel(actionType)}
				</span>
				<span
					className={"text-12 ml-20"}
					css={css`
            color: #848484;
					`}
				>
					{message}
				</span>
			</div>


		</div>

		<Conditional showIf={actionType==="ELEMENT_SCREENSHOT"}>
			<RenderImageInfo data={data}/>
		</Conditional>
	</div>
	);
}

function TestOverview() {
	return (
		<div className={"flex justify-between mt-8 "}>
			<div className={"text-13"}>Switch to</div>
			<div className={"flex"}>
				<div className={"flex items-center mr-32"}>
					<div className={"mr-8 text-13"}>
						<img src={"/chrome.png"} height={16} className={"mr-8"} />
						Chrome
					</div>
					<BottomSVG width={12} />
				</div>

				<div className={"flex items-center mr-32"}>
					<div className={"mr-8 text-13"}>Chrome</div>
					<BottomSVG width={12} />
				</div>

				<div className={"flex items-center"}>
					<div className={"mr-8 text-13"}>Chrome</div>
					<BottomSVG width={12} />
				</div>
			</div>
		</div>
	);
}

function TestCard({ id, testData }: { id: string; testData: Test }) {
	const { name, testInstances } = testData;
	const [openVideoModal, setOpenVideoModal] = useState(false);
	const [expand, setExpand] = useState(testData.status !== "PASSED" || false);
	const [sticky, setSticky] = useState(false);

	useEffect(() => {
		const testCard = document.querySelector(`#test-card-${id}`);
		const stickyOverview = document.querySelector("#sticky-overview-bar");
		const observer = new IntersectionObserver(
			() => {
				const stickyLastPoint = 0;
				const cardStartingOffset = testCard.getBoundingClientRect().top;
				const cardLastOffset = testCard.getBoundingClientRect().top + testCard.getBoundingClientRect().height;
				if (cardStartingOffset < stickyLastPoint) {
					setSticky(true);
				} else {
					setSticky(false);
				}
				if (cardLastOffset - 50 < stickyLastPoint) {
					setSticky(false);
				}
			},
			{ root: stickyOverview, threshold: [0, 0.01, 0.1, 0.5, 0.85, 1], rootMargin: "0px" },
		);

		observer.observe(testCard);
	}, []);
	const onCardClick = () => {
		// if(expand===true){
		// 	window.scrollTo()
		// }
		setExpand(!expand);
	};



	const testIndexByFilteration = 0; // Filter based on testreport and other configuration
	const videoUrl = testInstances[testIndexByFilteration]?.output?.video;
	const testInstanceData = testInstances[testIndexByFilteration];

	const {steps} = testInstanceData
	return (
		<div css={testCard} className={" flex-col mt-24 "} onClick={onCardClick} id={`test-card-${id}`}>
			<Conditional showIf={openVideoModal}>
				<Modal
					onClose={setOpenVideoModal.bind(this, false)}
					onOutsideClick={setOpenVideoModal.bind(this, false)}
					modalStyle={css`
						padding: 28rem 36rem 36rem;
					`}
				>
					<div className={"font-cera text-16 font-600 leading-none"}>Test video by 🦖</div>
					<div className={"text-13 mt-8 mb-24"}>For better experience, use full screen mode</div>
					<VideoComponent src={videoUrl} />
				</Modal>
			</Conditional>
			<Conditional showIf={expand && sticky}>
				<div css={stickyCSS} className={" px-0 "}>
					<div css={[header, stickyContainer]} className={"items-center w-full px-32 w-full"}>
						<div className={"flex justify-between items-center"}>
							<div className={"flex items-center leading-none text-15 font-600 mt-20"}>
								<TestStatusSVG height={18} className={"mr-16"} />
								{name}
							</div>
							<div className={"flex items-center mt-8"}>
								<span className={"text-13 mr-32"}>5 screenshot | 10 check</span>
								<span className={"flex text-13 mr-26"} onClick={(e)=>{
									e.stopPropagation()
									setOpenVideoModal.bind(this, true)
								}}>
									<PlaySVG className={"mr-10"} /> Replay recording
								</span>
								<span>
									<BottomSVG css={expand && close} />
								</span>
							</div>
						</div>
						<div className={"mt-12 mb-16"}>{TestOverview()}</div>
					</div>
				</div>
			</Conditional>
			<div>
				<div className={"px-28 w-full"}>
					<div css={header} className={"flex justify-between items-center w-full"}>
						<div className={"flex items-center leading-none text-15 font-600"}>
							<PassedSVG height={18} className={"mr-16"} />
							{name}
						</div>
						<div className={"flex items-center"}>
							<span className={"text-13 mr-32"}>5 screenshot | 10 check</span>
							<span className={"flex text-13 mr-26"} onClick={setOpenVideoModal.bind(this, true)}>
								<PlaySVG className={"mr-10"} /> Replay recording
							</span>
							<span>
								<BottomSVG css={expand && close} />
							</span>
						</div>
					</div>

					<Conditional showIf={expand}>{TestOverview()}</Conditional>
				</div>
			</div>
			<Conditional showIf={expand}>
				<div className={"px-32 w-full mt-16"} css={stepsContainer}>
					<div className={"ml-32 py-32"} css={stepsList}>
						{steps.map((step,index) => (
							<RenderStep data={step} key={index}/>
						))}
					</div>
				</div>
			</Conditional>
		</div>
	);
}

const stickyCSS = css`
	position: fixed;
	width: calc(100vw - 250rem);
	left: 50%;
	transform: translateX(-50%);
	top: 95rem;
	z-index: 10;
	max-width: 1456px;
	margin-left: -6px;
`;

const stickyContainer = css`
	background: rgb(13, 14, 17);
	border: 1px solid #171c24;
	box-sizing: border-box;
	border-radius: 0;
	min-height: 56px;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
`;

const tick = css`
	position: absolute;
	left: 0;
	transform: translate(-50%, 3px);
`;

const close = css`
	transform: rotate(180deg);
`;

const stepsList = css`
	border-left: 1px solid #171c24;
`;

const stepsContainer = css`
	border-top: 1px solid #171c24;
`;

const testCard = css`
	background: rgba(16, 18, 21, 0.5);
	border: 1px solid #171c24;

	:hover {
		background: rgba(34, 38, 43, 0.5);
		border: 1px solid rgba(77, 84, 92, 0.5);
	}

	box-sizing: border-box;
	border-radius: 8px;
`;

const header = css`
	min-height: 52px;
`;

function ReportSection() {
	const [stickyOverviewSection, setStickOverviewSection] = useState(false);

	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	useEffect(() => {
		const heading = document.querySelector("#review-section");
		const observer = new IntersectionObserver(
			() => {
				const { y } = heading.getBoundingClientRect();
				const bottomOffset = y + heading.clientHeight;

				setStickOverviewSection(bottomOffset < 69 ? true : false);
			},
			{ rootMargin: "0px" },
		);

		observer.observe(heading);
	}, []);

	return (
		<div className={"mt-40"}>
			<div className={"flex justify-between items-center"} id={"review-section"}>
				<div className={"text-14"}>Jump to</div>
				<div className={"flex items-center"}>
					<div className={"mr-32 leading-none text-14 font-600"}>-/12 test viewed</div>
					<Button
						css={css`
							width: 144px;
						`}
					>
						Review
					</Button>
				</div>
			</div>

			<Conditional showIf={stickyOverviewSection && stickyOverviewSection}>
				<div className={"fixed"} css={stickyBar} id={"sticky-overview-bar"}>
					<div css={containerCSS} className={"px-42 pt-10"}>
						<div>
							<div className={"flex justify-between items-center"}>
								<div className={"text-14"}>
									<span className={"text-16 font-cera font-600 mr-38"}>feat: integrated test GTM #517</span>
									<span className={"text-12 mr-16"}>12 june baseline</span>
									<span className={"text-12"}>Jump to</span>
								</div>
								<div className={"flex items-center pt-4"}>
									<div className={"mr-32 leading-none text-14 font-600"}>-/12 test viewed</div>
									<Button
										css={css`
											width: 144px;
										`}
									>
										Review
									</Button>
								</div>
							</div>
						</div>
						<div className={"mt-6"}>
							<FilterBar />
						</div>
					</div>
				</div>
			</Conditional>

			<div css={filterSection} className={"flex items-center mt-32  px-24"} id={"filter-section"}>
				<FilterBar />
			</div>

			<div className={"mt-40 pb-60"}>
				{data?.tests.map((testData, i) => (
					<TestCard id={i} testData={testData} />
				))}
			</div>
		</div>
	);
}

const containerCSS = css`
	width: calc(100vw - 250rem);
	margin: 0 auto;
	max-width: 1500px;
	max-width: 1540px;
	padding-right: 52rem;
`;

const stickyBar = css`
	background: #0d0e11;
	border: 1px solid #171c24;
	box-sizing: border-box;
	height: 96px;
	width: 100%;
	z-index: 100;

	top: 0;
	left: 0;
`;

const filterSection = css`
	height: 42px;

	background: #0d0e11;
	border: 1px solid #171c24;
	box-sizing: border-box;
	border-radius: 8px;
`;

export const TestReport = () => {
	const [selectedTabIndex] = useAtom(selectedTabAtom);
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);
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
						`}
					>
						Comparing to
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
