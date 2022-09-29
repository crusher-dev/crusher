import { createLocalBuild } from "electron-app/src/store/actions/builds";
import { getStore } from "electron-app/src/store/configureStore";
import { getRecorderInfo } from "electron-app/src/store/selectors/recorder";
import { goFullScreen, performReplayTestUrlAction } from "electron-app/src/_ui/commands/perform";
import historyInstance from "./history";

const triggerLocalBuild = (testsList: Array<number> = undefined) => {
    const store = getStore();
    store.dispatch(createLocalBuild({
        id: "CRU-123",
        tests: testsList,
        queuedTests: testsList,
        time: Date.now()
    }));
    window["testsToRun"] = { list: testsList, count: testsList.length };
    window["localRunCache"] = {};

    historyInstance.push("/recorder", "");
    goFullScreen();
    return performReplayTestUrlAction(window["testsToRun"].list[0], true);
};

export { triggerLocalBuild };