import * as mongoose from 'mongoose';

const JobLogsSchema = new mongoose.Schema({
    tag: String,
    message: String,
    jobId: mongoose.Schema.Types.Number,
    level: {
        type: mongoose.Schema.Types.String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
    },
    meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export const JobLogs = mongoose.model("JobLogs", JobLogsSchema);