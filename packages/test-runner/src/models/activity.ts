import * as mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    tag: String,
    message: String,
    meta: mongoose.Schema.Types.Mixed,
    userId: mongoose.Schema.Types.Number
}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);