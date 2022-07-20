/**
 * @jest-environment ./__tests__/recorder/env
 */
import playwright, { ElectronApplication, Page } from "playwright";
import path from "path";
import {getLaunchOptions} from "../utils";

jest.setTimeout(320000);
declare var recorder:  {
	init: (ignoreOnboarding?: boolean) => void;
	electronApp: ElectronApplication;
	appWindow: Page;
};

describe("Onboarding", () => {
	async function resetLocalStorageAndRestart() {
		//Empty the local storage
		await recorder.appWindow.evaluate(() => {
			localStorage.setItem("app.showShouldOnboardingOverlay", "true");
			window.location.reload();
		});
		await recorder.electronApp.close();

		await recorder.init(false);
	}

	/**
	 * Create the browser and page context
	 */
	beforeAll(async () => {
		await recorder.init(false);
		await resetLocalStorageAndRestart();
	});

	afterAll(async () => {
		await recorder.electronApp.close();
	});

	/*
	 * Test the app boot
	 */
	test("input bar is visible", async () => {
		const inputBar = await recorder.appWindow.waitForSelector(".target-site-input input");
		expect(inputBar).not.toBe(null);
	});

	/* Onboarding begins */

	test("onboarding is on by default", async () => {
		const onboarding = await recorder.appWindow.waitForSelector("#onboarding-overlay");
		expect(onboarding).not.toBe(null);
	});

	test("onboarding overlay is removed after input", async () => {
		const inputBar = await recorder.appWindow.waitForSelector(".target-site-input input");
		await inputBar.focus();
		await inputBar.type("https://google.com");
		await inputBar.press("Enter");
		const onboarding = await recorder.appWindow.$("#onboarding-overlay");
		expect(onboarding).toBe(null);
	});

	describe("skip onboarding", () => {
		beforeAll(async () => {
			await resetLocalStorageAndRestart();
		});

		test("'skip onboarding' is visible", async () => {
			const skipOnboarding = await recorder.appWindow.waitForSelector("text=Skip Onboarding");
			expect(skipOnboarding).not.toBe(null);
			expect(await skipOnboarding.isVisible()).toBe(true);
		});

		test("'skip onboarding' works", async () => {
			const skipOnboarding = await recorder.appWindow.waitForSelector("text=Skip Onboarding");
			const onboarding = await recorder.appWindow.waitForSelector("#onboarding-overlay");

			await skipOnboarding.click();

			expect(await onboarding.isVisible()).toBe(false);
			const onboardingSettingValue = await recorder.appWindow.evaluate(() => {
				return localStorage.getItem("app.showShouldOnboardingOverlay");
			});
			expect(onboardingSettingValue).toBe("false");
		});

		test("'skip onboarding' persists", async () => {
			// Wait for safe measure
			await new Promise((resolve) => setTimeout(resolve, 100));

			await recorder.electronApp.close();
			await recorder.init(false);

			const onboarding = await recorder.appWindow.$("#onboarding-overlay");
			expect(onboarding).toBe(null);
		});
	});
});
