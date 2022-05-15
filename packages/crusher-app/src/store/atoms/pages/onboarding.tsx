import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { getEdition } from "@utils/helpers";
import { atom } from "jotai";

export enum OnboardingStepEnum {
	SURVEY = "SURVEY",
	URL_ONBOARDING = "URL_ONBOARDING",
	SUPPORT_CRUSHER = "SUPPORT_CRUSHER",
	CLI_INTEGRATION = "CLI_INTEGRATION",
}

export const onboardingStepAtom = atom<OnboardingStepEnum>(getEdition() === EditionTypeEnum.EE ? OnboardingStepEnum.SURVEY : OnboardingStepEnum.SURVEY);
