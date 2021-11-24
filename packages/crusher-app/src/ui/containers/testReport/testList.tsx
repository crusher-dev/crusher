import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "dyson/src/components/atoms";
import { ClickableText } from "dyson/src/components/atoms/clickacbleLink/Text";
import { VideoComponent } from "dyson/src/components/atoms/video/video";
import { Conditional } from "dyson/src/components/layouts";
import { Dropdown } from "dyson/src/components/molecules/Dropdown";
import { Modal } from "dyson/src/components/molecules/Modal";

import { MenuItem } from "@components/molecules/MenuItem";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { Test } from "@crusher-shared/types/response/iBuildReportResponse";
import { LoadingSVG, PlaySVG } from "@svg/dashboard";
import { ChevronDown, InfoSVG, TestStatusSVG } from "@svg/testReport";
import {
	getActionLabel,
	getAllConfigurationForGivenTest,
	getBaseConfig,
	getFailedConfigurationForTest,
	getFailedNotifyFromConfig,
	getScreenShotsAndChecks,
	getStepsFromInstanceData,
	getTestIndexByConfig,
} from "@utils/core/buildReportUtils";

import { useBuildReport } from "../../../store/serverState/buildReports";

import { sentenceCase } from "@utils/common/textUtils";
import { getAssetPath } from "@utils/helpers";
import { atomWithImmer } from "jotai/immer";
import { useAtom } from "jotai";
import { FullImageView, ShowSidebySide } from "@svg/builds";

const ReviewButtonContent = dynamic(() => import("./components/reviewBuild"));
const CompareImage = dynamic(() => import("./components/compareImages"));

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

			<Conditional showIf={stickyOverviewSection}>
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
					<TestCard key={i} id={i} testData={testData} />
				))}
			</div>
		</div>
	);
}

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

function RenderImageInfo({ data }) {
	const { meta } = data;
	const imageName = meta.outputs?.[0].name;
	const previousImage = getAssetPath(meta.outputs?.[0].targetScreenshotUrl);
	const currentImage = getAssetPath(meta.outputs?.[0].value);

	const [imageViewType, setImageViewType] = useAtom(imageViewAtom);

	if (!imageName) return null;

	console.log(meta.outputs[0]);
	return (
		<div className={"  pl-44 mt-4 text-11"} css={imageTestStep}>
			<div className={"flex justify-between text-12 mb-20 "}>
				<span>{imageName}</span>
				<div>
					<div css={imageTabCSS} className={"flex relative"}>
						<div onClick={setImageViewType.bind(this, "side")} className={`${imageViewType === "side" && "selected"}`}>
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
					<img src={currentImage} />{" "}
					<img
						src={getAssetPath(meta.outputs[0].diffImageUrl)}
						css={css`
							margin-left: 2%;
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

const imageTestStep = css`
	//img {
	//	max-width: 49%;
	//	border-radius: 6rem;
	//}
`;

function ErrorComponent({ testInstanceData, actionType, message }) {
	const videoUrl = testInstanceData?.output?.video;
	const isVideoAvailable = !!videoUrl;
	const [openVideoModal, setOpenVideoModal] = useState(false);
	return (
		<div className={"  py-16 px-22 mt-8"} css={errorBox}>
			<Conditional showIf={isVideoAvailable && openVideoModal}>
				<TestVideoUrl videoUrl={videoUrl} setOpenVideoModal={setOpenVideoModal.bind(this)} />
			</Conditional>
			<div className={"font-cera text-14 font-600 leading-none"}>Error at : {getActionLabel(actionType)}</div>
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

function RenderStep({ data, testInstanceData }) {
	const [showStepInfoModal, setShowStepInfoModal] = useState(false);
	const { status, message, actionType, meta } = data;

	const actionName = getActionLabel(actionType);
	const actionDescription = meta?.actionName ? meta.actionName : message;

	const openStepInfoModal = () => {
		setShowStepInfoModal(true);
	};

	return (
		<div className={"relative mb-32"}>
			<div className={" flex px-44"}>
				<div css={tick}>
					<TestStatusSVG type={status} height={"20rem"} width={"20rem"} />
				</div>

				<Conditional showIf={status !== "FAILED"}>
					<div className={"mt-4 flex"} css={css`
						align-items: center;
				
					`}>
						<span
							className={"text-13 font-600"}
							css={css`
								color: #d0d0d0;
							`}
						>
							{actionName}
						</span>
						<Conditional showIf={actionDescription && actionDescription.trim().length}>
							<span
								className={"text-12 ml-20"}
								css={css`
									color: #848484;
								`}
							>
								{meta?.actionName ? meta.actionName : message}
							</span>
						</Conditional>
						<span className={"ml-12"} css={css`
							:hover {
								opacity: 0.9;
							}
						`} onClick={openStepInfoModal}>
							<InfoSVG css={css`width: 12rem; height: 12rem;`}/>
						</span>
					</div>
				</Conditional>
				<Conditional showIf={status === "FAILED"}>
					<ErrorComponent testInstanceData={testInstanceData} actionType={actionType} message={message} />
				</Conditional>
			</div>

			<Conditional showIf={[ActionsInTestEnum.ELEMENT_SCREENSHOT, ActionsInTestEnum.PAGE_SCREENSHOT].includes(actionType)}>
				<RenderImageInfo data={data} />
			</Conditional>
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

function Browsers({ browsers, setConfig }) {
	return (
		<div className={"flex flex-col justify-between h-full"} onClick={() => {}}>
			<div>
				{browsers.map((name: string) => (
					<MenuItem
						css={css`
							padding: 12rem 10rem;
						`}
						label={
							<div className={"flex items-center"}>
								<img src={`/assets/img/build/browser/${name.toLowerCase()}.png`} width={"12rem"} className={"mr-12"} />
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
						width={"15rem"}
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
					<ClickableText paddingY={4} paddingX={"12rem"}>
						<div className={"flex items-center "}>
							<div className={" flex items-center  mr-8 text-13"}>
								<img src={`/assets/img/build/browser/${browserInLowerCase}.png`} width={"16rem"} className={"mr-8"} />
								<span className={"mt-1 capitalize"}>{browserInLowerCase}</span>
							</div>
							<ChevronDown width={"12rem"} />
						</div>
					</ClickableText>
				</Dropdown>
			</div>
		</div>
	);
}

function StepInfoModal({ setOpenStepInfoModal, data }) {
	const {meta, message} = data;

	const actionName = meta.actionName;


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
<hr/>
		<div className={"mt-44"}>
			<Conditional showIf={actionName}>
				<div className={"text-13 mt-8 mb-24 flex text-bold"}>
					<span css={{fontWeight: "bold"}}>Step name</span>
					<span css={{marginLeft: "auto"}}>{meta.beforeUrl}</span>
				</div>
			</Conditional>
			<Conditional showIf={meta.beforeUrl}>
				<div className={"text-13 mt-8 mb-24 flex text-bold"}>
					<span css={{fontWeight: "bold"}}>Page Url (before action)</span>
					<span css={{marginLeft: "auto"}}>{meta.beforeUrl}</span>
				</div>
			</Conditional>
			<Conditional showIf={meta.afterUrl}>
				<div className={"text-13 mt-8 mb-24 flex"}>
					<span css={{fontWeight: "bold"}}>Page Url (after action)</span>
					<span css={{marginLeft: "auto"}}>{meta.afterUrl}</span>
				</div>
			</Conditional>
			</div>
		</Modal>
	);
}

function TestVideoUrl({ setOpenVideoModal, videoUrl }) {
	return (
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
				<TestVideoUrl setOpenVideoModal={setOpenVideoModal} videoUrl={videoUrl} />
			</Conditional>
			<div className={"flex items-center leading-none text-15 font-600"}>
				<TestStatusSVG type={testInstanceData.status} height={"17rem"} className={"mr-16"} />
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
						<PlaySVG className={"mr-10"} /> Recording
					</span>
				</Conditional>
				<span>
					<ChevronDown css={expand && close} />
				</span>
			</div>
		</>
	);
}

function RenderSteps({ steps, testInstanceData }: { steps: any[]; testInstanceData: any }) {
	return (
		<div className={"px-32 w-full"} css={stepsContainer}>
			<div className={"ml-32 py-32"} css={stepsList}>
				{steps.map((step, index) => (
					<RenderStep testInstanceData={testInstanceData} data={step} key={index} />
				))}
			</div>
		</div>
	);
}

function TestCard({ id, testData }: { id: string; testData: Test }) {
	const { name, testInstances } = testData;
	const [expand, setExpand] = useState(false);
	const [showLoading, setLoading] = useState(false);
	const allConfiguration = getAllConfigurationForGivenTest(testData);
	const [testCardConfig, setTestCardConfig] = useState(getBaseConfig(allConfiguration));

	const onCardClick = () => {
		// if(expand===true){
		// 	window.scrollTo()
		// }
		setExpand(!expand);
	};

	const testIndexByFilteration = getTestIndexByConfig(testData, testCardConfig);

	const failedTestsConfiguration = getFailedConfigurationForTest(testData);
	const testInstanceData = testInstances[testIndexByFilteration];
	const steps = getStepsFromInstanceData(testInstanceData);

	useEffect(() => {
		if (failedTestsConfiguration.length >= 1) {
			setExpand(true);
		}
	}, []);

	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, [testCardConfig]);

	return (
		<div css={testCard} className={" flex-col mt-24 "} id={`test-card-${id}`}>
			<div onClick={onCardClick} className="sticky top-0 z-20">
				<div css={stickyContainer} className={"px-28 pb-16 w-full test-card-header"}>
					<div css={header} className={"flex justify-between items-center w-full"}>
						<TestOverviewTabTopSection name={name} testInstanceData={testInstanceData} expand={expand} />
					</div>

					<Conditional showIf={failedTestsConfiguration.length >= 1}>
						<div
							css={css`
								font-size: 12.8rem;
								color: #ff50c5;
							`}
						>
							{sentenceCase(`Test failed for ${getFailedNotifyFromConfig(failedTestsConfiguration)}.`)}
						</div>
					</Conditional>
					<TestConfigSection expand={expand} allCofiguration={allConfiguration} setTestCardConfig={setTestCardConfig} testCardConfig={testCardConfig} />
				</div>
			</div>

			<Conditional showIf={expand && !showLoading}>
				<RenderSteps steps={steps} testInstaceData={testInstanceData} />
			</Conditional>

			<Conditional showIf={expand && showLoading}>
				<div className={"flex flex-col items-center w-full mt-80 mb-80"}>
					<LoadingSVG height={"20rem"} />

					<div className={"mt-12 text-13"}>Loading</div>
				</div>
			</Conditional>
		</div>
	);
}

const header = css`
	min-height: 52px;
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
	height: 70rem;
	width: 100%;
	z-index: 100;

	top: 0;
	left: 0;
`;

export default ReportSection;
