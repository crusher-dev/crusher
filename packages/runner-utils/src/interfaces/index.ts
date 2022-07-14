import { iAction } from "@crusher-shared/types/action";
import { Page, ElementHandle } from "playwright";

export enum SelectorTypeEnum {
	ID = "id",
	PLAYWRIGHT = "playwright",
	DATA_ATTRIBUTE = "dataAttribute",
	ATTRIBUTE = "attribute",
	INNER_VALUE = "innerValue",
	PNC = "PnC",
}

export type IFoundSelectorInfo = {
	elementHandle: ElementHandle;
	workingSelector: {
		value: string;
		type: SelectorTypeEnum;
	};
};

export type IElementActionPayload = (elementHandle: ElementHandle, action: iAction) => Promise<void>;
export type IPageActionPayload = (page: Page, action: iAction) => Promise<void>;
