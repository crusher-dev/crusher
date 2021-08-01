import * as mongoose from "mongoose";
import { TestType } from "@core/interfaces/TestType";

const TestLiveStepsLogsSchema = new mongoose.Schema(
	{
		actionType: mongoose.SchemaTypes.String,
		body: mongoose.Schema.Types.Mixed,
		testId: mongoose.Schema.Types.Number,
		testType: {
			type: mongoose.Schema.Types.String,
			enum: [TestType.DRAFT, TestType.SAVED],
			default: TestType.DRAFT,
		},
		meta: mongoose.Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const TestLiveStepsLogs = mongoose.model("TestLiveStepsLogs", TestLiveStepsLogsSchema);
