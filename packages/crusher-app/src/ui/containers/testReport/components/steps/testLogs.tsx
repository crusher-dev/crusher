import { getStepsFromInstanceData } from "@utils/core/buildReportUtils";
import { css } from "@emotion/react";
import React from "react";

export function TestLogs({ testInstanceData }) {
    const steps = getStepsFromInstanceData(testInstanceData);

    return (
        <textarea
            css={css`
            margin-top: 42rem;
            margin-left: 54rem;
            width: 500px;
            height: 200rem;
            color: #9b9b9b;
            border: 1rem solid rgba(196,196,196,0.08);
            border-radius: 10rem;
            background: #0000008a;
            padding: 20rem 24rem;
            font-size: 13px;
            line-height: 200%;
			`}
            value={steps
                .map((step) => {
                    return (step as any).message || (step as any).meta.customLogMessage;
                })
                .join("\n")}
            readOnly={true}
        ></textarea>
    );
}