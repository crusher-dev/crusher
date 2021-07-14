import React, { useCallback } from "react";
import { css } from "@emotion/core";
import { CenterLayout } from "dyson/src/components/layouts";
import CrusherBase from "crusher-app/src/ui/layout/CrusherBase";
import { Button, DiscordSocialBtn, GithubSocialBtn } from "dyson/src/components/atoms";
import { getEdition } from "../../../utils/helpers";
import { EDITION_TYPE } from "@crusher-shared/types/common/general";
import { atom, useAtom } from "jotai";
import { ModuleCard } from "@ui/containers/onboarding/ModuleCard";
import { usePageTitle } from '../../../hooks/seo';

enum ONBOARDING_STEP {
	SETUP,
	TUTORIAL,
	SUPPORT,
}

const onboardingStepAtom = atom<ONBOARDING_STEP>(getEdition() === EDITION_TYPE.EE ? ONBOARDING_STEP.TUTORIAL : ONBOARDING_STEP.SETUP);

const SetupCrusher = () => {
	const [_, setOnboardingStep] = useAtom(onboardingStepAtom);

	usePageTitle("Setup Crusher")
	return (
		<>
			<div className="m-8 text-18 leading-none mb-12 font-700">Setup Crusher</div>
			<div className="text-16 flex flex-col items-center mb-48">
				<span className={"mb-20 leading-none text-14"}>Just need to ensure our machines are working</span>
			</div>

			<div>
				<ModuleCard />
			</div>

			<Button
				css={css`
					width: 200rem;
					margin-top: 320rem;
					margin-bottom: 20rem;
					height: 34rem;
				`}
				onClick={setOnboardingStep.bind(this, ONBOARDING_STEP.TUTORIAL)}
			>
				Next
			</Button>
		</>
	);
};

const HowItWorksView = () => {
	const [_, setOnboardingStep] = useAtom(onboardingStepAtom);

	usePageTitle("How it works?")

	return (
		<>
			<div className="m-8 text-18 leading-none mb-36 font-700">How it works in 60 seconds?</div>
			<div
				className="rounded-10"
				css={css`
					background-color: #191e22;
					height: 400rem;
					width: 544rem;
					overflow: hidden;
				`}
			>
				<video width="100%" controls height={"544rem"} autoPlay={true}>
					<source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
					Your browser does not support HTML video.
				</video>
			</div>

			<Button
				className="mt-42"
				css={css`
					width: 220px;
					height: 34rem;
				`}
				onClick={setOnboardingStep.bind(this, ONBOARDING_STEP.SUPPORT)}
			>
				Next
			</Button>
		</>
	);
};

const GithubDiscordSection = () => {
	const openLinkInNewTab = useCallback((url) => {
		window.open(url, "_blank").focus();
	}, []);

	usePageTitle("Support")

	return (
		<>
			<div className="mb-56 text-17 text-center font-400">
				"We help devs ship HQ fast. We do this by eliminating chores and removing noise from their workflow."
			</div>
			<div className=" text-16 font-600 flex flex-col items-center mb-56">
				<span className={"mb-20 leading-none"}>If you like crusher, give it a star 🔯</span>
				<div>
					<GithubSocialBtn count={234} onClick={openLinkInNewTab.bind(this, "https://github.com/crusherdev/crusher")} />
				</div>
			</div>
			<div className="text-16 flex flex-col items-center">
				<span className={"mb-20 leading-none font-600 "}>Join us the community of builders</span>
				<div>
					<DiscordSocialBtn count={234} onClick={openLinkInNewTab.bind(this, "https://discord.com")} />
				</div>
			</div>

			<Button
				className="mt-100"
				css={css`
					width: 220px;
					height: 34rem;
				`}
			>
				Open Dashboard
			</Button>
		</>
	);
};

const GetViewByStep = () => {
	const [step] = useAtom(onboardingStepAtom);
	switch (step) {
		case 0:
			return <SetupCrusher />;
		case 1:
			return <HowItWorksView />;
		case 2:
			return <GithubDiscordSection />;
		default:
			return null;
	}
};

const CrusherOnboarding = () => {
	return (
		<CrusherBase>
			<CenterLayout className={"pb-120"}>
				<div className="flex flex-col items-center" css={containerCSS}>
					<GetViewByStep />
				</div>
			</CenterLayout>
		</CrusherBase>
	);
};

const containerCSS = css`
	max-width: 473rem;
`;

export { CrusherOnboarding };
