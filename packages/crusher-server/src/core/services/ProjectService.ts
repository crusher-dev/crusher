import { Container, Service } from "typedi";
import { DBManager } from "@modules/db";
import { Project } from "../interfaces/db/Project";
import { InsertRecordResponse } from "../interfaces/services/InsertRecordResponse";
import { iProjectInfoResponse } from "@crusher-shared/types/response/projectInfoResponse";
import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";
import { iUser } from "@crusher-shared/types/db/iUser";
import { TEAM_ROLE_TYPES } from "@crusher-shared/types/db/teamRole";
import { iAllProjectsItemResponse } from "@crusher-shared/types/response/allProjectsResponse";
import { iJobReports } from "@crusher-shared/types/db/jobReports";
import { JobReportStatus } from "@crusher-shared/types/jobReportStatus";
import { ProjectHealthStatus } from "@crusher-shared/types/projectHelathStatus";
import { JobStatus } from "../interfaces/JobStatus";
import { iProject } from "@crusher-shared/types/db/project";

@Service()
export default class ProjectService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async getAllProjectsOfTeam(teamId: number): Promise<Array<iProject>> {
		return this.dbManager.fetchAllRows(`SELECT * FROM projects WHERE team_id = ?`, [teamId]);
	}

	async isUserInProject(projectId: number, userId: number) {
		// @NOTE: Currently all the members of the same team have access to all the projects.
		const record = await this.dbManager.fetchSingleRow(
			"SELECT * FROM projects, users WHERE projects.id=? AND users.team_id=projects.team_id AND users.id = ?",
			[projectId, userId],
		);
		return !!record;
	}

	async getHealth(projectId: number) {
		const allJobsThisMonth: Array<iJobReports> = await this.dbManager.fetchAllRows(
			"SELECT * FROM job_reports WHERE job_reports.project_id = ? AND job_reports.created_at > NOW() - interval 43200 minute",
			[projectId],
		);
		const passedTests = allJobsThisMonth.filter((jobReport) => jobReport.status === JobReportStatus.PASSED);
		const totalTests = allJobsThisMonth.filter((jobReport) => jobReport.status !== JobReportStatus.RUNNING);
		let percentage = 0;
		if (totalTests.length === 0) percentage = 0;
		else percentage = (passedTests.length / totalTests.length) * 100;

		return {
			health: percentage,
		};
	}

	async getLastBuildStatus(projectId: number) {
		const lastBuild = await this.dbManager.fetchSingleRow(
			"SELECT job_reports.status as status FROM jobs, job_reports WHERE jobs.project_id = ? AND job_reports.job_id = jobs.id AND job_reports.status != ? ORDER BY jobs.created_at DESC LIMIT 1",
			[projectId, JobReportStatus.RUNNING],
		);
		if (!lastBuild) {
			return ProjectHealthStatus.NOT_ENOUGH_DATA;
		}

		if (lastBuild.status === JobReportStatus.PASSED) return ProjectHealthStatus.UP;

		return ProjectHealthStatus.DOWN;
	}

	async getHoursSavedMetric(projectId: number) {
		const noTests = await this.dbManager.fetchSingleRow(`SELECT COUNT(*) as count FROM tests WHERE project_id = ?`, [projectId]);
		const noJobs = await this.dbManager.fetchSingleRow(`SELECT COUNT(*) as count from jobs WHERE project_id = ?`, [projectId]);
		return (noTests.count * 5 * 25 + 2 * noJobs.count) / 60;
	}

	async getAverageBuildTime(projectId: number) {
		const averageBuildTimeRecord = await this.dbManager.fetchSingleRow(
			`SELECT AVG(TIMESTAMPDIFF(SECOND, created_at, updated_at)) as avgTime FROM jobs WHERE status = ? AND project_id = ?`,
			[JobStatus.FINISHED, projectId],
		);

		return averageBuildTimeRecord.avgTime;
	}

	async createProject(projectName: string, teamId: number): Promise<InsertRecordResponse> {
		return this.dbManager.insert("INSERT INTO projects SET ?", {
			name: projectName,
			team_id: teamId,
		});
	}

	async updateProjectName(name: string, projectId: number): Promise<iProjectInfoResponse> {
		return this.dbManager.fetchSingleRow("UPDATE projects SET name = ? WHERE id = ?", [name, projectId]);
	}

	async getProject(projectId: number): Promise<iProjectInfoResponse> {
		const project: Project = await this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE id=?", [projectId]);
		return { id: project.id, name: project.name, team_id: project.team_id };
	}

	async getProjectMembers(projectId: number): Promise<Array<iMemberInfoResponse>> {
		return this.dbManager
			.fetchAllRows(
				"SELECT users.*, user_project_roles.role role FROM users, projects, user_project_roles WHERE users.id = user_project_roles.user_id AND user_project_roles.user_id = users.id AND user_project_roles.project_id = ?",
				[projectId],
			)
			.then((res: Array<any>) => {
				return res.map((member: iUser & { role: TEAM_ROLE_TYPES }) => {
					return {
						id: member.id,
						name: `${member.name}`,
						email: member.email,
						role: member.role,
						team_id: member.team_id,
					};
				});
			});
	}

	async getAllProjects(teamId: number) {
		return this.dbManager.fetchAllRows("SELECT id, name, team_id FROM projects WHERE team_id=?", [teamId]);
	}

	async getAllProjectsOfUser(userId: number): Promise<Array<iAllProjectsItemResponse>> {
		const projects: Array<Project> = await this.dbManager.fetchAllRows(
			"SELECT projects.* FROM projects, users WHERE projects.team_id=users.team_id AND users.id=?",
			[userId],
		);

		const out = [];
		for (let i = 0; i < projects.length; i++) {
			const project = projects[i];
			const noTests = await this.dbManager.fetchSingleRow("SELECT COUNT(*) as totalTestCount FROM tests WHERE tests.project_id = ?", [project.id]);

			// @TODO: DO this in a single query.
			out.push({
				id: project.id,
				name: project.name,
				team_id: project.team_id,
				noTests: noTests.totalTestCount,
				created_at: project.created_at,
			});
		}
		return out;
	}

	async deleteProject(projectId: number) {
		return this.dbManager.fetchSingleRow("DELETE FROM projects WHERE id = ?", [projectId]);
	}

	async createDefaultProject(teamId: number, name?: string) {
		return this.dbManager.insert("INSERT INTO projects SET ?", {
			name: "Default",
			team_id: teamId,
		});
	}
}
