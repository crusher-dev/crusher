import React from "react";
import { css } from "@emotion/react";
import { FailedStepIcon } from "electron-app/src/_ui/constants/icons";
import { NormalButton } from "electron-app/src/_ui/ui/components/buttons/NormalButton";
import { continueRemainingSteps } from "electron-app/src/_ui/commands/perform";

const PausedStepCard = () => {
	const handleContinue = () => {
		continueRemainingSteps();
	}
	return (
		<div css={containerCss} className={"px-12 py-16"}>
			<div css={notifyCardCss} className="flex px-16 py-11">
				<div css={cardTextCss}>
					<div css={titleCss}>step paused</div>
					<div css={descriptionCss} className={"mt-5"}>
						element info couldn't be found
					</div>
				</div>
				<div className={"ml-auto"}>
					<FailedStepIcon css={failedIconCss} />
				</div>
			</div>

			<div className={"flex mt-18 items-center justify-end"}>
				<NormalButton CSS={retryButtonCss} className={"ml-8"} onClick={handleContinue}>
					continue
				</NormalButton>
				{/* <div className={"ml-auto"} onClick={handleMore}><OptionsIcon css={optionsIconCss} /></div> */}
			</div>
		</div>
	);
};


const retryButtonCss = css`
	width: 52rem !important;
	height: 26rem !important;
	background: rgba(168, 67, 246, 1) !important;
	border-radius: 6rem;
	font-weight: 600 !important;
	font-size: 13rem !important;
	color: #ffffff !important;
`;
const containerCss = css`
	background: #000;
`;
const notifyCardCss = css`
	background: linear-gradient(0deg, rgba(90, 196, 255, 0.12), rgba(90, 196, 255, 0.12));
	border: 0.5px solid #5AC4FF;
	border-radius: 12rem;
`;
const cardTextCss = css`
	flex: 1;
`;
const failedIconCss = css`
	width: 18rem;
	height: 18rem;
	path {
		fill: #5AC4FF;
	}
`;
const titleCss = css`
	font-weight: 700;
	font-size: 14rem;
	color: #ffffff;
`;
const descriptionCss = css`
	font-size: 12rem;

	color: rgba(255, 255, 255, 0.52);
`;

export { PausedStepCard };
