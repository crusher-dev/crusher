import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { TEAM_CREATED, TEAM_CREATION_FAILED } from "../../constants";
import { CreateTeamRequest } from "../interfaces/services/team/CreateTeamRequest";
import { TierPlan } from "../interfaces/TierPlan";
import { User } from "../../../../crusher-shared/types/db/user";
import { iMemberInfoResponse } from "../../../../crusher-shared/types/response/membersInfoResponse";
import { TEAM_ROLE_TYPES } from "../../../../crusher-shared/types/db/teamRole";

@Service()
export default class TeamService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTeam(details: CreateTeamRequest): Promise<any> {
		const { userId, teamName, stripeCustomerId } = details;
		const user = await this.dbManager.fetchSingleRow("SELECT * FROM users WHERE id=? AND team_id IS NULL", [userId]);

		// Only 1 team should be allowed
		if (!user.team_id) {
			const team = await this.dbManager.insertData("INSERT INTO teams SET ?", {
				name: teamName,
				team_email: user.email,
				tier: TierPlan.FREE,
				stripe_customer_id: stripeCustomerId,
			});
			if (team.insertId) {
				await this.dbManager.fetchSingleRow("UPDATE users SET team_id=? WHERE id=?", [team.insertId, userId]);
				return { status: TEAM_CREATED, teamId: team.insertId };
			} else {
				throw new Error("Team creation failed");
				return false;
			}
		}
		throw new Error("User has already joined some team");
	}

	async getTeamInfo(teamId: string): Promise<User> {
		return await this.dbManager.fetchSingleRow("SELECT * from teams WHERE id = ?", [teamId]);
	}

	async getMembersInTeam(teamId: number): Promise<Array<iMemberInfoResponse>> {
		return this.dbManager
			.fetchData(
				"SELECT users.*, user_team_roles.role role FROM users, teams, user_team_roles WHERE users.team_id = teams.id AND teams.id = ? AND user_team_roles.user_id = users.id AND user_team_roles.team_id = ?",
				[teamId, teamId],
			)
			.then((res: Array<any>) => {
				return res.map((member: User & { role: TEAM_ROLE_TYPES }) => {
					return {
						id: member.id,
						name: `${member.first_name} ${member.last_name}`,
						email: member.email,
						role: member.role,
						team_id: member.team_id,
					};
				});
			});
	}
}
