import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { getEdition } from "@utils/helpers";
import { atom } from "jotai";


export enum OnboardingStepEnum {
	CHOOSE = "CHOOSE",
	SETUP = "SETUP",
	SUPPORT = "SUPPORT",
	INTEGRATION = "INTEGRATION",
}

export const onboardingStepAtom = atom<OnboardingStepEnum>(getEdition() === EditionTypeEnum.EE ? OnboardingStepEnum.CHOOSE : OnboardingStepEnum.SETUP);
