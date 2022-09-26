import { addBuildNotification, clearBuildNotifications, removeBuildNotification, updateBuildNotification } from "electron-app/src/store/actions/builds";
import { getBuildNotifications, getBuilds, getCurrentLocalBuild, getLastBuildNotification } from "electron-app/src/store/selectors/builds";
import React from "react";
import { useSelector, useDispatch, useStore } from "react-redux";

const useBuildNotifications = () => {
    const notifications = useSelector(getBuildNotifications);
    const latestNotification = useSelector(getLastBuildNotification);
    const dispatch = useDispatch();

    const _addNotification = React.useCallback((notification) => {
        dispatch(addBuildNotification(notification));
    }, [notifications]);
    
    const _removeNotification = React.useCallback((notificationId) => {
        dispatch(removeBuildNotification(notificationId));
    }, [notifications]);

    const _updateNotification = React.useCallback((notificationId, notification) => {
        dispatch(updateBuildNotification(notificationId, notification));
    }, [notifications]);

    const _clearNotifications = React.useCallback(() => {
        dispatch(clearBuildNotifications());
    }, []);

    return { notifications, latestNotification, addNotification: _addNotification, removeNotification: _removeNotification, clearNotifications: _clearNotifications, updateNotification: _updateNotification };
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

    const handleTestCompleted = (testId: any) => {

    };
    return { handleTestCompleted, builds, currentBuild };
};

export { useBuildNotifications, useLocalBuild };