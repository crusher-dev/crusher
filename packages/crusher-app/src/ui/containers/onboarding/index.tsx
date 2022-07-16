import { css } from "@emotion/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { useAtom } from "jotai";
import { Conditional } from "dyson/src/components/layouts";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

import { userAtom } from "../../../store/atoms/global/user";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { CliRepoIntegration } from "./cliIntegration";
import { SetupCrusher } from "./setup";
import { SupportCrusher } from "./support";
import { GitRepoIntegration } from "./gitRepoIntegration";
import { URLOnboarding } from "@ui/containers/onboarding/URLOnboarding";
import { SurveyContainer } from "@ui/containers/onboarding/Survey";
import { getBoolean } from "@utils/common";
import { QuestionPrompt } from "@components/molecules/QuestionPrompt";
import { DeveloperInput } from "./DeveloperInput";
import { NoDeveloperInput } from "./NoDeveloperInput";
import { backendRequest } from "@utils/common/backendRequest";
import { getTestListAPI, getTestsAPI } from "@constants/api";
import { RequestMethod } from "@types/RequestOptions";
import { currentProject, projectsAtom } from "@store/atoms/global/project";
import { USER_META_KEYS } from "@constants/USER";
import { updateMeta } from "@store/mutators/metaData";
import { SelectProjectContainer } from "./selectProject";

const GetViewByStep = () => {
	const [step] = useAtom(onboardingStepAtom);

	switch (step) {
		case OnboardingStepEnum.SURVEY:
			return <SurveyContainer />;
		case OnboardingStepEnum.URL_ONBOARDING:
			return <URLOnboarding />;
		case OnboardingStepEnum.SUPPORT_CRUSHER:
			return <SupportCrusher />;
		default:
			return null;
	}
};

const steps = [
	{ id: OnboardingStepEnum.SURVEY, text: "Setup" },
];

const CrusherOnboarding = () => {
	const router = useRouter();
	const [project] = useAtom(currentProject);
	const [user] = useAtom(userAtom);
	const [selectedOnboardingStep, setOnBoardingStep] = useAtom(onboardingStepAtom);
	const [isDeveloper, setIsDeveloper] = React.useState(true);
	const [, updateOnboarding] = useAtom(updateMeta);
	const [projects, setProjectsAtom] = useAtom(projectsAtom);

	React.useEffect(() => {
		const testCreatedPoll = setInterval(async () => {
			const res = await backendRequest(getTestsAPI(), { method: RequestMethod.GET });
			if (res.list && res.list.length) {
				clearInterval(testCreatedPoll);

				updateOnboarding({
					type: "user",
					key: USER_META_KEYS.INITIAL_ONBOARDING,
					value: true,
					callback: () => {
						window.location.href = "/";
					}
				});
			}
		}, 5000);

		return () => {
			clearInterval(testCreatedPoll);
		}
	}, []);
	const handleCallback = React.useCallback((value) => {
		setIsDeveloper(value);
	}, []);

	const NoProjectContainer = (				<div className="flex mt-60 flex-col">
	<div>
		<div css={welcomeHeadingCss}>Welcome Himanshu!</div>
		<div css={welcomeTaglineCss}>No project found, create project</div>
	</div>
	<QuestionPrompt css={css`margin-top: 60rem;`} defaultValue={isDeveloper} callback={handleCallback}/>

	{isDeveloper ? ( <DeveloperInput/>) : (<NoDeveloperInput/>)}
</div>);

	return (
		<CrusherBase>
			<div css={contentContainer}>
				<div className={"flex items-center"}>
					{steps.map((_step, i) => (
						<div className={"flex items-center"}>
							<div
								onClick={setOnBoardingStep.bind(this, _step.id)}
								className={`text-13 leading-none`}
								css={[
									_step.id === selectedOnboardingStep
										? css`
												color: #9f72ff;
										  `
										: css`
												color: #515151;
										  `,
									css`
										:hover {
											opacity: 0.7;
										}
									`,
								]}
							>
								{_step.text}
							</div>
							<Conditional showIf={i < steps.length - 1}>
								<div
									css={css`
										min-height: 2px;
										min-width: 40px;
										background: #515151;
									`}
									className={"mr-20 ml-20"}
								></div>
							</Conditional>
						</div>
					))}
				</div>
					
					{projects && projects.length ? (
						<SelectProjectContainer/>
					) : NoProjectContainer}
					

			</div>
		</CrusherBase>
	);
};

const welcomeTaglineCss = css`
font-family: 'Gilroy';
font-style: normal;
font-weight: 400;
font-size: 13rem;
/* identical to box height, or 119% */

letter-spacing: -0.003em;
color: rgba(220, 220, 220, 0.38);
margin-top: 8rem;
`;

const welcomeHeadingCss = css`
	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 700;
	font-size: 20rem;
	/* identical to box height, or 90% */

	letter-spacing: -0.003em;
`;

const contentContainer = css`
	width: 890rem;
	margin: 0 auto;
	padding-top: 48rem;
`;

export { CrusherOnboarding };
