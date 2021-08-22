import React from "react";

import { Conditional } from "dyson/src/components/layouts";

import { LoadingSVG } from "@svg/dashboard";
import { FailedSVG } from "@svg/testReport";

export const FirstTestRunStatus = ({ isRunning = false, isFailed = false }) => {
	return (
		<div className={"flex justify-center h-full items-center"}>
			<Conditional showIf={isFailed}>
				<FailedSVG height={18} width={18} />
			</Conditional>
			<Conditional showIf={isRunning}>
				<LoadingSVG height={18} width={18} />
			</Conditional>
			<span className={"text-13 leading-none ml-12 mt-2"}>{isRunning ? "Running the test" : "Test failed in first try"}</span>
		</div>
	);
};

export default FirstTestRunStatus;
