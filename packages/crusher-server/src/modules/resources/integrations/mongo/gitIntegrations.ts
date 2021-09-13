import * as mongoose from "mongoose";

export interface iGithubIntegration {
	_id: string;
	projectId: number,
	repoId: number,
	repoName: string,
	repoLink: string;
	installationId: number,
}

const GitIntegrationsSchema = new mongoose.Schema(
	{
		projectId: Number,
		repoId: Number,
		repoName: String,
		repoLink: String,
		installationId: Number,
	},
	{ timestamps: true },
);

GitIntegrationsSchema.index({ projectId: 1, repoId: 1 }, { unique: true });

export const GitIntegrations = mongoose.model("GitIntegrations", GitIntegrationsSchema);
