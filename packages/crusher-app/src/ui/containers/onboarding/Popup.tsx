import { css } from "@emotion/core";
import { DropDown } from "@ui/components/project/DropDown";
import { PERSON_TYPE, WHY_HERE } from "@interfaces/OnboardingScreen";
import React, { useEffect, useState } from "react";
import { _addUserMeta } from "@services/user";
import { SURVEY_FIELDS, USER_STEP } from "@constants/backend";
import { validateSurveyData } from "@utils/validation";
import { useSelector } from "react-redux";
import { getUserInfo } from "@redux/stateUtils/user";

const roleOptions = Object.keys(PERSON_TYPE).map((key) => {
	return { value: key, label: PERSON_TYPE[key] };
});

const whyHereOption = Object.keys(WHY_HERE).map((key) => {
	return { value: key, label: WHY_HERE[key] };
});

function UserWelcomeInfo({ setFilledSurvey }: any) {
	const [role, setRole] = useState(null);
	const [objective, setObjective] = useState(null);

	const submitWelcomeData = () => {
		if (!validateSurveyData(role!, objective!)) {
			alert("Please select all the value");
			return;
		}

		_addUserMeta([
			{ key: SURVEY_FIELDS.ROLE, value: role },
			{
				key: SURVEY_FIELDS.OBJECTIVE,
				value: JSON.stringify(Object.values(objective!)),
			},
			{ key: USER_STEP.SURVEY_FILLED, value: true },
		])
			.then(() => {
				setFilledSurvey(true);
			})
			.catch((e: Error) => {
				console.error(e);
			});
	};

	return (
		<>
			<div css={modalHeading}>Welcome To Crusher</div>
			<div css={illustrationContainer}>
				<img
					src={"/assets/img/illustration/welcome_illustration.png"}
					css={welcomeIllustration}
				/>
			</div>

			<div css={optionContainer}>
				<div css={selectionHeading}> What is your role?</div>
				<DropDown
					options={roleOptions}
					width={"100%"}
					onChange={setRole}
					selected={role}
				/>
			</div>

			<div css={optionContainer}>
				<div css={selectionHeading}>What brings you to crusher today?</div>
				<DropDown
					options={whyHereOption}
					width={"100%"}
					isMulti
					onChange={setObjective}
					selected={objective}
				/>
			</div>

			<div css={bottomContainer}>
				<div css={submitButton} onClick={submitWelcomeData}>
					Submit
				</div>
			</div>
		</>
	);
}

function FreeTrialIntro({ setFilledUserWelcome }: any) {
	const userInfo = useSelector(getUserInfo);

	const startFreeTrial = () => {
		_addUserMeta([{ key: USER_STEP.FREE_TRIAL, value: true }])
			.then(() => {
				setFilledUserWelcome(true);
			})
			.catch((e: Error) => {
				console.error(e);
			});
	};

	return (
		<>
			<div css={modalHeading}>Start your 21 Days Free Trial</div>
			<div css={modalDescription}>
				Experience power of no-code testing without any interruption
			</div>

			<div css={welcomeUserText}>👋 Welcome {userInfo.first_name}!</div>

			<div css={welcomeIntro}>
				If you have feature request, encounter a bug or want to discuss
				<br />
				about an adventure sport. I’m available 24/7 for a nice conversation.
			</div>

			<div css={shipContainer}>Let’s ship 🚀 on web faster with confidence.</div>

			<div css={founderBlock}>
				<img
					css={founderImage}
					src={"/assets/img/illustration/himanshu_illustrated.png"}
				/>

				<div css={founderDescription}>
					<div css={founderName}>Himanshu Dixit</div>
					<div css={founderPost}>Cofounder, Crusher</div>
				</div>
			</div>

			<div css={bottomContainer}>
				<div css={submitButton} onClick={startFreeTrial}>
					Start Testing
				</div>
			</div>
		</>
	);
}

export const OnboardingPopup = () => {
	const [filledSurvey, setFilledSurvey] = useState(false);
	const [, setFilledUserWelcome] = useState(false);
	const [canPopupOpen] = useState(true);
	const userInfo = useSelector(getUserInfo);

	// Close popup if both closed
	useEffect(() => {});

	const isSurveyFilled =
		userInfo.user_meta.length > 0 &&
		userInfo.user_meta.filter(
			(item: any) => item.key_name === USER_STEP.SURVEY_FILLED,
		).length === 1;

	const isUserWelcomed =
		userInfo.user_meta.length > 0 &&
		userInfo.user_meta.filter(
			(item: any) => item.key_name === USER_STEP.FREE_TRIAL,
		).length === 1;

	// Based on API and current actions
	const showPopup = !(isUserWelcomed && isSurveyFilled) && canPopupOpen;
	if (!showPopup) return null;

	return (
		<div css={overlay}>
			<div css={modalContainer}>
				{!isSurveyFilled && !filledSurvey ? (
					<UserWelcomeInfo setFilledSurvey={setFilledSurvey} />
				) : null}
				{(isSurveyFilled || filledSurvey) && !isUserWelcomed ? (
					<FreeTrialIntro setFilledUserWelcome={setFilledUserWelcome} />
				) : null}
			</div>
		</div>
	);
};

const overlay = css`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 1000;
	background: rgba(27, 26, 28, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
`;

const modalContainer = css`
	width: 37.43rem;
	min-height: 27.43rem;
	border-radius: 0.5rem;
	background: #fff;
	padding: 2.5rem 2.1rem;
`;

const modalHeading = css`
	font-size: 1.5rem;
	font-family: "Cera Pro";
	font-weight: 800;
	line-height: 1.5rem;
	color: #2f2f2f;
`;

const selectionHeading = css`
	font-size: 1.05rem;
	font-family: "Cera Pro";
	font-weight: 600;
	line-height: 1.05rem;
	color: #2b2b39;
	margin-bottom: 0.65rem;
`;

const welcomeIllustration = css`
	height: 12.62rem;
`;

const illustrationContainer = css`
	display: flex;
	justify-content: center;
	margin-bottom: 2.5rem;
	margin-top: 2.5rem;
`;

const submitButton = css`
	padding: 0.5rem 0;
	min-width: 11rem;
	border-radius: 0.25rem;
	background: #6583fe;
	align-items: center;

	font-family: Gilroy;
	text-align: center;
	font-weight: 700;
	font-size: 1.05rem;
	color: #fff;

	cursor: pointer;
`;

const bottomContainer = css`
	display: flex;
	justify-content: flex-end;
	margin-top: 1.67rem;
`;

const optionContainer = css`
	margin-bottom: 1.5rem;
`;

const modalDescription = css`
	font-size: 1rem;
	font-family: Gilroy;
	font-weight: 400;
	line-height: 1.5rem;
	color: #2f2f2f;
	margin-bottom: 2.5rem;
	margin-top: 1rem;
`;

const welcomeUserText = css`
	font-size: 1.25rem;
	font-family: Gilroy;
	font-weight: 700;
	line-height: 1.25rem;
	margin-bottom: 1.5rem;
	color: #2b2b39;
`;

const welcomeIntro = css`
	font-size: 1rem;
	font-family: Gilroy;
	margin-bottom: 1.5rem;
	color: #2b2b39;
`;

const shipContainer = css`
	font-size: 1rem;
	font-family: Gilroy;
	margin-bottom: 2rem;
	color: #2b2b39;
	font-weight: 700;
`;

const founderBlock = css`
	display: flex;
`;

const founderImage = css`
	height: 3.2rem;
`;

const founderDescription = css``;

const founderName = css`
	font-size: 16px;
	color: #000000;
	font-weight: 600;
	letter-spacing: 0.01em;
`;

const founderPost = css``;
