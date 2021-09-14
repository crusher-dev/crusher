import { ICrusherSDKElement } from "@crusher-shared/types/sdk/element";
import { ElementHandle, Page } from "playwright";

class CrusherElementSdk implements ICrusherSDKElement {
	constructor(private page: Page, private element: ElementHandle) {}

	async click() {
		await this.element.click();
		return true;
	}

	async hover() {
		await this.element.hover();
		return true;
	}

	async focus() {
		await this.element.focus();
		return true;
	}

	async fill(text: string) {
		await this.element.fill(text);
		return true;
	}

	async type(text: string, options: { delay?: number } = {}) {
		await this.element.type(text, options);
		return true;
	}
}

export { CrusherElementSdk };
