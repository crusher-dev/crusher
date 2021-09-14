import { ICrusherSDKElement } from "./element";
import { CrusherCookieSetPayload } from "./types";

export interface ICrusherSdk {
	$: (selector: string) => Promise<ICrusherSDKElement>;
	reloadPage: () => Promise<boolean>;
	sleep: (timeout: number) => Promise<boolean>;
	setCookies: (cookies: Array<CrusherCookieSetPayload>) => Promise<boolean>;
}
