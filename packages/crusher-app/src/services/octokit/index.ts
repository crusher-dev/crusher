import { Octokit } from "@octokit/rest";

class OctokitManager {
	octokit: Octokit;
	constructor(accessToken: string) {
		this.octokit = new Octokit({ auth: accessToken });
	}

	getReposForAuthenticatedUser() {
		return this.octokit.repos.listForAuthenticatedUser();
	}

	getInstallationsUserCanAccess() {
		return this.octokit.apps.listInstallationsForAuthenticatedUser();
	}
}

export { OctokitManager };
