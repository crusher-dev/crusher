import React from "react";
import { css } from "@emotion/react";
import { FailedStepIcon } from "electron-app/src/_ui/constants/icons";
import { NormalButton } from "electron-app/src/_ui/ui/components/buttons/NormalButton";
import { continueRemainingSteps } from "electron-app/src/_ui/commands/perform";
import { deleteRecordedSteps } from "electron-app/src/store/actions/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { ActionStatusEnum } from "@shared/types/action";
import { useStore } from "react-redux";
import { useAtom } from "jotai";
import { stepHoverAtom } from "electron-app/src/_ui/store/jotai/steps";
import ToastDemo from "electron-app/src/_ui/ui/components/Toast";
import { getStore } from "electron-app/src/store/configureStore";
import { useStep } from "electron-app/src/_ui/hooks/recorder";
import { getErrorMessage } from "./helper";

export const retryStep = (stepId: number) => {
	const store = getStore();
	const savedSteps = getSavedSteps(store.getState() as any);
	if(savedSteps.length - 1 === stepId) {
		const step = savedSteps[stepId];
		store.dispatch(deleteRecordedSteps([stepId]));

		continueRemainingSteps([
			{
				...step,
				status: ActionStatusEnum.STARTED,
			},
		]);
	} else {
		console.log("Can't retry because it's not the last step");
	}
};

const FailedStepCard = ({ stepId }) => {
	const { step, deleteStep } = useStep(stepId);
	const store = useStore();
	const [stepHoverId, setStepHoverId] = useAtom(stepHoverAtom);

	const handleRetry = () => {
		retryStep(stepId);
	};

	const handleEdit = () => {
		setStepHoverId(stepId);
	};
	const handleDeleteAndContinue = () => {
		deleteStep();
		continueRemainingSteps();
	};

	if(!step) return null;
	const erorrMessage = getErrorMessage(step);

	return (
		<div css={containerCss} className={"px-12 py-16"}>
			<div css={notifyCardCss} className="flex px-16 py-11">
				<div css={cardTextCss}>
					<div css={titleCss}>{erorrMessage}</div>
					<div css={descriptionCss} className={"mt-5"}>
						Modify the step or force retry
					</div>
				</div>
				<div className={"ml-auto"}>
					<FailedStepIcon css={failedIconCss} />
				</div>
			</div>

			<div className={"flex mt-18 items-center"}>
				<NormalButton CSS={editButtonCss} className={""} onClick={handleEdit}>
					edit step
				</NormalButton>
				<NormalButton CSS={retryButtonCss} className={"ml-8"} onClick={handleRetry}>
					retry
				</NormalButton>
				{/* <div className={"ml-auto"} onClick={handleMore}><OptionsIcon css={optionsIconCss} /></div> */}
			</div>
			<div className={"flex mt-10"}>
				<div className={"ml-2"} onClick={handleDeleteAndContinue} css={linkCss}>
					delete & continue
				</div>
			</div>
		</div>
	);
};

const editButtonCss = css`
	width: 78rem !important;
	height: 26rem !important;
	background: rgba(255, 255, 255, 0.1) !important;
	border-radius: 6rem !important;
	border: none !important;

	font-family: "Gilroy" !important;
	font-style: normal !important;
	font-weight: 600 !important;
	font-size: 13rem !important;
	color: #ffffff !important;

	:hover {
		background: rgba(255, 255, 255, 0.1);
		border: none;
	}
`;

const retryButtonCss = css`
	width: 52rem !important;
	height: 26rem !important;
	background: rgba(168, 67, 246, 1) !important;
	border-radius: 6rem;

	font-family: "Gilroy" !important;
	font-style: normal !important;
	font-weight: 600 !important;
	font-size: 13rem !important;
	color: #ffffff !important;
`;
const containerCss = css`
	background: rgba(217, 217, 217, 0.03);
`;
const notifyCardCss = css`
	background: rgb(25, 16, 20);
	border: 0.5px solid #e0307a;
	border-radius: 12rem;
`;
const cardTextCss = css`
	flex: 1;
`;
const failedIconCss = css`
	width: 18rem;
	height: 18rem;
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

const linkCss = css`
	font-size: 12rem;
	text-decoration-line: underline;

	color: rgba(94, 94, 94, 0.87);
	:hover {
		opacity: 0.8;
	}
`;
export { FailedStepCard };
