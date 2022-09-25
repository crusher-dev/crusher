import { iReduxState } from "../reducers";

export const getCurrentLocalBuild = (state: iReduxState) => state.builds.currentBuild;
export const getBuildResult = (state: iReduxState, buildId: string) => state.builds.builds[buildId];
export const getBuilds = (state: iReduxState) => state.builds.builds;