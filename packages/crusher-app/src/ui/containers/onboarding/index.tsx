import { css } from "@emotion/react";
import React from "react";

import { useAtom } from "jotai";

import { Conditional } from "dyson/src/components/layouts";

import { QuestionPrompt } from "@components/molecules/QuestionPrompt";
import { USER_META_KEYS } from "@constants/USER";
import { getTestsAPI } from "@constants/api";
import { projectsAtom } from "@store/atoms/global/project";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { updateMeta } from "@store/mutators/metaData";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";

import { DeveloperInput } from "./DeveloperInput";
import { NoDeveloperInput } from "./NoDeveloperInput";
import { SelectProjectContainer } from "./selectProject";
import { usePageTitle } from "@hooks/seo";

const steps = [{ id: OnboardingStepEnum.SURVEY, text: "Setup" }];

const CrusherOnboarding = () => {
	const [selectedOnboardingStep, setOnBoardingStep] = useAtom(onboardingStepAtom);
	const [isDeveloper, setIsDeveloper] = React.useState(true);
	const [, updateOnboarding] = useAtom(updateMeta);
	const [projects] = useAtom(projectsAtom);

	usePageTitle("Install")

	React.useEffect(() => {
		const testCreatedPoll = setInterval(async () => {
			const res = await backendRequest(getTestsAPI(), { method: RequestMethod.GET });
			if (res.list?.length) {
				clearInterval(testCreatedPoll);

				updateOnboarding({
					type: "user",
					key: USER_META_KEYS.INITIAL_ONBOARDING,
					value: true,
					callback: () => {
						window.location.href = "/";
					},
				});
			}
		}, 5000);

		return () => {
			clearInterval(testCreatedPoll);
		};
	}, []);
	const handleCallback = React.useCallback((value) => {
		setIsDeveloper(value);
	}, []);

	const NoProjectContainer = (
		<div className="flex mt-60 flex-col">
			<div>
				<div css={welcomeHeadingCss}>Install Crusher in your project</div>
			</div>
			<QuestionPrompt
				css={css`
					margin-top: 60rem;
				`}
				defaultValue={isDeveloper}
				callback={handleCallback}
			/>

			{isDeveloper ? <DeveloperInput /> : <NoDeveloperInput />}
		</div>
	);

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
												color: #747474;
										  `
										: css`
												color: #747474;
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

				{projects?.length ? <SelectProjectContainer /> : NoProjectContainer}
			</div>
		</CrusherBase>
	);
};

const welcomeHeadingCss = css`
	font-family: "Cera pro";
	font-style: normal;
	font-weight: 500;
	font-size: 16rem;
	color: #d0d0d0;

	letter-spacing: .4px;
`;

const contentContainer = css`
	width: 600rem;
	margin: 0 auto;
	padding-top: 48rem;
`;

export { CrusherOnboarding };
