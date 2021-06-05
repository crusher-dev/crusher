import DBManager from "../../manager/DBManager";
import { Container, Service } from "typedi";
import { CreateTeamRequest } from "../../interfaces/services/team/CreateTeamRequest";
import { TierPlan } from "../../interfaces/TierPlan";
import { TEAM_CREATED } from "../../../constants";

@Service()
export class TeamV2Service {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTeam(userId: number, teamName: string, teamEmail: string, tier: TierPlan, stripeCustomerId: string): Promise<number> {
		const teamRecord = await this.dbManager.insertData("INSERT INTO teams SET ?", {
			name: teamName,
			team_email: teamEmail,
			tier: TierPlan.FREE,
			stripe_customer_id: stripeCustomerId,
		});

		return teamRecord.insertId;
	}
}
