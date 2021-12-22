import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { ActionStatusEnum, IRunnerLogStepMeta } from "../../lib/runnerLog/interface";

export enum EditionTypeEnum {
	EE = "enterprise",
	OPEN_SOURCE = "open-source",
}

export enum HostingTypeEnum {
	SELF = "self",
	CLOUD = "cloud",
}

export interface IActionResultItem {
	actionType: ActionsInTestEnum;
	status: ActionStatusEnum;
	message: string;
	meta: IRunnerLogStepMeta;
}

export type IActionResultItemWithIndex = IActionResultItem & { actionIndex: number };

export type ISavedActionResultItemWithIndex = IActionResultItemWithIndex & { recordId: number; screenshotIndex: string | number };
