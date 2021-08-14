import * as mongoose from "mongoose";

const BuildInstanceResultsSchema = new mongoose.Schema(
	{
		instanceId: { type: mongoose.Schema.Types.Number, required: true },
		actionsResult: [{ type: mongoose.Schema.Types.Mixed }],
		hasInstancePassed: { type: mongoose.Schema.Types.Boolean, required: true },
	},
	{ timestamps: true },
);

export const BuildInstanceResults = mongoose.model("BuildInstanceResults", BuildInstanceResultsSchema);
