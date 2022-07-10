import useSWR from "swr";

import { getBuildReportAPI, getLocalBuidlReportApi } from "@constants/api";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";

export const useBuildReport = (id: number | string) => {
	let useLocalBuildAPI = false;
	if(typeof id === 'string' && id.startsWith("temp_")) {
		useLocalBuildAPI = true;
	}
	const { data, error } = useSWR<IBuildReportResponse>(useLocalBuildAPI ?  getLocalBuidlReportApi(id) : getBuildReportAPI(id), { suspense: true });
	return { data, error };
};
