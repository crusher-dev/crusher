import {getStepsFromInstanceData} from "@utils/core/buildReportUtils";
import {css} from "@emotion/react";
import React from "react";

export function TestLogs({testInstanceData}) {
    const steps = getStepsFromInstanceData(testInstanceData);

    return (
        <textarea
            css={css`
				margin-top: 50rem;
				margin-left: 54rem;
				width: 100%;
				height: 200rem;
				color: #fff;
				border: 1rem solid rgba(196, 196, 196, 0.08);
				border-radius: 10rem;
				background: transparent;
				padding: 14rem 12rem;
				font-size: 14rem;
				line-height: 19rem;
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