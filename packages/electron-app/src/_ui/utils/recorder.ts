import { goFullScreen, performReplayTestUrlAction } from "electron-app/src/ui/commands/perform";
import historyInstance from "./history";

const triggerLocalBuild = (testsList: Array<number> = undefined) => {
    window["testsToRun"] = { list: testsList, count: testsList.length };
    window["localRunCache"] = {};

    historyInstance.push("/recorder", "");
    goFullScreen();
    performReplayTestUrlAction(window["testsToRun"].list[0], true);
};

export { triggerLocalBuild };