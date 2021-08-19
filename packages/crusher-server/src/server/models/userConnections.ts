import * as mongoose from "mongoose";
import { USER_CONNECTION_TYPE } from "@crusher-shared/types/userConnectionType";

const UserConnectionsSchema = new mongoose.Schema(
	{
		userId: Number,
		service: {
			type: mongoose.Schema.Types.String,
			enum: [USER_CONNECTION_TYPE.GITHUB, USER_CONNECTION_TYPE.GITLAB],
			required: true,
		},
		meta: mongoose.Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const UserConnections = mongoose.model("UserConnections", UserConnectionsSchema);
