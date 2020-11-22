import * as mongoose from 'mongoose';
import { TestTypes } from '../interfaces/TestTypes';

const TestLiveStepsLogsSchema = new mongoose.Schema(
	{
		actionType: mongoose.Schema.Types.String,
		body: mongoose.Schema.Types.Mixed,
		testId: mongoose.Schema.Types.Number,
		testType: {
			type: mongoose.Schema.Types.String,
			enum: [TestTypes.DRAFT, TestTypes.SAVED],
			default: TestTypes.DRAFT,
		},
		meta: mongoose.Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const TestLiveStepsLogs = mongoose.model('TestLiveStepsLogs', TestLiveStepsLogsSchema);
