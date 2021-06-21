import { iTestMetaInfo } from "@interfaces/testMetaInfo";
import { iLiveStepLogs } from "@crusher-shared/types/mongo/liveStepsLogs";

export const getTestMetaInfo = (state: any): iTestMetaInfo => state.tests.metaInfo;
export const getTestLiveLogs = (state: any): iLiveStepLogs[] => state.tests.liveLogs;
export const checkIsTestAborted = (state: any): boolean => state.tests.isError;
