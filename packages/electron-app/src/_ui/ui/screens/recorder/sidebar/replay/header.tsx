import React from "react";
import { css } from "@emotion/react";
import { EllipseIcon, ResetIcon } from "electron-app/src/_ui/constants/icons";
import { useLocalBuild } from "electron-app/src/_ui/hooks/tests";
import { getCurrentTestInfo, getRemainingSteps } from "electron-app/src/store/selectors/app";
import { useSelector } from "react-redux";
import { getAllSteps, getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { InfoProgressBar } from "electron-app/src/_ui/ui/components/progressBar/InfoProgressBar";

const BuildProgressBar = ({className}) => {
	const { currentBuild } = useLocalBuild();
	const [elapsedTime, setElapsedTime] = React.useState("0:00");
	const { tests, queuedTests } = currentBuild;

	const currentIndex = tests.length - queuedTests.length;
	const progress = currentIndex === 0 ? 0 : (currentIndex / tests.length) * 100;

	React.useEffect(() => {
		const interval = setInterval(() => {
			const seconds = Math.floor((Date.now() - currentBuild.time) / 1000);
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			setElapsedTime(`${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`);
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<div className={className}>
			<div className={"flex items-center"}>
				<div className={"flex items-center"} css={totalCountCss}>
					<span className={"ml-7"}>
						{currentIndex}/{tests.length}
					</span>
				</div>
				<div css={timeElapsedCss}>{elapsedTime} sec</div>
			</div>
			<div className={"flex  mt-8"} css={progressBarContainerCss}>
				<div
					css={[
						trackerBarCss,
						css`
							width: ${progress}%;
						`,
					]}
				></div>
			</div>
		</div>
	);
};

const TestProgressBar = ({testId, className, steps}) => {
	const [elapsedTime, setElapsedTime] = React.useState("0:00");
	const [startTime, setStartTime] = React.useState(Date.now());
	const savedSteps = useSelector(getSavedSteps);

	React.useEffect(()=>{
		setStartTime(Date.now());
		setElapsedTime("0:00");
	}, [testId]);

	const currentIndex = savedSteps.length;
	const progress = currentIndex === 0 ? 0 : (currentIndex / steps.length) * 100;

	React.useEffect(() => {
		const interval = setInterval(() => {
			const seconds = Math.floor((Date.now() - startTime) / 1000);
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			setElapsedTime(`${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`);
		}, 1000);
		return () => clearInterval(interval);
	}, [startTime]);
	return (
		<div className={className}>
			<div className={"flex items-center"}>
				<div className={"flex items-center"} css={totalCountCss}>
					<span className={"ml-7"}>
						{currentIndex}/{steps.length}
					</span>
				</div>
				<div css={timeElapsedCss}>{elapsedTime} sec</div>
			</div>
			<div className={"flex mt-8"} css={progressBarContainerCss}>
				<div
					css={[
						trackerBarCss,
						css`
							background: #AC43FF;
							width: ${progress}%;
						`,
					]}
				></div>
			</div>
		</div>
	);
};

const trackerBarCss = css`
	background: #a3d761;
	height: 100%;
`;
const progressBarContainerCss = css`
	background: rgba(41, 41, 41, 0.19);
	border-radius: 21rem;
	position: relative;
	height: 6rem;
	overflow: hidden;
`;
const timeElapsedCss = css`
	font-weight: 500;
	font-size: 13rem;

	color: #ffffff;
`;
const ellipseIconCss = css`
	width: 10rem;
	height: 10rem;
	margin-top: -4rem;
`;
const stepsLengthCss = css`
	font-weight: 500;
	font-size: 13rem;
	color: #ffffff;
`;
const totalCountCss = css`
	flex: 1;

	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 500;
	font-size: 13rem;	
	color: rgba(156, 156, 156, 1);
`;
interface IProps {
	className?: string;
}
const ReplaySidebarHeader = ({ className }: IProps) => {
	const testInfo = useSelector(getCurrentTestInfo);
	const {currentBuild} = useLocalBuild();
	const savedSteps = useSelector(getSavedSteps);

	const testInfoProgressBar = {
		current: savedSteps ? savedSteps?.length : 0,
		total: testInfo?.steps? testInfo.steps.length : 0,
	};
	const buildProgressBar = {
		current: currentBuild ? currentBuild?.tests?.length - currentBuild?.queuedTests?.length : 0,
		total: currentBuild ? currentBuild?.tests?.length :0,
	};
	console.log("asdhjkasd", currentBuild);
	return (
		<div className={String(className)} css={containerCss}>
			<div className={"flex"} css={headerCss}>
				<div>
					<div css={titleCss}>Running test</div>
					<div css={testNameCss} className={"mt-8"}>
						{testInfo?.testName || ""}
					</div>
				</div>
				<div className={"flex ml-auto"}>
				</div>
			</div>
			<div css={contentCss} className="flex items-center px-14">
				<InfoProgressBar
					css={css`& .tracker-bar { background: #AC43FF; } `}
					label={`${testInfoProgressBar.current}/${testInfoProgressBar.total} steps`}
					id={testInfo?.id}
					total={testInfoProgressBar.total}
					value={testInfoProgressBar.current}
					className={"flex-1"} />
				<InfoProgressBar
					css={css`& .label { justify-content: center }`}
					disableTime={true}
					label={`${buildProgressBar.current}/${buildProgressBar.total} tests`}
					total={buildProgressBar.total}
					value={buildProgressBar.current}
					className={"flex-1"} />
			</div>
		</div>
	);
};

const titleCss = css`
	font-weight: 700;
	font-size: 15rem;
	color: #fff;
`;
const testNameCss = css`
	font-size: 12rem;
	color: rgb(156, 156, 156);
`;

const resetIconCss = css`
	width: 13rem;
	height: 13rem;
	:hover {
		opacity: 0.8;
	}
`;
const containerCss = css`
	display: flex;
	flex-direction: column;
	padding-top: 18rem;
`;
const headerCss = css`
	height: 53rem;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #141414;
	padding: 0rem 14rem;
	padding-bottom: 14rem;
`;

const contentCss = css`
	height: 84rem;
	padding-top: 16rem;
	gap: 20rem;
`;

export { ReplaySidebarHeader };
