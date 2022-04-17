import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ICreateCodeTemplatePayload, IUpdateCodeTemplatePayload } from "./codeTemplate/interface";
import { CodeTemplateService } from "./codeTemplate/service";
import { TeamsService } from "./service";

@Service()
@JsonController("")
class TeamsController {
	@Inject()
	private teamsService: TeamsService;
	@Inject()
	private codeTemplateService: CodeTemplateService;

	@Authorized()
	@Post("/teams/actions/save.code")
	async createProjectEnvironment(@CurrentUser({ required: true }) user, @Body() body: Omit<ICreateCodeTemplatePayload, "teamId">) {
		const record = await this.codeTemplateService.create({ ...body, teamId: user.team_id });
		const codeTemplate = await this.codeTemplateService.get(record.insertId);
		return codeTemplate;
	}

	@Authorized()
	@Post("/teams/actions/update.codeTemplate")
	async updateCodeTemplate(@CurrentUser({ required: true }) user, @Body() body: IUpdateCodeTemplatePayload) {
		const record = await this.codeTemplateService.update(body);
		const codeTemplate = await this.codeTemplateService.get(body.id);
		return codeTemplate;
	}

	@Authorized()
	@Post("/teams/actions/delete.codeTemplate")
	async deleteCodeTemplate(@CurrentUser({ required: true }) user, @Body() body: { id: number }) {
		await this.codeTemplateService.delete(body.id);
		return { status: "Success" };
	}

	@Authorized()
	@Get("/teams/actions/get.codeTemplates")
	async getCodeTemplates(@CurrentUser({ required: true }) user) {
		const codeTemplates = await this.codeTemplateService.getCodesForTeam(user.team_id);
		return codeTemplates;
	}

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
		return (await this.teamsService.getUsersWithRolesInTeam(user.team_id)).map((userRecord) => {
			return {
				id: userRecord.id,
				name: userRecord.name,
				email: userRecord.email,
				role: userRecord.role,
			};
		});
	}
}

export { TeamsController };
