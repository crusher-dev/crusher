import * as Playwright from "playwright";

declare namespace NodeJS {
	export interface Global {
		playwright: any;
	}
}
