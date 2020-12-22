export const getProjects = (state) => state.projects.allProjects;
export const getSelectedProject = (state) => state.projects.selectedProject;

export const getAllHosts = (projectId) => (state) =>
	state.projects.hosts[projectId];

export const getProjectInfo = (state: any) => state.projects.currentProjectInfo;
