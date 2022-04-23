import playwright, { ElectronApplication, ElementHandle, Page } from "playwright";
import path, { resolve } from "path";
import { devices } from "../src/devices";
import { ActionStatusEnum } from "../../crusher-shared/lib/runnerLog/interface";
import { ActionsInTestEnum } from "../../crusher-shared/constants/recordedActions";

jest.setTimeout(30000);

const VARIANT = (process.env.VARIANT || "dev").toLocaleLowerCase();
describe("Recorder boot", () => {
	let electronApp: ElectronApplication = null;
	let appWindow: Page = null;

	async function init() {
		electronApp = await playwright["_electron"].launch({
			executablePath:
				VARIANT === "release"
				? path.resolve(__dirname, "../../../output/crusher-electron-app-release/darwin/mac/Crusher Recorder.app/Contents/MacOS/Crusher Recorder")
				: path.resolve(__dirname, "../bin/darwin/Electron.app/Contents/MacOS/Electron"),
			args: VARIANT === "release" ? undefined : [path.resolve(__dirname, "../../../output/crusher-electron-app")],
		});
		appWindow = await electronApp.firstWindow();

		const onboarding = await appWindow.$("#onboarding-overlay");
		if (onboarding) {
			await appWindow.click("text=Skip Onboarding");
		}
		await appWindow.waitForLoadState();
	}

	async function resetApp() {
		await electronApp.close();
		await init();
	}

	async function fillInput(inputText = "https://google.com") {
		const inputBar = await appWindow.waitForSelector(".target-site-input input");
		await inputBar.focus();
		await inputBar.type(inputText);
		return inputBar;
	}

	async function waitForRecorderToInitialize() {
		expect(await appWindow.waitForSelector("webview")).not.toBe(null);
		expect(await appWindow.waitForSelector("#recorder-status")).not.toBe(null);
		expect(await appWindow.waitForSelector("#select-an-element-action")).not.toBe(null);
	}

	function getParentElement(element: ElementHandle) {
		return element.evaluateHandle(element => element.parentElement);
	}

	/**
	 * Create the browser and page context
	 */
	beforeAll(async () => {
		await init();
	});

	afterAll(async () => {
		await electronApp.close();
	});

	describe("url input", () => {
		test("invalid url checks", async () => {
			const inputBar = await fillInput("example");
			await inputBar.press("Enter");

			await new Promise((resolve) => setTimeout(resolve, 250));
			expect(await appWindow.$("webview")).toBe(null);
		});

		test("adds http if missing", async () => {
			await resetApp();
			const inputBar = await fillInput("example.com");
			const beforeValue = await inputBar.inputValue();
			await inputBar.press("Enter");
			const afterValue = await inputBar.inputValue();
			expect(afterValue).toBe("https://" + beforeValue);
		});

		test("enter starts recording session", async () => {
			await resetApp();
			const inputBar = await fillInput();
			await inputBar.press("Enter");

			await waitForRecorderToInitialize();
		});
	});

	test("start button works", async () => {
		await resetApp();

		const inputBar = await fillInput();
		const startButton = await appWindow.waitForSelector("text=Start");
		expect(startButton).not.toBe(null);
		await startButton.click();

		await waitForRecorderToInitialize();
	});

	describe("device input", () => {
		let inputBar: ElementHandle<HTMLElement> = null;
		let deviceDropdown: ElementHandle<HTMLElement> = null;
		let deviceDropDownBox: ElementHandle<any> = null;
		let deviceMobileOption: ElementHandle<any> = null;

		beforeAll(async () => {
			await resetApp();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			inputBar = await fillInput();
		});

		test("device input is visible", async () => {
			deviceDropdown = (await appWindow.$(".target-device-dropdown input")) as any;
			expect(deviceDropdown).not.toBe(null);
			expect(await deviceDropdown.isVisible()).toBe(true);
		});

		test("Default device is Desktop", async () => {
			expect(await deviceDropdown.getAttribute("placeholder")).toBe("Desktop");
		});

		test("device dropdown opens", async () => {
			await (await getParentElement(deviceDropdown)).click();

			deviceDropDownBox = await appWindow.waitForSelector(".target-device-dropdown .dropdown-box");
			expect(await deviceDropDownBox.isVisible()).toBe(true);

			deviceMobileOption = await deviceDropDownBox.$("text=Mobile");
			expect(deviceMobileOption).not.toBe(null);
		});

		test("selecting device option works", async () => {
			await deviceMobileOption.click();
			expect(await deviceDropDownBox.isVisible()).toBe(false);
			expect(await deviceDropdown.getAttribute("placeholder")).toBe("Mobile");
		});

		test("recorder device frame follows device input", async () => {
			await (await appWindow.$("text=Start")).click();
			await waitForRecorderToInitialize();
			const webView = await appWindow.$("webview");
			const webViewContainerSize = await webView.evaluate((element) => {
				return {
					width: element.parentElement.style.width,
					height: element.parentElement.style.height,
				};
			});

			expect(webViewContainerSize).toMatchObject({ width: devices[2].width + "rem", height: devices[2].height + "rem" });
		});

		test("changing device between recording session", async () => {
			await (await getParentElement(deviceDropdown)).click();
			deviceDropDownBox = await appWindow.waitForSelector(".target-device-dropdown .dropdown-box");

			await (await deviceDropDownBox.$("text=Desktop")).click();
			expect(await deviceDropdown.getAttribute("placeholder")).toBe("Desktop");

			const webView = await appWindow.$("webview");
			const webViewContainerSize = await webView.evaluate((element) => {
				return {
					width: element.parentElement.style.width,
					height: element.parentElement.style.height,
				};
			});

			expect(webViewContainerSize).toMatchObject({ width: devices[0].width + "rem", height: devices[0].height + "rem" });
		});
	});

	test("init actions are recorded", async () => {
		await resetApp();
		const inputBar = await fillInput();
		await inputBar.press("Enter");
		await waitForRecorderToInitialize();

		const recordedStepListContainer = await appWindow.waitForSelector("#steps-list-container");
		expect(await recordedStepListContainer.isVisible()).toBe(true);

		const recordedSteps = await recordedStepListContainer.evaluate((element) => {
			return Array.from(element.querySelectorAll(".recorded-step")).map((node: any) => {
				return {
					type: node.dataset.type,
					stepId: node.dataset.stepId,
					status: node.dataset.status,
				};
			});
		});

		expect(recordedSteps[0].type).toBe(ActionsInTestEnum.SET_DEVICE);
		expect(recordedSteps[1].type).toBe(ActionsInTestEnum.NAVIGATE_URL);
	});
});
