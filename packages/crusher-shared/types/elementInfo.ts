import { iSelectorInfo } from "./selectorInfo";

export interface iAttribute {
	name: string;
	value: string;
}

export interface iElementInfo {
	selectors: iSelectorInfo[];
	attributes: iAttribute[];
	innerHTML: string;
	screenshot?: string;
}
