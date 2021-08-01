import { PassedSVG } from "@svg/testReport";
import React from "react";

export const getStatusString = (type) => {
	if (type === "PASSED") {
		return "Your build has passes succesfully. No review is required";
	}

	return "We're running your test";
};
