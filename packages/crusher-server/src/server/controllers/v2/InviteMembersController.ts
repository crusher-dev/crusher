import { Inject, Service } from 'typedi';
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from 'routing-controllers';
import UserService from '../../../core/services/UserService';
import { InviteMembersService } from '../../../core/services/mongo/inviteMembers';
import { iInviteProjectMembersRequest } from '../../../../../crusher-shared/types/request/inviteProjectMemebersRequest';
import { iInviteTeamMembersRequest } from '../../../../../crusher-shared/types/request/inviteTeamMembersRequest';
import { EmailManager } from '../../../core/manager/EmailManager';
import { INVITE_REFERRAL_TYPES } from '../../../../../crusher-shared/types/inviteReferral';
import { iInviteLinkResponse } from '../../../../../crusher-shared/types/response/inviteLinkResponse';

@Service()
@JsonController("/v2/invite")
export class InviteMembersController {
	@Inject()
	private userService: UserService;
	@Inject()
	private inviteMembersService: InviteMembersService;

	@Authorized()
	@Post("/project/members/:projectId")
	async inviteProjectMembers(@CurrentUser({required: true}) user, @Param("projectId") projectId: number, @Body() body: iInviteProjectMembersRequest): Promise<iInviteLinkResponse> {
		const {emails} = body;
		const {user_id, team_id} = user;
		const userRecord = await this.userService.getUserInfo(user_id);
		const code = await this.inviteMembersService.createProjectInviteCode(projectId, team_id, null, emails);
		const userName = userRecord.first_name + " " + userRecord.last_name;

		if(emails && emails.length) {
			await EmailManager.sendInvitations(emails, {code: code, type: INVITE_REFERRAL_TYPES.PROJECT}, {orgName: `${userName}'s Workspace`, adminName: userName});
		}

		return {
			status: "Invitation sent",
			code: code,
		};
	}

	@Authorized()
	@Post("/team/members")
	async inviteTeamMembers(@CurrentUser({required: true}) user, @Body() body: iInviteTeamMembersRequest): Promise<iInviteLinkResponse> {
		const { user_id, team_id } = user;
		const {emails} = body;
		const userRecord = await this.userService.getUserInfo(user_id);
		const userName = userRecord.first_name + " " + userRecord.last_name;


		const code = await this.inviteMembersService.createTeamInviteCode( team_id, null, emails);

		if(emails && emails.length) {
			await EmailManager.sendInvitations(emails, {code: code, type: INVITE_REFERRAL_TYPES.TEAM}, {orgName: `${userName}'s Workspace`, adminName: userName});
		}

		return {
			status: "Invitation sent",
			code: code,
		};
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
