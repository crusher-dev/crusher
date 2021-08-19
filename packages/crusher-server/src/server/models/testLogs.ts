import * as mongoose from "mongoose";
import { TestType } from "@core/interfaces/TestType";
const TestLogsSchema = new mongoose.Schema(
	{
		tag: String,
		message: String,
		jobId: mongoose.Schema.Types.Number,
		testId: mongoose.Schema.Types.Number,
		instanceId: mongoose.Schema.Types.Number,
		type: {
			type: mongoose.Schema.Types.String,
			enum: [TestType.DRAFT, TestType.SAVED],
			default: TestType.DRAFT,
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
