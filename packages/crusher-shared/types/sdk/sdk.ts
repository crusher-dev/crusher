import { ICrusherSDKElement } from "./element";
import { CrusherCookieSetPayload } from "./types";

export interface ICrusherSdk {
	$: (selector: string) => Promise<ICrusherSDKElement>;
	reloadPage: () => Promise<boolean>;
	sleep: (timeout: number) => Promise<boolean>;
	setCookies: (cookies: CrusherCookieSetPayload[]) => Promise<boolean>;
	verifyLinks: (links: { href: string }[]) => Promise<{ href: string; exists: boolean }[]>;
	takePageScreenshot: () => Promise<{
		customLogMessage: string;
		outputs: { name: string; value: string }[];
	}>;
	fetch?: (uri: string, options: any) => Promise<boolean>;
	markTestFail: (reason: string, dat: any) => void;
}
