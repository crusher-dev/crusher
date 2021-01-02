import { Inject, Service } from 'typedi';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { iSignupUserRequest } from '../../../../../crusher-shared/types/request/signupUserRequest';
import { EmailManager } from '../../../core/manager/EmailManager';
import { generateVerificationCode } from '../../../core/utils/auth';
import { UserV2Service } from '../../../core/services/v2/UserV2Service';
import { USER_REGISTERED } from '../../../constants';

@Service()
@JsonController(`/v2/user`)
export class UserControllerV2 {
	@Inject()
	private userService: UserV2Service;

	/**
	 * Creates new user entry. And sends a link to DB.
	 */
	@Post("/signup")
	async createUser(@Body() userInfo: iSignupUserRequest, @Res() res) {
		const { firstName, lastName, email, password, inviteReferral } = userInfo;

		const userId = await this.userService.createUserRecord(userInfo, false);
		const { teamId } = inviteReferral ? await this.userService.useReferral(userId, inviteReferral) : await this.userService.createInitialUserWorkspace(userId, userInfo);

		const token = await this.userService.setUserAuthCookies(userId, teamId, res);

		EmailManager.sendVerificationMail(email, generateVerificationCode(userId, email));
		return { status: USER_REGISTERED, token};
	}
}
