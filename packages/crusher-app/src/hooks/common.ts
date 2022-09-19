import { projectsAtom } from "@store/atoms/global/project";
import { useAtom } from "jotai";
import { useRouter } from "next/router"

export const useProjectDetails = () => {
    const [projects] = useAtom(projectsAtom);
    const { query } = useRouter()
    const { project_id } = query
    const currentProject = projects?.filter(({ id }) => id == parseInt(project_id))[0];

    return { currentProject, projects }
}

