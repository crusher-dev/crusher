(const playwright = require("playwright");
const { CrusherRunnerActions, handlePopup, registerCrusherSelectorEngine, GlobalManager } = require("crusher-runner-utils");

const globals = new GlobalManager();

const crusherRunnerActionManager = new CrusherRunnerActions(logManager, storageManager, globals, "baseAssetsPath");
const actionHandlersMap = crusherRunnerActionManager.getStepHandlers();


const browser = await playwright["chromium"].launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--disable-gpu"]
});

globals.set("browserContextOptions", {defaultNavigationTimeout: 15000, defaultTimeout: 5000});
const coreActions = [];
await crusherRunnerActionManager.runActions(coreActions, browser);

const browserContextOptions = globals.get("browserContextOptions");

const browserContext = await browser.newContext({
   ...browserContextOptions
});

browserContext.setDefaultNavigationTimeout(browserContextOptions.defaultNavigationTimeout);
browserContext.setDefaultTimeout(browserContextOptions.defaultTimeout);

const page = await browserContext.newPage({});
await handlePopup(page, browserContext);

const capturedVideo = await saveVideo(page, '/tmp/crusher/somedir/videos/video.mp4');

const mainActions = [];
await crusherRunnerActionManager.runActions(mainActions, browser, page);

await capturedVideo.stop()
await browser.close();)