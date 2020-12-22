import { JsonController, Authorized, CurrentUser, Body, Post } from "routing-controllers";
import { Service, Container, Inject } from "typedi";
import DBManager from "../../core/manager/DBManager";
import UserService from "../../core/services/UserService";
import ProjectHostsService from "../../core/services/ProjectHostsService";
import ProjectService from "../../core/services/ProjectService";
import CommentsService from "../../core/services/CommentsService";

@Service()
@JsonController("/comments")
export class CommentsController {
	@Inject()
	private userService: UserService;
	@Inject()
	private projectHostService: ProjectHostsService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private commentsService: CommentsService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post("/add")
	async addComment(@CurrentUser({ required: true }) user, @Body() body) {
		const { user_id } = user;
		const userRecord = await this.userService.getUserInfo(user_id);
		const { report_id, result_id, message } = body;

		const timeNow = new Date().toISOString().slice(0, 19).replace("T", " ");
		const { insertId } = await this.commentsService.createComment({
			user_id,
			report_id,
			result_id,
			message,
			created_at: timeNow,
		});

		return {
			id: insertId,
			user_id,
			report_id,
			result_id,
			message,
			created_at: timeNow,
			user_first_name: userRecord.first_name,
			user_last_name: userRecord.last_name,
		};
	}
}
