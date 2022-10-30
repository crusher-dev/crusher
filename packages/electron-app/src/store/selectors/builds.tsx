import { iReduxState } from "../reducers";

export const getCurrentLocalBuild = (state: iReduxState) => state.builds.currentBuild;
export const getBuildResult = (buildId: string) => (state: iReduxState) => state.builds.builds[buildId];
export const getBuilds = (state: iReduxState) => state.builds.builds;
export const getBuildProgress = (state: iReduxState) => {
    const arr = [...state.builds.currentBuild.progress.entries()];
    return arr.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
};

export const getBuildNotifications = (state: iReduxState) => state.builds.notifications;
export const getLastBuildNotification = (state: iReduxState) => state.builds.notifications[state.builds.notifications.length - 1];
