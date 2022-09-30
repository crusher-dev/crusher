import React from "react";
import { css } from "@emotion/react";
import { EllipseIcon, ResetIcon } from "electron-app/src/_ui/constants/icons";
import { useLocalBuild } from "electron-app/src/_ui/hooks/tests";

const ProgressBar = () => {
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
		<div>
			<div className={"flex"} css={progressBarContainerCss}>
				<div
					css={[
						trackerBarCss,
						css`
							width: ${progress}%;
						`,
					]}
				></div>
			</div>
			<div className={"flex items-center mt-16"}>
				<div css={stepsLengthCss}>11 steps</div>
				<div className={"flex items-center"} css={totalCountCss}>
					<EllipseIcon css={ellipseIconCss} />
					<span className={"ml-7"}>
						{currentIndex}/{tests.length}
					</span>
				</div>
				<div css={timeElapsedCss}>{elapsedTime} sec</div>
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
	font-family: "Gilroy";
	font-style: normal;
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
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 500;
	font-size: 13rem;
	color: #ffffff;
`;
const totalCountCss = css`
	flex: 1;
	justify-content: center;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;
	color: rgba(156, 156, 156, 1);
`;
interface IProps {
	className?: string;
}
const ReplaySidebarHeader = ({ className }: IProps) => {
	const handleResetTest = () => {};

	return (
		<div className={String(className)} css={containerCss}>
			<div className={"flex"} css={headerCss}>
				<div>
					<div css={titleCss}>Running test</div>
					<div css={testNameCss} className={"mt-8"}>
						google test
					</div>
				</div>
				<div className={"flex ml-auto"}>
					<ResetIcon onClick={handleResetTest} css={[resetIconCss]} />
				</div>
			</div>
			<div css={contentCss} className="custom-scroll px-14">
				<ProgressBar />
			</div>
		</div>
	);
};

const titleCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 700;
	font-size: 15rem;
	color: #fff;
`;
const testNameCss = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
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
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding-top: 18rem;
`;
const headerCss = css`
	display: flex;
	align-items: center;
	border-bottom: 1px solid #141414;
	padding: 0rem 14rem;
	padding-bottom: 14rem;
`;

const contentCss = css`
	height: 84rem;
	padding-top: 16rem;
`;

export { ReplaySidebarHeader };
