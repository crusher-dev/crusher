import { iSelectorInfo } from "./selectorInfo";

export interface iAttribute {
	name: string;
	value: string;
}

export interface iElementInfo {
	selectors: Array<iSelectorInfo>;
	attributes: Array<iAttribute>;
	innerHTML: string;
	capturedElementScreenshot?: string;
}
