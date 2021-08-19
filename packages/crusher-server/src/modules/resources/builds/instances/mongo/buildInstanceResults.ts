import * as mongoose from "mongoose";

const BuildInstanceResultsSchema = new mongoose.Schema(
	{
		instanceId: { type: mongoose.Schema.Types.Number, required: true },
		actionsResult: [{ type: mongoose.Schema.Types.Mixed }],
		hasInstancePassed: { type: mongoose.Schema.Types.Boolean, required: true },
	},
	{ timestamps: true },
);

export interface IBuildInstanceResult {
	instanceId: number;
	actionsResult: Array<any>;
	hasInstancePassed: boolean;
}

export const BuildInstanceResults = mongoose.model<IBuildInstanceResult>("BuildInstanceResults", BuildInstanceResultsSchema);
