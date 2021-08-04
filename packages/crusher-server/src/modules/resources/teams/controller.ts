import { Authorized, BadRequestError, Body, CurrentUser, JsonController, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { TeamsService } from "./service";

@Service()
@JsonController("")
class TeamsController {
	@Inject()
	private teamsService: TeamsService;

	@Authorized()
	@Post("/teams/actions/update.meta")
	async updateTeamMeta(@CurrentUser({ required: true }) user, @Body() body: { meta: any }) {
		if (typeof body.meta !== "object") throw new BadRequestError("meta is not JSON compatible");

		await this.teamsService.updateMeta(JSON.stringify(body.meta), user.team_id);
		return "Successful";
	}
}

export { TeamsController };
