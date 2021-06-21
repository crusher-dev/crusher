import { iAllProjectsItemResponse } from "@crusher-shared/types/response/allProjectsResponse";

export const getProjects = (state: any): iAllProjectsItemResponse[] => state.projects.allProjects;
export const getSelectedProject = (state: any) => state.projects.selectedProject;

export const getAllHosts = (projectId: number) => (state: any) => state.projects.hosts[projectId];

export const getProjectInfo = (state: any) => state.projects.currentProjectInfo;

export const getProjectMembers = (projectId: number) => (state: any) => (state.projects.members[projectId] || []);
