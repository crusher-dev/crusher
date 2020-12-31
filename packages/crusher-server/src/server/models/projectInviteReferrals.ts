import * as mongoose from "mongoose";

const ProjectInviteReferralsSchema = new mongoose.Schema(
	{
		code: {type: String, unique: true, required: true},
		teamId: {type: mongoose.Schema.Types.Number, required: true},
		projectId: {type: mongoose.Schema.Types.Number, required: true},
		expiresOn: {type: mongoose.Schema.Types.Date, required: false},
		meta: {type: mongoose.Schema.Types.Mixed, required: false}
	},
	{ timestamps: true },
);

export const ProjectInviteReferrals = mongoose.model("ProjectInviteReferrals", ProjectInviteReferralsSchema);
