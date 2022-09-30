import { css } from "@emotion/react";
import React from "react";

import { useAtom } from "jotai";

import { Button } from "dyson/src/components/atoms";

import { setupOSS, USER_SYSTEM_API } from "@constants/api";
import { usePageTitle } from "@hooks/seo";
import { systemConfigAtom } from "@store/atoms/global/systemConfig";
import { onboardingStepAtom, OnboardingStepEnum } from "@store/atoms/pages/onboarding";
import { selectInitialProjectMutator, updateInitialDataMutator } from "@store/mutators/user";
import { backendRequest } from "@utils/common/backendRequest";

import { ModuleCard } from "./ModuleCard";

const setupOSSFn = () => {
	return backendRequest(setupOSS);
};

const SetupCrusher = () => {
	const [, setOnboardingStep] = useAtom(onboardingStepAtom);
	const [system] = useAtom(systemConfigAtom);

	const [, updateInitialData] = useAtom(updateInitialDataMutator);
	const [, selectInitialProject] = useAtom(selectInitialProjectMutator);

	usePageTitle("Setup crusher");

	React.useEffect(() => {
		const isWorkingFine = system.MONGO_DB_OPERATIONS && system.MYSQL_OPERATION && system.REDIS_OPERATION && system?.OPEN_SOURCE?.initialized;
		if (isWorkingFine) {
			setOnboardingStep(OnboardingStepEnum.GIT_INTEGRATION);
		}
	}, []);

	const onInitialSetup = React.useCallback(() => {
		(async () => {
			await setupOSSFn();

			const dataToConsider = await backendRequest(USER_SYSTEM_API, {});
			updateInitialData(dataToConsider);
			selectInitialProject(dataToConsider);

			setOnboardingStep(OnboardingStepEnum.GIT_INTEGRATION);
		})();
	}, []);

	return (
		<>
			<div className={"flex-col"}>
				<div className="text-18 leading-none mb-12 font-700">Setup Crusher</div>
				<div className="text-16 flex flex-col mb-48">
					<span className={"mb-20 leading-none text-14"}>Just need to ensure our machines are working</span>
				</div>
			</div>
			<div>
				<ModuleCard onClick={onInitialSetup.bind(this)} />
			</div>

			<Button
				css={css`
					width: 200rem;
					margin-top: 80rem;
					margin-bottom: 20rem;
					height: 34rem;
				`}
				onClick={onInitialSetup}
			>
				Install & Next
			</Button>
		</>
	);
};

export { SetupCrusher };
