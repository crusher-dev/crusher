import * as mongoose from 'mongoose';
import {TestTypes} from "../interfaces/TestTypes";

const TestLogsSchema = new mongoose.Schema({
    tag: String,
    message: String,
    jobId: mongoose.Schema.Types.Number,
    testId: mongoose.Schema.Types.Number,
    instanceId: mongoose.Schema.Types.Number,
    type: {
        type: mongoose.Schema.Types.String,
        enum: [TestTypes.DRAFT, TestTypes.SAVED],
        default: TestTypes.DRAFT
    },
    level: {
        type: mongoose.Schema.Types.String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
    },
    meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export const TestsLogs = mongoose.model("TestLogs", TestLogsSchema);