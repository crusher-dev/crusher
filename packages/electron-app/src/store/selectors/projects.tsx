import { iReduxState } from "../reducers";
import { IProjectMetaData } from "../reducers/projects";

export const getProjectMetadata = (state: iReduxState, projectId: string | number): IProjectMetaData | null => {
    return state.projects.metadata[projectId];
}

export const getCurrentProjectMetadata = (state: iReduxState): IProjectMetaData | null => {
    const projectId = state.projects.selectedProject;
    if(!projectId) {
        return null;
    }
    return getProjectMetadata(state, projectId);
}