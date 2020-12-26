import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { Project } from "../interfaces/db/Project";
import { InsertRecordResponse } from "../interfaces/services/InsertRecordResponse";
import {iProjectInfoResponse} from "@crusher-shared/types/response/projectInfoResponse";
import { iMemberInfoResponse } from '@crusher-shared/types/response/membersInfoResponse';
import { User } from '../../../../crusher-shared/types/db/user';
import { TEAM_ROLE_TYPES } from '@crusher-shared/types/db/teamRole';
import { iAllProjectsItemResponse } from '@crusher-shared/types/response/allProjectsResponse';

@Service()
export default class ProjectService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async isUserInProject(projectId: number, userId: number) {
		// @NOTE: Currently all the members of the same team have access to all the projects.
		const record = await this.dbManager.fetchSingleRow(
			"SELECT * FROM projects, users WHERE projects.id=? AND users.team_id=projects.team_id AND users.id = ?",
			[projectId, userId],
		);
		return !!record;
	}

	async getNoBuildsTodayOfProject(projectId: number) {
		return this.dbManager.fetchSingleRow(
			"SELECT COUNT(*) as count FROM job_reports WHERE job_reports.project_id = ? AND cast(job_reports.created_at as Date) = cast(NOW() as date);",
			[projectId],
		);
	}

	async createProject(projectName: string, teamId: number): Promise<InsertRecordResponse> {
		return this.dbManager.insertData("INSERT INTO projects SET ?", {
			name: projectName,
			team_id: teamId,
		});
	}

	async updateProjectName(name: string, projectId: number) : Promise<iProjectInfoResponse>{
		return this.dbManager.fetchSingleRow("UPDATE projects SET name = ? WHERE id = ?", [
			name,
			projectId
		]);
	}

	async getProject(projectId: number) : Promise<iProjectInfoResponse>{
		const project: Project = await this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE id=?", [projectId]);
		return { id: project.id, name: project.name, team_id: project.team_id };
	}

	async getProjectMembers(projectId: number) : Promise<Array<iMemberInfoResponse>>{
		return this.dbManager.fetchData("SELECT users.*, user_project_roles.role role FROM users, projects, user_project_roles WHERE users.id = user_project_roles.user_id AND user_project_roles.user_id = users.id AND user_project_roles.project_id = ?", [projectId]).then((res: Array<any>)=>{
			return res.map((member: User & {role: TEAM_ROLE_TYPES})=>{
				return {
					id: member.id,
					name: `${member.first_name} ${member.last_name}`,
					email: member.email,
					role: member.role,
					team_id: member.team_id
				}
			});
		});
	}

	async getAllProjects(teamId: number) {
		const projects = await this.dbManager.fetchData("SELECT * FROM projects WHERE team_id=?", [teamId]);
		return projects.map((project) => {
			return { id: project.id, name: project.name, team_id: project.team_id };
		});
	}

	async getAllProjectsOfUser(userId: number): Promise<Array<iAllProjectsItemResponse>> {
		const projects: Array<Project> = await this.dbManager.fetchData(
			"SELECT projects.* FROM projects, users WHERE projects.team_id=users.team_id AND users.id=?",
			[userId],
		);

		const out = [];
		for (let i = 0; i < projects.length; i++) {
			const project = projects[i];
			const noTests = await this.dbManager.fetchSingleRow("SELECT COUNT(*) as totalTestCount FROM tests WHERE tests.project_id = ?", [project.id]);

			// @TODO: DO this in a single query.
			out.push({ id: project.id, name: project.name, team_id: project.team_id, noTests: noTests.totalTestCount, created_at: project.created_at });
		}
		return out;
	}

	async deleteProject(projectId: number) {
		return this.dbManager.fetchSingleRow("DELETE FROM projects WHERE id = ?", [projectId]);
	}

	async createDefaultProject(teamId: number, name?: string) {
		return this.dbManager.insertData("INSERT INTO projects SET ?", {
			name: "Default",
			team_id: teamId,
		});
	}
}
