import { css } from "@emotion/react";
import React from "react";

const InfoProgressBar = ({ className, id, disableTime, total, value, label }) => {
	const [elapsedTime, setElapsedTime] = React.useState("0:00");
	const [startTime, setStartTime] = React.useState(Date.now());

	// Reset timer when id changes
	React.useEffect(() => {
		setStartTime(Date.now());
		setElapsedTime("0:00");
	}, [id]);

	React.useEffect(() => {
		const interval = setInterval(() => {
			const seconds = Math.floor((Date.now() - startTime) / 1000);
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			setElapsedTime(`${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`);
		}, 1000);
		return () => clearInterval(interval);
	}, [startTime]);

	const progress = value === 0 ? 0 : (value / total) * 100;

	return (
		<div className={className}>
			<div className={"flex items-center"}>
				<div className={"label flex items-center"} css={totalCountCss}>
					<span>
						{label}
					</span>
				</div>
				{!disableTime ? (
					<div css={timeElapsedCss}>{elapsedTime} sec</div>
				) : ""}
			</div>
			<div className={"flex  mt-8"} css={progressBarContainerCss}>
				<div
					className={"tracker-bar"}
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

const trackerBarCss = css`
	background: #a3d761;
	height: 100%;
	transition: width 0.25s;
`;
const progressBarContainerCss = css`
	background: linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), rgba(41, 41, 41, 0.19);

	border-radius: 21rem;
	position: relative;
	height: 6rem;
	overflow: hidden;
`;
const timeElapsedCss = css`
	font-weight: 500;
	font-size: 13rem;

	color: rgba(255, 255, 255, 0.49);
`;
const totalCountCss = css`
	flex: 1;

	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 500;
	font-size: 13rem;	
	color: rgba(156, 156, 156, 1);
`;

export { InfoProgressBar };