import * as mongoose from "mongoose";

const TeamInviteReferralsSchema = new mongoose.Schema(
	{
		teamId: { type: mongoose.Schema.Types.Number, required: true },
		expiresOn: { type: mongoose.Schema.Types.Date, required: false },
		meta: { type: mongoose.Schema.Types.Mixed, required: false },
	},
	{ timestamps: true },
);

export const TeamInviteReferrals = mongoose.model("TeamInviteReferrals", TeamInviteReferralsSchema);
