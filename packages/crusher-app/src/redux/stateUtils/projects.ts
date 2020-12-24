export const getProjects = (state) => state.projects.allProjects;
export const getSelectedProject = (state) => state.projects.selectedProject;

export const getAllHosts = (projectId) => (state) =>
	state.projects.hosts[projectId];

export const getProjectInfo = (state: any) => state.projects.currentProjectInfo;

export const getProjectMembers = (projectId: number) => (state: any) =>
	state.projects.members[projectId];
