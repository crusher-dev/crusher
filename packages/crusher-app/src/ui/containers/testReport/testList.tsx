import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useBuildReport } from "../../../store/serverState/buildReports";
import { Button } from "dyson/src/components/atoms";
import { css } from "@emotion/react";
import { Conditional } from "dyson/src/components/layouts";
import { ChevronDown, PassedSVG, TestStatusSVG } from "@svg/testReport";
import {
	getActionLabel,
	getAllConfigurationForGivenTest,
	getBaseConfig,
	getScreenShotsAndChecks,
	getStepsFromInstanceData,
	getTestIndexByConfig,
} from '@utils/pages/buildReportUtils';
import { Test } from "@crusher-shared/types/response/iBuildReportResponse";
import { LoadingSVG, PlaySVG } from "@svg/dashboard";
import { Modal } from "dyson/src/components/molecules/Modal";
import { VideoComponent } from "dyson/src/components/atoms/video/video";

import dynamic from "next/dynamic";
import { ClickableText } from "../../../../../dyson/src/components/atoms/clickacbleLink/Text";
import { MenuItem } from "@components/molecules/MenuItem";
import { Dropdown } from "dyson/src/components/molecules/Dropdown";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";

const CompareImage = dynamic(() => import("./components/compareImages"));
const ReviewButtonContent = dynamic(() => import("./components/reviewBuild"));

function ReviewSection() {
	const [open, setOpen] = useState(false);

	return (
		<Dropdown component={<ReviewButtonContent closeModal={setOpen.bind(this, false)} />} callback={setOpen} initialState={open} dropdownCSS={reviewCss}>
			<Button
				css={css`
					width: 144px;
				`}
			>
				Review
			</Button>
		</Dropdown>
	);
}

const reviewCss = css`
	padding: 0;
	height: fit-content;
	width: 380rem;
	top: calc(100% + 9rem) !important;
	right: 0px !important;
	background: #1e2126;
	left: unset !important;
`;

/*
	How reports will work
	1.) Filter test instances by config
	2.) Save individual state for each test
			1. Step
			2.) Current state
 */
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
					{/* Disabled for now*/}
					{/*<div className={"mr-32 leading-none text-14 font-600"}>-/12 test viewed</div>*/}
					<ReviewSection />
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
									{/* Disabled for now*/}
									{/*<div className={"mr-32 leading-none text-14 font-600"}>-/12 test viewed</div>*/}
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
						{/*<div className={"mt-6"}>*/}
						{/*	<FilterBar />*/}
						{/*</div>*/}
					</div>
				</div>
			</Conditional>

			{/*<div css={filterSection} className={"flex items-center mt-32  px-24"} id={"filter-section"}>*/}
			{/*	<FilterBar />*/}
			{/*</div>*/}

			<div className={"mt-40 pb-60"}>
				{data?.tests.map((testData, i) => (
					<TestCard id={i} testData={testData} />
				))}
			</div>
		</div>
	);
}

function FilterBar() {
	return (
		<div className={"flex items-center text-14"}>
			<div className={"text-14"}>
				Filter by <img className={"ml-8"} src={"/browsers.png"} height={16} />
			</div>
			<div className={"ml-32"}>
				<span className={"text-14 font-500"}>Viewport</span>
				<span className={"text-14 ml-8 underline"}>All</span>
			</div>
		</div>
	);
}

function RenderImageInfo({ data }) {
	const { meta } = data;
	const imageName = meta.outputs[0].name;
	const baseLineImage = meta.outputs[0].targetScreenshotUrl;
	const currentImage = meta.outputs[0].value;


	return (
		<div className={"  pl-44 mt-12"} css={imageTestStep}>
			<div className={"text-12"}>{imageName}</div>
			<div className={"mt-20 flex"}>
				<img src={baseLineImage} />{" "}
				<img
					src={currentImage}
					css={css`
						margin-left: 2%;
					`}
				/>
			</div>
			{/* <div>
				<CompareImage leftImage={baseLineImage} rightImage={currentImage} />
			</div> */}
		</div>
	);
}

const imageTestStep = css`
	img {
		max-width: 49%;
		border-radius: 6rem;
	}
`;

function RenderStep({ data }) {
	const { status, message, actionType } = data;
	const isPassed = status === "COMPLETED";
	return (
		<div className={"relative mb-32"}>
			<div className={" flex px-44"}>
				<div css={tick}>
					<TestStatusSVG type={isPassed ? "PASSED" : "FAILED"} height={20} width={20} />
				</div>

				<Conditional showIf={status !== "FAILED"}>
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

				</Conditional>
				<Conditional showIf={status === "FAILED"}>
					<div className={"  py-16 px-22 mt-8"} css={errorBox}>
						<div className={"font-cera text-14 font-600 leading-none"}>
							Error at : 	{getActionLabel(actionType)}
						</div>
						<div className={"text-13 mt-8"}>
							{message}
						</div>
						<div className={"flex  mt-24"}>
							<div className={"text-13 flex items-center"} id={"play-button"}>

								<PlaySVG/> <span className={" ml-12 leading-none"}> Play To See Recording</span>

							</div>
						</div>
					</div>
				</Conditional>
			</div>

			<Conditional showIf={[ActionsInTestEnum.ELEMENT_SCREENSHOT, ActionsInTestEnum.PAGE_SCREENSHOT].includes(actionType) && isPassed}>
				<RenderImageInfo data={data} />
			</Conditional>


		</div>
	);
}

const errorBox = css`

  background: rgba(46, 25, 45, 0.5);
  border: 1px solid #6F3E6C;
  box-sizing: border-box;
  border-radius: 6rem;
	width: 100%;

	#play-button{
		:hover{
			text-decoration: underline;
		}
	}
`

function Browsers({ browsers, setConfig }) {
	return (
		<div className={"flex flex-col justify-between h-full"} onClick={(e) => {}}>
			<div>
				{browsers.map((name: string) => (
					<MenuItem
						css={css`
							padding: 12rem 10rem;
						`}
						label={
							<div className={"flex items-center"}>
								<img src={`/assets/img/build/browser/${name.toLowerCase()}.png`} width={12} className={"mr-12"} />
								<div>{name.toLowerCase()}</div>
							</div>
						}
						key={name}
						className={"close-on-click"}
						onClick={() => {
							setConfig("browser", name);
						}}
					/>
				))}
			</div>
		</div>
	);
}

const dropDownSelectionCSS = css`
	height: fit-content;
	width: 180rem;
	top: calc(100% + 4rem) !important;
	right: 8px !important;
	left: unset !important;
`;

/*
	Use Jotai for avoiding props drilling.
	Make config much more streamline.
 */
function TestConfigSection({ expand, allCofiguration, setTestCardConfig, testCardConfig }) {
	const setConfig = (key, value) => {
		const config = allCofiguration;

		config[key] = value;

		setTestCardConfig(config);
	};

	const browserInLowerCase = testCardConfig.browser.toLowerCase();

	return (
		<div className={"flex justify-between items-center mt-6 "}>
			<div className={"text-13"}>Switch to</div>

			<Conditional showIf={!expand}>
				<div className={"flex text-12 items-center"} id={"click-to-open"}>
					<div
						className={"text-13 font-500 mr-12 underline"}
						css={css`
							color: #eee;
						`}
					>
						Expand
					</div>
					<ChevronDown
						width={15}
						css={css`
							path {
								fill: #eee;
							}
						`}
					/>
				</div>
			</Conditional>
			<div className={"flex"}>
				<Dropdown component={<Browsers setConfig={setConfig} browsers={allCofiguration.browser} />} dropdownCSS={dropDownSelectionCSS}>
					<ClickableText paddingY={4} paddingX={12}>
						<div className={"flex items-center "}>
							<div className={" flex items-center  mr-8 text-13"}>
								<img src={`/assets/img/build/browser/${browserInLowerCase}.png`} width={16} className={"mr-8"} />
								<span className={"mt-1 capitalize"}>{browserInLowerCase}</span>
							</div>
							<ChevronDown width={12} />
						</div>
					</ClickableText>
				</Dropdown>
			</div>
		</div>
	);
}

function TestOverviewTabTopSection({ name, testInstanceData, expand }) {
	const [openVideoModal, setOpenVideoModal] = useState(false);
	const { steps } = testInstanceData;
	const { screenshotCount, checksCount } = getScreenShotsAndChecks(steps);
	const videoUrl = testInstanceData?.output?.video;
	const isVideoAvailable = !!videoUrl;

	return (
		<>
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
			<div className={"flex items-center leading-none text-15 font-600"}>
				<PassedSVG height={18} className={"mr-16"} />
				{name}
			</div>

			{/*<Conditional showIf={!expand}>*/}
			{/*	<div className={"text-18 font-600"} id={"click-to-open"} css={css`color: #aacb65;`}>*/}
			{/*		PASSED*/}
			{/*	</div>*/}
			{/*</Conditional>*/}

			<div className={"flex items-center"}>
				<span className={"text-13 mr-32"}>
					{screenshotCount} screenshot | {checksCount} check
				</span>
				<Conditional showIf={isVideoAvailable}>
					<span className={"flex text-13 mr-26"} onClick={setOpenVideoModal.bind(this, true)}>
						<PlaySVG className={"mr-10"} /> Replay recording
					</span>
				</Conditional>
				<span>
					<ChevronDown css={expand && close} />
				</span>
			</div>
		</>
	);
}

function RenderSteps({steps}: {steps:any[]}) {
	return <div className={'px-32 w-full'} css={stepsContainer}>
		<div className={'ml-32 py-32'} css={stepsList}>
			{steps.map((step, index) => (
				<RenderStep data={step} key={index} />
			))}
		</div>
	</div>;
}

function TestCard({ id, testData }: { id: string; testData: Test }) {
	const { name, testInstances } = testData;
	const [expand, setExpand] = useState(testData.status !== "PASSED" || false);
	const [sticky, setSticky] = useState(false);
	const [showLoading, setLoading] = useState(false);
	const allConfiguration = getAllConfigurationForGivenTest(testData);
	const [testCardConfig, setTestCardConfig] = useState(getBaseConfig(allConfiguration));

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

	const testIndexByFilteration = getTestIndexByConfig(testData, testCardConfig);

	const testInstanceData = testInstances[testIndexByFilteration];
	const  steps  = getStepsFromInstanceData(testInstanceData);


	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, [testCardConfig]);

	return (
		<div css={testCard} className={" flex-col mt-24 "} id={`test-card-${id}`}>
			<Conditional showIf={expand && sticky}>
				<div css={stickyCSS} className={" px-0 "} onClick={onCardClick}>
					<div css={[header, stickyContainer]} className={"test-card-header items-center w-full px-32 w-full"}>
						<TestOverviewTabTopSection name={name} testInstanceData={testInstanceData} expand={expand} />

						<div className={"mt-12 mb-16"}>
							<TestConfigSection
								expand={expand}
								allCofiguration={allConfiguration}
								testCardConfig={testCardConfig}
								setTestCardConfig={setTestCardConfig}
							/>
						</div>
					</div>
				</div>
			</Conditional>

			<div onClick={onCardClick}>
				<div className={"px-28 pb-16 w-full test-card-header"}>
					<div css={header} className={" flex justify-between items-center w-full"}>
						<TestOverviewTabTopSection name={name} testInstanceData={testInstanceData} expand={expand} />
					</div>

					<TestConfigSection
						expand={expand}
						allCofiguration={allConfiguration}
						setTestCardConfig={setTestCardConfig}
						testCardConfig={testCardConfig}
					/>
				</div>
			</div>

			<Conditional showIf={expand && !showLoading}>
				<RenderSteps steps={steps}/>
			</Conditional>

			<Conditional showIf={expand && showLoading}>
				<div className={"flex flex-col items-center w-full mt-80 mb-80"}>
					<LoadingSVG height={20} />

					<div className={"mt-12 text-13"}>Loading</div>
				</div>
			</Conditional>
		</div>
	);
}

const header = css`
	min-height: 52px;
`;

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
	overflow: hidden;

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

export default ReportSection;
