import * as mongoose from "mongoose";
import { RUNNER_REQUEST_TYPE } from "@shared/types/runner/requestType";

const TestLogsSchema = new mongoose.Schema(
	{
		tag: String,
		message: String,
		jobId: mongoose.Schema.Types.Number,
		testId: mongoose.Schema.Types.Number,
		instanceId: mongoose.Schema.Types.Number,
		type: {
			type: mongoose.Schema.Types.String,
			enum: [RUNNER_REQUEST_TYPE.DRAFT, RUNNER_REQUEST_TYPE.SAVED],
			default: RUNNER_REQUEST_TYPE.DRAFT,
		},
		level: {
			type: mongoose.Schema.Types.String,
			enum: ["low", "medium", "high", "critical"],
			default: "medium",
		},
		meta: mongoose.Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const TestsLogs = mongoose.model("TestLogs", TestLogsSchema);
