import { IProjectMetaData } from "../reducers/projects";

export const SET_PROJECTS_METADATA = "SET_PROJECTS_METADATA";
export const SET_ALL_PROJECTS_METADATA = "SET_ALL_PROJECTS_METADATA";

export const setProjectMetaData = (project: IProjectMetaData, projectId: number | string) => {  
    return {
        type: SET_PROJECTS_METADATA,
        payload: {
            project,
            projectId
        },
    }
};

export const setAllProjectsMetaData = (projects: IProjectMetaData[]) => {
    return {
        type: SET_ALL_PROJECTS_METADATA,
        payload: {
            projects
        },
    }
};