import useSWR from "swr";
import { IBuildReportResponse } from "@crusher-shared/types/response/iBuildReportResponse";
import { getBuildReportAPI } from "@constants/api";
export const useBuildReport = (id: number) => {
	const { data, error } = useSWR<IBuildReportResponse>(getBuildReportAPI(id), { suspense: true });
	return { data, error };
};
