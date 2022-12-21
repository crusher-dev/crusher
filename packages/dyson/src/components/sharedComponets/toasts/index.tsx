import React from "react";
import { ICrusherRecorderSDK } from "../../../../../crusher-shared/types/extension/recorderSdk";

export const TestErrorContext = React.createContext<{
    sdk?: ICrusherRecorderSDK;
    stepId?: number;
    resolveError: () => void;
}>({
    sdk: undefined,
    stepId: undefined,
    resolveError: () => {},
});
