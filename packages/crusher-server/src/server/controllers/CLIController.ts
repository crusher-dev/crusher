import { JsonController, Get, Authorized, CurrentUser, Post, Param } from "routing-controllers";
import { Service, Inject } from "typedi";
import ProjectService from "../../core/services/ProjectService";
import TestService from "../../core/services/TestService";
import ClIService from "../../core/services/ClIService";
import { generateToken } from "../../core/utils/auth";
import { v1 as uuidv1 } from "uuid";

@Service()
@JsonController("/cli")
export class CLIController {
	@Inject()
	private cliService: ClIService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private testService: TestService;

	@Get("/add_token/:cli_token")
	async addToken(@Param("cli_token") cliToken: string) {
		await this.cliService.addCLIToken(cliToken);
		return {
			success: true,
		};
	}

	@Authorized()
	@Post("/update/:cli_token")
	async updateTokenStatus(@CurrentUser({ required: true }) user, @Param("cli_token") cliToken: string) {
		const { user_id, team_id } = user;
		await this.cliService.updateTokenStatus(cliToken, user_id, team_id);
		return {
			success: true,
		};
	}

	@Authorized()
	@Get("/createTokenIfNotExists")
	async createTokenIfNotExists(@CurrentUser({ required: true }) user) {
		const { user_id, team_id } = user;
		const cliToken = await this.cliService.getTokenByUserId(user_id);
		if (!user_id || !cliToken) {
			const token = uuidv1();
			await this.cliService.addCLIToken(cliToken);
			await this.cliService.updateTokenStatus(cliToken, user_id, team_id);
			return token;
		} else {
			return generateToken(user_id, team_id);
		}
	}

	@Get("/status/:cli_token")
	async getTokenStatus(@Param("cli_token") cliToken: string) {
		const tokenInfo = await this.cliService.getTokenInfo(cliToken);

		const projects = await this.projectService.getAllProjects(parseInt(tokenInfo.team_id));

		const projectsWithTestList = [];

		for (const project of projects) {
			const projectTestList = await this.testService.getAllTestsInProject(project.id, true);
			projectsWithTestList.push({
				...project,
				projectTestList,
			});
		}

		return {
			status: tokenInfo.status,
			userId: tokenInfo.user_id,
			teamId: tokenInfo.team_id,
			projects: projectsWithTestList,
			requestToken: generateToken(tokenInfo.user_id, tokenInfo.team_id, "999999h"),
		};
	}
}
