import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Post } from "routing-controllers";
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
		const teamRecord = await this.teamsService.getTeam(user.team_id);
		const finalMeta = teamRecord.meta ? { ...JSON.parse(teamRecord.meta), ...body.meta } : body.meta;

		await this.teamsService.updateMeta(JSON.stringify(finalMeta), user.team_id);
		return "Successful";
	}

	@Authorized()
	@Get("/teams/users/")
	async getUsersInTeam(@CurrentUser({ required: true }) user) {
		return (await this.teamsService.getUsersWithRolesInTeam(user.team_id)).map((userRecord) => ({
			id: userRecord.id,
			name: userRecord.name,
			email: userRecord.email,
			role: userRecord.role,
		}));
	}
}

export { TeamsController };
