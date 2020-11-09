import { Service, Container } from 'typedi';
import DBManager from '../manager/DBManager';
import { TEAM_CREATED, TEAM_CREATION_FAILED } from '../../constants';
import { CreateTeamRequest } from '../interfaces/services/team/CreateTeamRequest';
import { TierPlan } from '../interfaces/TierPlan';
import { User } from '../interfaces/db/User';

@Service()
export default class TeamService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTeam(details: CreateTeamRequest) {
		const { userId, teamName, stripeCustomerId } = details;
		const user = await this.dbManager.fetchSingleRow(`SELECT * FROM users WHERE id=? AND team_id IS NULL`, [userId]);

		// Only 1 team should be allowed
		if (!user.team_id) {
			const team = await this.dbManager.insertData(`INSERT INTO teams SET ?`, {
				name: teamName,
				team_email: user.email,
				tier: TierPlan.FREE,
				stripe_customer_id: stripeCustomerId
			});
			if (team.insertId) {
				await this.dbManager.fetchSingleRow(`UPDATE users SET team_id=? WHERE id=?`, [team.insertId, userId]);
				return { status: TEAM_CREATED, teamId: team.insertId };
			} else {
				throw new Error('Team creation failed');
				return false;
			}
		}
		throw new Error('User has already joined some team');
	}

	async getTeamInfo(teamId: string): Promise<User> {
		return await this.dbManager.fetchSingleRow('SELECT * from teams WHERE id = ?', [teamId]);
	}
}
