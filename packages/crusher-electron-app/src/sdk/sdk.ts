import { Debugger, WebContents } from "electron";
import { ElementSdk } from "./element";
import { KeyboardImpl } from "./keyboard";
import { MouseImpl } from "./mouse";
import { session } from "electron";
import { ICrusherSdk } from "@shared/types/sdk/sdk";
import { CrusherCookieSetPayload } from "@shared/types/sdk/types";
import { CookiesSetDetails } from "electron/main";

type ElectronCompatibleCookiePayload = Omit<CrusherCookieSetPayload, "sameSite"> & {
	sameSite: Pick<CookiesSetDetails, "sameSite">;
};
export class SDK implements ICrusherSdk {
	private webContents: WebContents;
	private mouseImpl: MouseImpl;
	private keyboardImpl: KeyboardImpl;
	private cdp: Debugger;
	private mainWebContents: WebContents;

	constructor(webContents: WebContents, mainWebContents: WebContents) {
		this.webContents = webContents;
		this.cdp = webContents.debugger;
		this.mouseImpl = new MouseImpl(this.cdp);
		this.keyboardImpl = new KeyboardImpl(this.cdp);
		this.mainWebContents = mainWebContents;
	}

	private async _getNode(selector: string) {
		const functionsResult = await this.cdp.sendCommand("Runtime.evaluate", {
			expression: `window.pwQuerySelector(${JSON.stringify(selector)}, document);`,
		});

		return functionsResult;
	}

	async $(selector: string): Promise<ElementSdk> {
		const nodeResults = await this._getNode(selector);
		if (!nodeResults.result || !nodeResults.result.objectId) return undefined;
		return new ElementSdk(nodeResults.result.objectId, this.mouseImpl, this.keyboardImpl, this.cdp);
	}

	$nodeWrapper(objectId: string) {
		return new ElementSdk(objectId, this.mouseImpl, this.keyboardImpl, this.cdp);
	}

	private getCompatibleElectronSameSiteFormat(sameSite: string): Pick<CookiesSetDetails, "sameSite"> {
		switch (sameSite) {
			case "Strict":
				return "strict" as any;
			case "Lax":
				return "lax" as any;
			case "None":
				return "no_restriction" as any;
			default:
				throw new Error("Invalid sameSite type");
		}
	}

	async setCookies(cookies: Array<CrusherCookieSetPayload>): Promise<boolean> {
		const filteredCookies: Array<ElectronCompatibleCookiePayload> = cookies.map((cookie) => {
			return {
				...cookie,
				sameSite: cookie.sameSite ? this.getCompatibleElectronSameSiteFormat(cookie.sameSite) : undefined,
			};
		});

		for (const cookie of filteredCookies) {
			await session.defaultSession.cookies.set(cookie as any);
		}

		return true;
	}

	async reloadPage(): Promise<boolean> {
		await this.webContents.executeJavaScript("window.location.reload();");
		return true;
	}

	async sleep(timeout: number): Promise<boolean> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(true), timeout);
		});
	}
}
