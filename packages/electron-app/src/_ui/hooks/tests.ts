import { addBuildNotification, clearBuildNotifications, removeBuildNotification, updateBuildNotification } from "electron-app/src/store/actions/builds";
import { getBuildNotifications, getBuilds, getCurrentLocalBuild, getLastBuildNotification } from "electron-app/src/store/selectors/builds";
import { getSelectedProjectTestsRequest } from "electron-app/src/utils";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useRequest from "../utils/useRequest";
import { useState } from "react";
import { CloudCrusher } from "electron-app/src/lib/cloud";
import { sendSnackBarEvent } from "../ui/containers/components/toast";
import { getAllDrafts } from "electron-app/src/api/tests/draft.tests";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";

const useBuildNotifications = () => {
	const notifications = useSelector(getBuildNotifications);
	const latestNotification = useSelector(getLastBuildNotification);
	const dispatch = useDispatch();

	const _addNotification = React.useCallback(
		(notification) => {
			dispatch(addBuildNotification(notification));
		},
		[notifications],
	);

	const _removeNotification = React.useCallback(
		(notificationId) => {
			dispatch(removeBuildNotification(notificationId));
		},
		[notifications],
	);

	const _updateNotification = React.useCallback(
		(notificationId, notification) => {
			dispatch(updateBuildNotification(notificationId, notification));
		},
		[notifications],
	);

	const _clearNotifications = React.useCallback(() => {
		dispatch(clearBuildNotifications());
	}, []);

	return {
		notifications,
		latestNotification,
		addNotification: _addNotification,
		removeNotification: _removeNotification,
		clearNotifications: _clearNotifications,
		updateNotification: _updateNotification,
	};
};

// const Test = () => {
//     const action: any = {};
//     // @TODO: Change `redirectAfterSuccess` to `isLocalBuild`
//     console.log("Action args", action, window["testsToRun"]);
//     if(action.args.redirectAfterSuccess && window["testsToRun"]) {
//         window["testsToRun"].list = window["testsToRun"].list.filter(testId => testId !== action.args.testId);
//         const logs = await performGetRecorderTestLogs();
//         const recorderState = getRecorderState(store.getState());
//         window["localRunCache"][action.args.testId] = { steps: logs, id: action.args.testId, status: recorderState.type !== TRecorderState.ACTION_REQUIRED? "FINISHED" : "FAILED"};

//         if(window["testsToRun"].list.length) {
//             historyInstance.push("/recorder", {});
//             goFullScreen();
//             store.dispatch(setSessionInfoMeta({}));
//             performReplayTisCustomCodeOn ? <ActionsPanel/> : <CustomCodeBanner/>ld = await performSaveLocalBuild(Object.values(window["localRunCache"]));
//             console.log("local build is", localBuild);
//             window["localRunCache"] = undefined;
//             // steps: Array<any>; id: number; name: string; status: "FINISHED" | "FAILED"
//             window["localBuildReportId"] = localBuild.build.id;
// 			addNotification({id: localBuild.build.id });

//             historyInstance.push("/", {});

//             goFullScreen(false);
//             sendSnackBarEvent({ type: "test_report", message: null, meta: { totalCount: totalTestsInBuild, buildReportStatus: localBuild.buildReportStatus }});
//         }
//     }
// };

// Create redux state for storing progress
// currentTest/totalTest =
const useLocalBuild = () => {
	const builds = useSelector(getBuilds);
	const currentBuild = useSelector(getCurrentLocalBuild);

	const handleTestCompleted = () => {};
	return { handleTestCompleted, builds, currentBuild };
};


const useProjectTests = () => {
	const [deletedTests, setDeletedTests] = useState([]);
	const [deletedDraftTests, setDeletedDraftTests] = useState([]);

	const { data: tests, mutate: mutateTests } = useRequest(getSelectedProjectTestsRequest, { refreshInterval: 5000 });
	const { data: draftTests, mutate: mutateDraftTests } = useRequest(getAllDrafts, { refreshInterval: 5000 });

	const deleteTests = (idArr: any[]) => {
		setDeletedTests([...deletedTests, ...idArr]);
		mutateTests({
			...tests,
			list: tests.list.filter((test) => {
				return ![...deletedTests, ...idArr].includes(test.id);
			}),
		}, false);
		CloudCrusher.deleteTests(idArr).catch(() => {
			sendSnackBarEvent({ message: "Error deleting test", type: "error" });
		});
	};

	const deleteDraftTests = (idArr: any[]) => {
		setDeletedDraftTests([...deletedDraftTests, ...idArr]);
		mutateDraftTests(draftTests?.filter((draft) => {
			return ![...deletedDraftTests, ...idArr].includes(draft.id);
		}), false);
		CloudCrusher.deleteDraftTests(idArr).catch(() => {
			sendSnackBarEvent({ message: "Error deleting drafts", type: "error" });
		});
	};

	const filterTests = (tests: any[]) => {
		return tests.filter((test) => {
			return !deletedTests.includes(test.id);
		});
	};

	const filterDraftTests = (tests: any[]) => {
		return draftTests?.filter((draft) => {
			return !deletedDraftTests.includes(draft.id);
		}).map((draft) => {
			const events = JSON.parse(draft.events);
			const navigationEvents = events.find((event: any) => {
				return event.type === ActionsInTestEnum.NAVIGATE_URL;
			});
			const host = navigationEvents?.payload.meta.value;

			return { ...draft, testName: draft.name, firstRunCompleted: true, host};
		}).sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});
	};


	return { 
		tests: filterTests(tests?.list || []),
		draftTests: filterDraftTests(draftTests) || [],
		deleteTests,
		deleteDraftTests,
	};
};

export { useBuildNotifications, useLocalBuild, useProjectTests };
