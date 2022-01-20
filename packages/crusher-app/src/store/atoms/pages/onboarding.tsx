import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { getEdition } from "@utils/helpers";
import { atom } from "jotai";

export enum OnboardingStepEnum {
	GIT_INTEGRATION = "GIT_INTEGRATION",
	SETUP = "SETUP",
	SUPPORT_CRUSHER = "SUPPORT_CRUSHER",
	CLI_INTEGRATION = "CLI_INTEGRATION",
}

export const onboardingStepAtom = atom<OnboardingStepEnum>(getEdition() === EditionTypeEnum.EE ? OnboardingStepEnum.GIT_INTEGRATION : OnboardingStepEnum.SETUP);
