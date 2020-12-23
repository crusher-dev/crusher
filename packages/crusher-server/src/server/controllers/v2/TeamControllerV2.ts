import { Container, Inject, Service } from "typedi";
import {
	Authorized,
	CurrentUser,
	Get,
	JsonController,

} from "routing-controllers";
import DBManager from "../../../core/manager/DBManager";
import TeamService from "../../../core/services/TeamService";

@Service()
@JsonController("/v2/team")
export class TeamControllerV2 {
	@Inject()
	private teamService: TeamService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Get("/get/members")
	async getProjectInfo(@CurrentUser({required: true}) user: any, ) {
		const {team_id} = user;

		return this.teamService.getMembersInTeam(team_id);
	}
}
