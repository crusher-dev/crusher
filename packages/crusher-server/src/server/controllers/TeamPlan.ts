import { JsonController } from 'routing-controllers';
import { Container, Inject, Service } from 'typedi';
import DBManager from '../../core/manager/DBManager';
import UserService from '../../core/services/UserService';
import GoogleAPIService from '../../core/services/GoogleAPIService';
import TeamService from '../../core/services/TeamService';
import ProjectService from '../../core/services/ProjectService';

@Service()
@JsonController('/user')
export class TeamPlan {
	@Inject()
	private userService: UserService;
	@Inject()
	private googleAPIService: GoogleAPIService;
	@Inject()
	private teamService: TeamService;
	@Inject()
	private projectService: ProjectService;

	private dbManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}
}
