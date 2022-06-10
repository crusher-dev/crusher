import playwright, { ElectronApplication, ElementHandle, Page } from "playwright";
import path, { resolve } from "path";
import { devices } from "../src/devices";
import { ActionStatusEnum } from "../../crusher-shared/lib/runnerLog/interface";
import { ActionsInTestEnum } from "../../crusher-shared/constants/recordedActions";
import { execSync } from "child_process";

jest.setTimeout(50000);

const VARIANT = (process.env.VARIANT || "dev").toLocaleLowerCase();
describe("Recorder boot", () => {
	let electronApp: ElectronApplication = null;
	let appWindow: Page = null;

	async function init() {
		electronApp = await playwright["_electron"].launch({
			executablePath:
				VARIANT === "release"
				? path.resolve(__dirname, "../../../output/crusher-electron-app-release/darwin/mac/Crusher Recorder.app/Contents/MacOS/Crusher Recorder")
				: path.resolve(__dirname, "../bin/darwin-x64/Electron.app/Contents/MacOS/Electron"),
			args: VARIANT === "release" ? undefined : [path.resolve(__dirname, "../../../output/crusher-electron-app"), "--open-recorder"],
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

	/**
	 * Create the browser and page context
	 */
	beforeAll(async () => {
		await init();
	});

	afterAll(async () => {
		await electronApp.close();
	});

	test("replay test doesn't record two set devices in case of run_after_test", async () => {
    await execSync('open "crusher://replay-test?testId=3490"');
    await new Promise(resolve => setTimeout(resolve, 3000));
		await waitForRecorderToInitialize();

		const recordedStepListContainer = await appWindow.waitForSelector("#steps-list-container");
		expect(await recordedStepListContainer.isVisible()).toBe(true);

		await new Promise(resolve => setTimeout(resolve, 5000));
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
		expect(recordedSteps[1].type).toBe(ActionsInTestEnum.RUN_AFTER_TEST);
	});
});
