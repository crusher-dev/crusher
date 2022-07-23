/**
 * @jest-environment ./__tests__/recorder/env
 */
import { fillInput } from "../utils";
import { ElectronApplication, Page } from "playwright-core";
jest.setTimeout(30000);

declare var recorder:  {
    init: () => void;
    electronApp: ElectronApplication;
    appWindow: Page;
};

describe("url input", () => {
    beforeEach(async () => {
        await recorder.init();
    });

    afterEach(async () => {
        await recorder.electronApp.close();
    });

    async function assertRecorderIsInitialized() {
		expect(await recorder.appWindow.waitForSelector("webview")).not.toBe(null);
		expect(await recorder.appWindow.waitForSelector("#recorder-status")).not.toBe(null);
		expect(await recorder.appWindow.waitForSelector("#select-an-element-action")).not.toBe(null);
	}

    test("invalid url checks", async () => {
        const inputBar = await fillInput("example");
        await inputBar.press("Enter");

        await new Promise((resolve) => setTimeout(resolve, 250));
        expect(await recorder.appWindow.$("webview")).toBe(null);
    });

    test("adds http if missing", async () => {
        let inputBar = await fillInput("example.com");
        const beforeValue = await inputBar.inputValue();
        await inputBar.press("Enter");
        await inputBar.waitForElementState("hidden");
        inputBar = await recorder.appWindow.waitForSelector(".target-site-input input");
        const afterValue = await inputBar.inputValue();
        expect(afterValue).toBe("http://" + beforeValue);
    });

    test("enter starts recording session", async () => {
        const inputBar = await fillInput();
        await inputBar.press("Enter");

        await assertRecorderIsInitialized();
    });

    test("start button works", async () => {
        const inputBar = await fillInput();
        const startButton = await recorder.appWindow.waitForSelector("text=Start");
        expect(startButton).not.toBe(null);
        await startButton.click();

        await assertRecorderIsInitialized();
    });
});