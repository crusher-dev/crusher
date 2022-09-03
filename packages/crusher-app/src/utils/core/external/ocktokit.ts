import { Octokit } from "@octokit/rest";

class OctokitManager {
	octokit: Octokit;
	constructor(accessToken: string) {
		this.octokit = new Octokit({ auth: accessToken });
	}

	getReposForInstallation(installationId) {
		return this.octokit.apps.listInstallationReposForAuthenticatedUser({
			installation_id: installationId,
			per_page: 100
		});
	}

	getInstallationsUserCanAccess() {
		return this.octokit.apps.listInstallationsForAuthenticatedUser({
			headers: {
				"If-None-Match": "",
			},
		});
	}
}

export { OctokitManager };
