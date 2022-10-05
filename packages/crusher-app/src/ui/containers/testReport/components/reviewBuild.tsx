import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

import { Button, TextBlock } from "dyson/src/components/atoms";
import Radio from "dyson/src/components/atoms/radio/radio";

import { CloseSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";
import { useBuildReport } from "crusher-app/src/store/serverState/buildReports";

import { RequestMethod } from "../../../../types/RequestOptions";

export const radioContent = [
	{ label: "Leave feedback", subLabel: "Approve without approval" },
	{ label: "Approve & set new baseline", subLabel: "Approve this build and make it baseMark" },
];

const approveBuild = (buildId: number, buildReportId: number) => {
	return backendRequest(`/builds/${buildId}/reports/${buildReportId}/actions/approve`, {
		method: RequestMethod.POST,
	});
};

export const ReviewButtonContent = ({ closeModal }) => {
	const { query } = useRouter();
	const { data } = useBuildReport(query.id);

	const [selected, setSelected] = useState(1);
	const [feedback, setFeedback] = useState(1);

	const selectOption = useCallback((index, selectedRadioButton) => {
		if (selectedRadioButton) {
			setSelected(index);
		}
	}, []);

	const handleSubmit = useCallback(async () => {
		await approveBuild(data.buildId, data.buildReportId);
		sendSnackBarEvent({
			type: "normal",
			message: "Build has been updated. Please refresh to see new changes.",
		});
		closeModal();
	}, [data]);

	return (
		<div>
			<div css={topReview} className={"font-700 py-12 px-16 leading-none mt-2 flex justify-between"}>
				<div>Submit feedback</div>
				<CloseSVG height={"12"} onClick={closeModal} />
			</div>
			<div css={middleSection} className={"px-16 pt-16 pb-4"}>
				<textarea
					id={"text-area"}
					className={"w-full"}
					value={feedback}
					onChange={(e) => {
						setFeedback(e.target.value);
					}}
				/>

				<div css={radioGroup}>
					{radioContent.map(({ label, subLabel }, i) => {
						return (
							<div className={"flex mb-12"} onClick={selectOption.bind(this, i)}>
								<Radio
									isSelected={selected === i}
									callback={selectOption.bind(this, i)}
									label={
										<div className={"ml-12"}>
											<TextBlock fontSize={12} weight={700} className="mb-4">{label}</TextBlock>

											<TextBlock fontSize={11} weight={400} color="#696969" className="lowercase">{subLabel}</TextBlock>
										</div>
									}
								/>
							</div>
						);
					})}
				</div>
			</div>
			<div className={"px-16 py-12"}>
				<Button
					size={"small"}
					css={css`
						width: 120rem;
					`}
					onClick={handleSubmit}
				>
					Submit
				</Button>
			</div>
		</div>
	);
};

const radioGroup = css`
	color: #d2d2d2;
	font-size: 12rem;
`;

const topReview = css`
	color: #fff;
	font-size: 13.4rem;
`;

const middleSection = css`
	border-top: 1px solid #22262b;

	border-bottom: 1px solid #22262b;
	background: rgba(0, 0, 0, 0.25);

	#text-area {
		height: 104rem;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 4px;
		font-size: 13rem;
		margin-bottom: 12rem;
		padding: 8rem;
		max-height: 160rem;
	}
`;

export default ReviewButtonContent;
