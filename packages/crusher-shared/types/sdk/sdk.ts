import { ICrusherSDKElement } from "./element";
import { CrusherCookieSetPayload } from "./types";

export interface ICrusherSdk {
	$: (selector: string) => Promise<ICrusherSDKElement>;
	reloadPage: () => Promise<boolean>;
	sleep: (timeout: number) => Promise<boolean>;
	setCookies: (cookies: Array<CrusherCookieSetPayload>) => Promise<boolean>;
	fetch?: (uri: string, options: any) => Promise<boolean>;
	markTestFail: (reason: string, dat: any) => void;
}
export interface ICrusherSdkV2 {
	$: (selector: string) => Promise<ICrusherSDKElement>;
	reloadPage: () => Promise<boolean>;
	sleep: (timeout: number) => Promise<boolean>;
	setCookies: (cookies: Array<CrusherCookieSetPayload>) => Promise<boolean>;
	verifyLinks: (links: Array<{ href: string }>) => Promise<Array<{ href: string; exists: boolean }>>;
	takePageScreenshot: () => Promise<{
		customLogMessage: string;
		outputs: Array<{ name: string; value: string }>;
	}>;
	fetch?: (uri: string, options: any) => Promise<boolean>;
	markTestFail: (reason: string, dat: any) => void;
}
