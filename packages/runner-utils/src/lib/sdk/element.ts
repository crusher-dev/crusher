import { ICrusherSDKElement } from "@crusher-shared/types/sdk/element";
import { ElementHandle, Page } from "playwright";

class CrusherElementSdk implements ICrusherSDKElement {
	constructor(private _page: Page, private _element: ElementHandle) {}

	async evaluate(fun, arg) {
		return this._element.evaluate(fun, arg);
	}

	async scrollIntoView({ timeout }: { timeout?: number } = {}) {
		await this._element.scrollIntoViewIfNeeded({ timeout });
		return true;
	}

	async inputValue() {
		return this._element.inputValue();
	}

	async click() {
		await this._element.click();
		return true;
	}

	async hover() {
		await this._element.hover();
		return true;
	}

	async focus() {
		await this._element.focus();
		return true;
	}

	async fill(text: string) {
		await this._element.fill(text);
		return true;
	}

	async type(text: string, options: { delay?: number } = {}) {
		await this._element.type(text, options);
		return true;
	}

	async value() {
		return this._element.inputValue();
	}
}

export { CrusherElementSdk };
