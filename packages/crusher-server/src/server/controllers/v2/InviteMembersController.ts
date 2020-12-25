import { Inject, Service } from "typedi";
import { Authorized, CurrentUser, Get, JsonController, Param } from 'routing-controllers';
import UserService from '../../../core/services/UserService';
import { createProjectInviteLinkCode } from '../../../utils/url';

@Service()
@JsonController("/v2/invite")
export class InviteMembersController {
	@Inject()
	private userService: UserService;

	@Authorized()
	@Get("/project/members/:projectId")
	async getProjectMembers(@CurrentUser({required: true}) user, @Param("projectId") projectId: number) {
		const {user_id, team_id} = user;
		const code = createProjectInviteLinkCode(projectId, team_id);

		return {
			status: "Invitation sent",
			code: code
		}
	}

	@Authorized()
	@Get("/accept/project/:inviteCode")
	async acceptProjectInvitation(@CurrentUser({required: true}) user, @Param("projectId") projectId: number) {
		const {user_id, team_id} = user;
		const code = createProjectInviteLinkCode(projectId, team_id);

		return {
			status: "Invitation sent",
			code: code
		}
	}

	@Authorized()
	@Get("/accept/team/:inviteCode")
	async acceptTeamInvite(@CurrentUser({required: true}) user, @Param("projectId") projectId: number) {
		const {user_id, team_id} = user;
		const code = createProjectInviteLinkCode(projectId, team_id);

		return {
			status: "Invitation sent",
			code: code
		}
	}

}
