import React from "react";

const useBuildNotifications = () => {
    const [notifications, setNotifications] = React.useState([]);
    
    // Hydrate
    React.useEffect(() => {
        if(!localStorage.getItem("buildNotifications")) {
            localStorage.setItem("buildNotifications", JSON.stringify([]));
        }
        const notifications = JSON.parse(localStorage.getItem("buildNotifications"));
        setNotifications(notifications);
    }, []);

    const addNotification = React.useCallback((notification) => {
        setNotifications((notifications) => [...notifications, notification]);
        localStorage.setItem("buildNotifications", JSON.stringify([...notifications, notification]));
    }, [notifications]);
    
    const removeNotification = React.useCallback((notificationId) => {
        setNotifications((notifications) => notifications.filter((n) => n.id !== notificationId));
        localStorage.setItem("buildNotifications", JSON.stringify(notifications.filter((n) => n.id !== notificationId)));
    }, [notifications]);

    const clearNotifications = React.useCallback(() => {
        setNotifications([]);
        localStorage.setItem("buildNotifications", JSON.stringify([]));
    }, []);

    return { notifications, addNotification, removeNotification, clearNotifications };
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
//             performReplayTestUrlAction(window["testsToRun"].list[0], true);
//           } else {
//             // Time to redirect to dashboard
//             const totalTestsInBuild = window["testsToRun"].count;
//             window["testsToRun"] = undefined;
//             const localBuild = await performSaveLocalBuild(Object.values(window["localRunCache"]));
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
const useLocalBuild = (testsList: Array<any>) => {
    const handleTestCompleted = (testId: any) => {

    };
    return {};
};

export { useBuildNotifications };