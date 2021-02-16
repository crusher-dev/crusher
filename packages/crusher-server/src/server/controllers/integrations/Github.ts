import { JsonController, Get, Authorized, CurrentUser, Post, Param, Body } from "routing-controllers";
import { Inject, Service } from "typedi";
import { GitIntegrationsService } from "../../../core/services/mongo/gitIntegrations";
import { iLinkGithubRepoRequest } from "../../../../../crusher-shared/types/request/linkGithubRepoRequest";
import { iLinkGithubRepoResponse } from "@crusher-shared/types/response/iLinkGithubRepoResponse";

@Service()
@JsonController("/github")
export class GitIntegrationsController {
	@Inject()
	private gitIntegrationsService: GitIntegrationsService;

	@Authorized()
	@Post("/link")
	async linkGithubRepo(@CurrentUser({ required: true }) user, @Body() body: iLinkGithubRepoRequest): Promise<iLinkGithubRepoResponse> {
		const { user_id } = user;
		const { projectId, repoId, repoName, repoLink } = body;
		const doc = await this.gitIntegrationsService.linkRepo(repoId, repoName, repoLink, projectId, user_id);
		return { ...(doc.toObject() as any), _id: doc._id.toString() };
	}

	@Authorized()
	@Get("/repos/list/:projectId")
	async getLinkedReposList(@CurrentUser({ required: true }) user, @Param("projectId") projectId: number) {
		return this.gitIntegrationsService.getLinkedRepos(projectId);
	}

	@Authorized()
	@Get("/repos/unlink/:integrationId")
	async unlinkGithubIntegration(@CurrentUser({ required: true }) user, @Param("integrationId") integrationId: string) {
		return this.gitIntegrationsService.unlinkRepo(integrationId);
	}
}
