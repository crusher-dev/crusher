import playwright, { ElectronApplication, Page } from "playwright";
import path from "path";
import {getLaunchOptions} from "./utils";

jest.setTimeout(320000);
const VARIANT = (process.env.VARIANT || "dev").toLocaleLowerCase();

describe("Onboarding", () => {
	let electronApp: ElectronApplication = null;
	let appWindow: Page = null;

	async function init() {
		electronApp = await playwright["_electron"].launch(getLaunchOptions());

		appWindow = await electronApp.firstWindow();
		await appWindow.waitForLoadState();
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	async function resetLocalStorageAndRestart() {
		//Empty the local storage
		await appWindow.evaluate(() => {
			localStorage.setItem("app.showShouldOnboardingOverlay", "true");
			window.location.reload();
		});
		await electronApp.close();

		await init();
	}

	/**
	 * Create the browser and page context
	 */
	beforeAll(async () => {
		await init();
		await resetLocalStorageAndRestart();
	});

	afterAll(async () => {
		await electronApp.close();
	});

	/*
	 * Test the app boot
	 */
	test("input bar is visible", async () => {
		const inputBar = await appWindow.waitForSelector(".target-site-input input");
		expect(inputBar).not.toBe(null);
	});

	/* Onboarding begins */

	test("onboarding is on by default", async () => {
		const onboarding = await appWindow.waitForSelector("#onboarding-overlay");
		expect(onboarding).not.toBe(null);
	});

	test("onboarding overlay is removed after input", async () => {
		const inputBar = await appWindow.waitForSelector(".target-site-input input");
		await inputBar.focus();
		await inputBar.type("https://google.com");
		await inputBar.press("Enter");
		const onboarding = await appWindow.$("#onboarding-overlay");
		expect(onboarding).toBe(null);
	});

	describe("skip onboarding", () => {
		beforeAll(async () => {
			await resetLocalStorageAndRestart();
		});

		test("'skip onboarding' is visible", async () => {
			const skipOnboarding = await appWindow.waitForSelector("text=Skip Onboarding");
			expect(skipOnboarding).not.toBe(null);
			expect(await skipOnboarding.isVisible()).toBe(true);
		});

		test("'skip onboarding' works", async () => {
			const skipOnboarding = await appWindow.waitForSelector("text=Skip Onboarding");
			const onboarding = await appWindow.waitForSelector("#onboarding-overlay");

			await skipOnboarding.click();

			expect(await onboarding.isVisible()).toBe(false);
			const onboardingSettingValue = await appWindow.evaluate(() => {
				return localStorage.getItem("app.showShouldOnboardingOverlay");
			});
			expect(onboardingSettingValue).toBe("false");
		});

		test("'skip onboarding' persists", async () => {
			// Wait for safe measure
			await new Promise((resolve) => setTimeout(resolve, 100));

			await electronApp.close();
			await init();

			const onboarding = await appWindow.$("#onboarding-overlay");
			expect(onboarding).toBe(null);
		});
	});
});
