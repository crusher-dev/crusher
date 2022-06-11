import playwright, { ElectronApplication, ElementHandle, Page } from "playwright";
import path, { resolve } from "path";
import http from "http";
import { getLaunchOptions } from "./utils";
const handler = require("serve-handler");

jest.setTimeout(30000);
const VARIANT = (process.env.VARIANT || "dev").toLocaleLowerCase();

describe("Recorder session", () => {
	let electronApp: ElectronApplication = null;
	let appWindow: Page = null;
	let assetsServer: http.Server = null;

	async function startServer() {
		assetsServer = http.createServer((request, response) => {
			// You pass two more arguments for config and middleware
			// More details here: https://github.com/vercel/serve-handler#options
			return handler(request, response, { public: path.resolve(__dirname, "assets") });
		});

		assetsServer.listen(3913);
	}

	async function closeServer() {
		assetsServer.close();
	}
	async function init() {
		electronApp = await playwright["_electron"].launch(getLaunchOptions());

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
		await startServer();
		await init();
	});

	afterAll(async () => {
		await electronApp.close();
		await closeServer();
	});

	test("boots", async () => {
		const inputBar = await fillInput("http://localhost:3913/form.html");
		await inputBar.press("Enter");
		await waitForRecorderToInitialize();
	});
});
