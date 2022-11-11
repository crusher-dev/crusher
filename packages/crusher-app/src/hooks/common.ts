import React, { useState } from "react";

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

export const useQueryParams: () => { params: any } = () => {
	const { asPath } = useRouter();
	const [searchParams, setSearchParams] = useState(new URLSearchParams(asPath.split("?")[1]));

	// return all the objects of query params
	const getQueryParams = () => {
		const params = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});
		return params;
	}

	return {
		params: getQueryParams(),
	}
}