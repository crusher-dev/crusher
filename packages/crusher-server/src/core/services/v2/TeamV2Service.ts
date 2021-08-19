import { DBManager } from "@modules/db";
import { Container, Service } from "typedi";
import { TierPlan } from "../../interfaces/TierPlan";

@Service()
export class TeamV2Service {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTeam(userId: number, teamName: string, teamEmail: string, tier: TierPlan, stripeCustomerId: string): Promise<number> {
		const teamRecord = await this.dbManager.insert("INSERT INTO teams SET ?", {
			name: teamName,
			team_email: teamEmail,
			tier: TierPlan.FREE,
			stripe_customer_id: stripeCustomerId,
		});

		return teamRecord.insertId;
	}
}
