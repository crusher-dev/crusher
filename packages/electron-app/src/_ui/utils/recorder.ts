import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";
import { createLocalBuild } from "electron-app/src/store/actions/builds";
import { setRecorderContext } from "electron-app/src/store/actions/recorder";
import { getStore } from "electron-app/src/store/configureStore";
import { TRecorderVariant } from "electron-app/src/store/reducers/recorder";
import { goFullScreen, performReplayTestUrlAction, performTrackEvent } from "electron-app/src/ipc/perform";
import historyInstance from "./history";
import { CloudCrusher } from "electron-app/src/lib/cloud";

const triggerLocalBuildFromDeeplink = async (testsList: number[], host: string | null = null) => {
	const selectedTests = await CloudCrusher.getTests(testsList as any);
	console.log("Response", selectedTests);
	const store = getStore();
	store.dispatch(createLocalBuild({
		id: "CRU-123",
		host: host,
		tests: testsList,
		progress: new Map(),
		queuedTests: testsList,
		time: Date.now(),
	}));

	window["testsToRun"] = { list: testsList, count: testsList.length };
	window["localRunCache"] = {};

	store.dispatch(setRecorderContext({
		variant: TRecorderVariant.LOCAL_BUILD,
		origin: origin,
	}));
	performTrackEvent(DesktopAppEventsEnum.TRIGGER_LOCAL_BUILD, {
		testsCount: testsList.length,
	});

	historyInstance.push("/recorder", "");
	goFullScreen();
	
	return performReplayTestUrlAction(window["testsToRun"].list[0], true, selectedTests);
};

const triggerLocalBuild = (testsList: number[] = undefined, selectedTests: any[] = [], host: string | null = null, origin: "deeplink" | "app" = "app", extraContext = {}) => {
	const store = getStore();
	store.dispatch(
		createLocalBuild({
			id: "CRU-123",
			host: host,
			tests: testsList,
			progress: new Map(),
			queuedTests: testsList,
			time: Date.now(),
		}),
	);
	window["testsToRun"] = { list: testsList, count: testsList.length };
	window["localRunCache"] = {};

	store.dispatch(setRecorderContext({
		variant: TRecorderVariant.LOCAL_BUILD,
		origin: origin,
		...extraContext
	}));
	performTrackEvent(DesktopAppEventsEnum.TRIGGER_LOCAL_BUILD, {
		testsCount: testsList.length,
	});

	historyInstance.push("/recorder", "");
	goFullScreen();
	return performReplayTestUrlAction(window["testsToRun"].list[0], true, selectedTests);
};


export { triggerLocalBuild, triggerLocalBuildFromDeeplink };
