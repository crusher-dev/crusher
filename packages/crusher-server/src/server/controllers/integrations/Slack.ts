import { Authorized, CurrentUser, Get, JsonController, MethodNotAllowedError, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import UserService from "../../../core/services/UserService";

@Service()
@JsonController("/integration/slack")
export class Slack {
	@Inject()
	private userService: UserService;

	@Get("/add_to_slack")
	// Return webhook url to particular channel after
	async connectGithub(@Res() res) {
		if (!process.env.GITHUB_CLIENT_ID) {
			throw new MethodNotAllowedError();
		}
	}
}
