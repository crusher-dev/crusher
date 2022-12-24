import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { CommunicationChannel } from "@libs/communicationChannel";
import { ExportsManager } from "@libs/exportManager";
import { CrusherSdk } from "@libs/sdk";
import { StorageManager } from "@libs/storage";
import { Browser, Locator, Page } from "playwright-core";

interface IRunnerServices {
    globals: IGlobalManager;  // <- Use this for managing globals for the whole test
    storage: StorageManager;
    exports: ExportsManager;
    runnerCommunicationChannel: CommunicationChannel; // <- Use this for communicating with the runner
};

interface ITestSession {
    context: any;
    currentStep: iAction;
    runActions: (actions: any[]) => Promise<void>;
}

export type BrowserActionParams = {
    playwright: {
        browser: Browser;
    },
    services: IRunnerServices,
    test: ITestSession,
    sdk: CrusherSdk
}

export type PageActionParams = {
    playwright: {
        page: Page;
        browser: Browser;
    },
    services: IRunnerServices,
    test: ITestSession,
    sdk: CrusherSdk
}

export type ElementActionParams = {
    playwright: {
        element: Locator;
        page: Page;
        browser: Browser;
    },
    services: IRunnerServices,
    test: ITestSession,
    sdk: CrusherSdk
}

export type ActionParams = BrowserActionParams | PageActionParams | ElementActionParams;