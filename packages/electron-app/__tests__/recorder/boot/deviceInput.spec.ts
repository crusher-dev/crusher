/**
 * @jest-environment ./__tests__/recorder/env
 */
 import { fillInput } from "../utils";
 import { ElectronApplication, ElementHandle, Page } from "playwright-core";
import { devices } from "../../../src/devices";
jest.setTimeout(30000);

 declare var recorder:  {
     init: () => void;
     electronApp: ElectronApplication;
     appWindow: Page;
 };
 
 describe("device input", () => {
    let inputBar: ElementHandle<HTMLElement>;
	let deviceDropdown: ElementHandle<HTMLElement>;
	let deviceDropDownBox: ElementHandle<any>;
	let deviceMobileOption: ElementHandle<any>;

	beforeAll(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		await recorder.init();
		inputBar = await fillInput();
	});

    afterAll(async () => {
		await recorder.electronApp.close();
	})
		
    async function assertRecorderIsInitialized() {
		expect(await recorder.appWindow.waitForSelector("webview")).not.toBe(null);
		expect(await recorder.appWindow.waitForSelector("#recorder-status")).not.toBe(null);
		expect(await recorder.appWindow.waitForSelector("#select-an-element-action")).not.toBe(null);
	}

	test("device input is visible", async () => {
		deviceDropdown = (await recorder.appWindow.$(".target-device-dropdown input")) as any;
		expect(deviceDropdown).not.toBe(null);
		expect(await deviceDropdown.isVisible()).toBe(true);
	});

	test("Default device is Desktop", async () => {
		expect(await deviceDropdown.getAttribute("placeholder")).toBe("Desktop");
	});

	test("device dropdown opens", async () => {
		await (await deviceDropdown.evaluateHandle(element => element.parentElement)).click();
		deviceDropDownBox = await recorder.appWindow.waitForSelector(".select-dropDownContainer .dropdown-box");
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
		await (await recorder!.appWindow!.$("text=Start"))!.click();
		await assertRecorderIsInitialized();
		const webView = await recorder.appWindow.$("webview");
		const webViewContainerSize = await webView!.evaluate((element) => {
			return {
				aspectRatio: element!.parentElement!.style.aspectRatio,
			};
		});
		expect(webViewContainerSize).toMatchObject({ aspectRatio: `${(devices[2].width + " / " + devices[2].height)}` });
	});
 });