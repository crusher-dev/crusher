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
import { URLOnboarding } from '@ui/containers/onboarding/URLOnboarding';
import { InitialInfo } from '@ui/containers/onboarding/InitialInfo';

const GetViewByStep = () => {
	const [step] = useAtom(onboardingStepAtom);

	return <InitialInfo />;
	switch (step) {
		case OnboardingStepEnum.SETUP:
			return <SetupCrusher />;
		case OnboardingStepEnum.SUPPORT_CRUSHER:
			return <SupportCrusher />;
		case OnboardingStepEnum.GIT_INTEGRATION:
			return <GitRepoIntegration />;
		case OnboardingStepEnum.CLI_INTEGRATION:
			return <CliRepoIntegration />;
		default:
			return null;
	}
};

const steps = [
	{ id: OnboardingStepEnum.GIT_INTEGRATION, text: "Choose" },
	{ id: OnboardingStepEnum.CLI_INTEGRATION, text: "Create and run test" },
	{ id: OnboardingStepEnum.SUPPORT_CRUSHER, text: "Support" },
];

const CrusherOnboarding = () => {
	const router = useRouter();
	const [user] = useAtom(userAtom);
	const [selectedOnboardingStep, setOnBoardingStep] = useAtom(onboardingStepAtom);

	useEffect(() => {
		// if (getBoolean(user?.meta.INITIAL_ONBOARDING)) {
		// 	router.push("/app/dashboard");
		// }
	}, []);

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
				<div className="flex mt-100 flex-col">
					<GetViewByStep />
				</div>
			</div>
		</CrusherBase>
	);
};

const contentContainer = css`
	width: 890rem;
	margin: 0 auto;
	padding-top: 48rem;
`;

export { CrusherOnboarding };
