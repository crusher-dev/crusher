import { useRouter } from "next/router";

import { useAtom } from "jotai";

import { projectsAtom } from "@store/atoms/global/project";

export const useProjectDetails = () => {
	const [projects] = useAtom(projectsAtom);
	const { query } = useRouter();
	const { project_id } = query;
	const currentProject = projects?.filter(({ id }) => id === parseInt(project_id))[0];

	return { currentProject, projects };
};
