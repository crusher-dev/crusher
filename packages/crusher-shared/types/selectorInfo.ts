import { ElementHandle } from "playwright";
export interface iSelectorInfo {
	type: string;
	value: string;
	uniquenessScore?: number;
}
