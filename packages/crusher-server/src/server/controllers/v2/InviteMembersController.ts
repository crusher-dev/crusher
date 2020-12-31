import { Inject, Service } from "typedi";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from 'routing-controllers';
import UserService from '../../../core/services/UserService';
import { InviteMembersService } from '../../../core/services/mongo/inviteMembers';
import { iInviteProjectMembersRequest } from '@crusher-shared/types/request/inviteProjectMemebersRequest';
import { iInviteTeamMembersRequest } from '@crusher-shared/types/request/inviteTeamMembersRequest';

@Service()
@JsonController("/v2/invite")
export class InviteMembersController {
	@Inject()
	private userService: UserService;
	@Inject()
	private inviteMembersService: InviteMembersService;

	@Authorized()
	@Post("/project/members/:projectId")
	async inviteProjectMembers(@CurrentUser({required: true}) user, @Param("projectId") projectId: number, @Body() body: iInviteProjectMembersRequest) {
		const {emails} = body;
		const {user_id, team_id} = user;
		const code = await this.inviteMembersService.createProjectInviteCode(projectId, team_id, null, emails);

		return {
			status: "Invitation sent",
			code: code
		}
	}

	@Authorized()
	@Post("/team/members")
	async inviteTeamMembers(@CurrentUser({required: true}) user, @Body() body: iInviteTeamMembersRequest) {
		const { team_id } = user;
		const {emails} = body;
		const code = await this.inviteMembersService.createTeamInviteCode( team_id, null, emails);

		return {
			status: "Invitation sent",
			code: code
		}
	}

	@Get("/accept/project/:inviteCode")
	async acceptProjectInvitation(@Param("inviteCode") inviteCode: string) {
		const inviteReferral = await this.inviteMembersService.verifyTeamInviteCode(inviteCode);

		return {
			status: "Valid Project invitation code",
			teamId: inviteReferral
		}
	}

	@Get("/accept/team/:inviteCode")
	async acceptTeamInvite(@Param("inviteCode") inviteCode: string) {
		const inviteReferral = await this.inviteMembersService.verifyTeamInviteCode(inviteCode);

		return {
			status: "Valid team invitation code",
			teamId: inviteReferral
		}
	}
}
