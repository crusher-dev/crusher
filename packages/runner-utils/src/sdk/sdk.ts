import { ICrusherSDKElement } from "@crusher-shared/types/sdk/element";
import { ICrusherSdk } from "@crusher-shared/types/sdk/sdk";
import { CrusherCookieSetPayload } from "@crusher-shared/types/sdk/types";
import { Page } from "playwright";
import { CrusherElementSdk } from "./element";

class CrusherSdk implements ICrusherSdk {
	constructor(private page: Page) {}

	async $(selector: string) {
		const elementHandle = await this.page.$(selector);

		return new CrusherElementSdk(this.page, elementHandle);
	}

	async reloadPage() {
		await this.page.reload();
		return true;
	}

	async sleep(timeout: number): Promise<boolean> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(true), timeout);
		});
	}

	async setCookies(cookies: CrusherCookieSetPayload[]) {
		const finalCookies = cookies.map((cookie) => {
			return {
				...cookie,
				url: undefined,
			};
		});
		await this.page.context().addCookies(finalCookies);
		return true;
	}

	async fetch(url: string, options: any) {
		await this.page.evaluate(
			([url, options]) => {
				return fetch(url, options);
			},
			[url, options],
		);

		return true;
	}
}

export { CrusherSdk };
