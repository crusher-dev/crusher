import { atom } from "jotai";
import { useRouter } from "next/router";
import { projectsAtom } from "../atoms/global/project";

export const currentProjectSelector = atom((get) => {
	const projects = get(projectsAtom);
	const { query } = useRouter()
	const { project_id } = query

	return projects?.filter(({ id }) => id === parseInt(project_id))[0];
});
