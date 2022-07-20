/**
 * @jest-environment ./__tests__/recorder/env
 */
 import { fillInput } from "../utils";
 import { ElectronApplication, ElementHandle, Page } from "playwright-core";
import { ActionsInTestEnum } from "../../../../crusher-shared/constants/recordedActions";
jest.setTimeout(30000);

 declare var recorder:  {
     init: () => void;
     electronApp: ElectronApplication;
     appWindow: Page;
 };
 
describe("recording session", () => {
    let inputBar: ElementHandle<HTMLElement>;

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

    test("init actions are recorded", async () => {
        await inputBar.press("Enter");
        await assertRecorderIsInitialized();

        const recordedStepListContainer = await recorder.appWindow.waitForSelector("#steps-list-container");
        expect(await recordedStepListContainer.isVisible()).toBe(true);

        // Wait for 5 seconds to make sure recorder is ready
        await recorder.appWindow.waitForFunction(([element]) => {
            return element.querySelectorAll(".recorded-step").length >= 2;
        }, [recordedStepListContainer], {timeout: 5000});

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
})
