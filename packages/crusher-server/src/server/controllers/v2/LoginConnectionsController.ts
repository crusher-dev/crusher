import { Inject, Service } from "typedi";
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, QueryParams, Res } from "routing-controllers";
import { UserV2Service } from "../../../core/services/v2/UserV2Service";
import { resolvePathToFrontendURI } from "../../../core/utils/uri";
import GoogleAPIService from "../../../core/services/GoogleAPIService";
import { InviteMembersService } from "../../../core/services/mongo/inviteMembers";
import UserConnectionsService from "../../../core/services/v2/UserConnectionsService";
import { TokenAuthentication } from "@octokit/auth-oauth-app/dist-types/types";
import { iListOfUserLoginConnectionsResponse } from "../../../../../crusher-shared/types/response/listOfUserLoginConnections";
import { iDeleteLoginConnectionRequest } from "../../../../../crusher-shared/types/request/deleteLoginConnectionRequest";

@Service()
@JsonController(`/v2/user/connection`)
class LoginConnectionsController {
	@Inject()
	private userService: UserV2Service;
	@Inject()
	private googleAPIService: GoogleAPIService;
	@Inject()
	private inviteMembersService: InviteMembersService;
	@Inject()
	private userConnectionsService: UserConnectionsService;

	/**
	 * Redirect user to new url
	 */
	@Authorized()
	@Get("/github/callback")
	async githubAuthorizationCallback(@CurrentUser({ required: true }) user, @Res() res: any, @QueryParams() params) {
		const { user_id } = user;
		const { code } = params;
		const tokenAuthentication = (await this.userConnectionsService.parseGithubAccessToken(code)) as TokenAuthentication;

		await this.userConnectionsService.upsertGithubConnection(user_id, tokenAuthentication);
		res.redirect(resolvePathToFrontendURI("/app/settings/user/login-connections?token=" + tokenAuthentication.token));
	}

	@Authorized()
	@Get("/get")
	async getListOfUserLoginConnections(@CurrentUser({ required: true }) user): Promise<iListOfUserLoginConnectionsResponse> {
		const { user_id } = user;
		return this.userConnectionsService.getListOfUserConnections(user_id);
	}

	@Authorized()
	@Delete("/remove")
	async removeUserConnection(@CurrentUser({ required: true }) user, @Body() body: iDeleteLoginConnectionRequest) {
		const { user_id } = user;
		const { connectionId } = body;

		return this.userConnectionsService.deleteUserConnection(connectionId, user_id);
	}
}

export { LoginConnectionsController };
