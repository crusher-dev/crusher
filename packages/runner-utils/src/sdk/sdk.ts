import { ICrusherSDKElement } from "@crusher-shared/types/sdk/element";
import { ICrusherSdk } from "@crusher-shared/types/sdk/sdk";
import { CrusherCookieSetPayload } from "@crusher-shared/types/sdk/types";
import { Page } from "playwright";
import { ExportsManager } from "../functions/exports";
import { CrusherElementSdk } from "./element";
import { StorageManager } from "../functions/storage";
import { chunkArray, markTestFail } from "../utils/helper";
import nodeFetch from "node-fetch";
import { CommunicationChannel } from "../functions/communicationChannel";

const pageScreenshotModule = require("../actions/pageScreenshot");

class CrusherSdk implements ICrusherSdk {
	_page: Page; // Playwright page reference
	page: Page;
	playwright: { page: Page };
	exportsManager: ExportsManager;
	storageManager: StorageManager;
	communicationChannel: CommunicationChannel;

	constructor(page: Page, exportsManager: ExportsManager, storageManager: StorageManager, communicationChannel: CommunicationChannel) {
		this._page = page;
		this.exportsManager = exportsManager;
		this.storageManager = storageManager;
		this.page = page;
		this.playwright = { page: page };
		this.communicationChannel = communicationChannel;
	}

	// <----- New sdk begins here ---->
	async screenshot({ timeout }: { timeout?: number } = {}) {
		return this._page.screenshot({ timeout: timeout });
	}

	async querySelector(selector: string, { waitUntil, timeout }: { waitUntil?: "visible" | "in-dom" | null; timeout?: number } = { waitUntil: "visible" }) {
		let elementHandle;
		if (waitUntil) {
			elementHandle = await this._page.waitForSelector(selector, { state: waitUntil === "in-dom" ? "attached" : "visible", timeout });
		} else {
			elementHandle = await this._page.$(selector);
		}
		if (!elementHandle) return null;

		return new CrusherElementSdk(this._page, elementHandle);
	}

	async url() {
		return this._page.url();
	}

	async waitForNavigation(url: string, { timeout }: { timeout?: number } = {}) {
		return this._page.waitForNavigation({ timeout: timeout, url: url });
	}

	async navigate(url: string, { timeout }: { timeout?: number } = {}) {
		return this._page.goto(url, { timeout: timeout });
	}

	async evaluate(fun, arg) {
		return this._page.evaluate(fun, arg);
	}

	async exposeFunction(funcName: string, options: any) {
		return this._page.exposeFunction(funcName, options);
	}

	async waitForFunction(fun: any, arg, options) {
		return this._page.waitForFunction(fun, arg, options);
	}

	// Legacy methods
	// @TODO: Remove them after migration
	async $(selector: string) {
		const elementHandle = await this._page.$(selector);

		return new CrusherElementSdk(this._page, elementHandle);
	}

	async $nodeWrapper() {}

	async goto(url: string) {
		return this._page.goto(url);
	}

	async reloadPage() {
		await this._page.reload({ waitUntil: "networkidle" });
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
		await this._page.context().addCookies(finalCookies);
		return true;
	}

	async fetch(url: string, options: any) {
		await this._page.evaluate(
			([url, options]) => {
				return fetch(url, options);
			},
			[url, options],
		);

		return true;
	}

	takePageScreenshot() {
		return pageScreenshotModule.handler(this._page, null, null, this.storageManager);
	}

	setExport(key: string, value: any) {
		return this.exportsManager.set(key, value);
	}

	getExport(key: string) {
		return this.exportsManager.get(key);
	}

	hasExport(key: string) {
		return this.exportsManager.has(key);
	}

	stallTest(errorMessage: string) {
		const error = new Error(errorMessage);
		(error as any).isStalled = true;
		(error as any).meta = {
			failedReason: errorMessage,
			isStalled: true,
		};

		throw error;
	}

	private async urlExist(url: string) {
		// @Todo: Remove this function
		return false;
	}

	async verifyLinks(links: Array<{ href: string }>): Promise<Array<{ href: string; exists: boolean }>> {
		const chunkedArr = chunkArray(links, 5);
		const promises = chunkedArr.map((chunk) => {
			return Promise.all(
				chunk.map(async (link) => {
					let reason = null,
						exists = null;
					try {
						exists = await this.urlExist(link.href);
					} catch (ex) {
						exists = false;
						reason = ex.message;
					}
					return { href: link.href, exists, reason };
				}),
			);
		});

		const result = [];
		for (let promise of promises) {
			const values = await promise;
			values.forEach((value: Array<{ href: string; exists: boolean }>) => {
				result.push(value);
			});
		}

		return result;
	}

	async spawnTests(payload: Array<{ testId: number; groupId: string; context: any }>) {
		this.communicationChannel.emit("run-parameterized-tests", payload);
	}

	markTestFail(reason: string, data: any) {
		markTestFail(reason, data);
	}
}

export { CrusherSdk };
