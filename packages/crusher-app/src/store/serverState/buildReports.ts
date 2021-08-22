import useSWR from "swr";

import { getBuildReportAPI } from "@constants/api";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";

export const useBuildReport = (id: number) => {
	const { data, error } = useSWR<IBuildReportResponse>(getBuildReportAPI(id), { suspense: true });
	return { data, error };
};
