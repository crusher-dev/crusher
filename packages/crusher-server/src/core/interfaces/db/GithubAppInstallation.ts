import { BaseRowInterface } from './BaseRowInterface';

export interface GithubAppInstallation extends BaseRowInterface {
	owner_name: string;
	repo_name: string;
	installation_id: string;
}
