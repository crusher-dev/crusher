import * as mongoose from "mongoose";
import { RUNNER_REQUEST_TYPE } from "@shared/types/runner/requestType";

const TestLiveStepsLogsSchema = new mongoose.Schema(
	{
		actionType: mongoose.Schema.Types.String,
		body: mongoose.Schema.Types.Mixed,
		testId: mongoose.Schema.Types.Number,
		testType: {
			type: mongoose.Schema.Types.String,
			enum: [RUNNER_REQUEST_TYPE.DRAFT, RUNNER_REQUEST_TYPE.SAVED],
			default: RUNNER_REQUEST_TYPE.DRAFT,
		},
		meta: mongoose.Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const TestLiveStepsLogs = mongoose.model("TestLiveStepsLogs", TestLiveStepsLogsSchema);
