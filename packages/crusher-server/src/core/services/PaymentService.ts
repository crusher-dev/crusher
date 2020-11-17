import { Container, Inject, Service } from 'typedi';
import TeamService from './TeamService';
import StripeManager from '../manager/StripeManager';
import DBManager from '../manager/DBManager';
import { HttpError } from 'routing-controllers';

@Service()
export default class PaymentService {
	@Inject()
	private teamService: TeamService;
	@Inject()
	private stripeManager: StripeManager;
	@Inject()
	private dbManager: DBManager;

	async getDataFromStripe(teamId) {
		const { stripe_customer_id } = await this.teamService.getTeamInfo(teamId);
		const cardsPromise = this.stripeManager.getCustomerCards(stripe_customer_id);
		const currentSubscription = this.stripeManager.getCurrentSubscription(stripe_customer_id);
		const getAllInvoice = this.stripeManager.getAllInvoices(stripe_customer_id);
		const getCurrentInvoice = this.stripeManager.getCurrentInvoice(stripe_customer_id);
		const [card, current_subscription, past_invoices, current_invoices] = await Promise.all([
			cardsPromise,
			currentSubscription,
			getAllInvoice,
			getCurrentInvoice,
		]);
		return [card, current_subscription, past_invoices, current_invoices];
	}

	async getOnHoldStatus(teamId) {
		const { on_hold } = await this.teamService.getTeamInfo(teamId);
		return on_hold;
	}

	async getPlanData(planIds: number[]) {
		return this.dbManager.fetchData(`SELECT * from pricing_plan where id IN (?)`, [planIds]);
	}

	async getPlans(teamId) {
		const featurePlansPromise = this.dbManager.fetchData(
			`SELECT * from pricing_plan where listing_type = 'FEATURED' || listing_type = 'FEATURED_ADDON' & listing_type = 'FEATURED_ADDON'`,
			[],
		);
		const currentPlanPromise = this.dbManager.fetchData(
			`Select pricing_plan.*,team_pricing_log.* from pricing_plan,team_pricing_log where team_pricing_log.team_id = ? and team_pricing_log.ongoing= true and team_pricing_log.plan_id = pricing_plan.id `,
			[teamId],
		);
		const [featurePlan, currentPlan] = await Promise.all([featurePlansPromise, currentPlanPromise]);
		return [featurePlan, currentPlan];
	}

	private async addNewTeamPricingLog(teamId, planId, paymentType, stripe_subscription_item_id = null) {
		await this.dbManager.insertData(`INSERT INTO team_pricing_log SET ?`, {
			team_id: teamId,
			plan_id: planId,
			payment_type: paymentType,
			ongoing: 1,
			stripe_subscription_item_id,
		});
	}

	async addPlan(team_id, subscriptionId, planId) {
		const [{ stripe_pricing_id }] = await this.getPlanData([planId]);
		const { id: subscriptionItemId } = await this.stripeManager.addItemInSubscription(
			subscriptionId,
			stripe_pricing_id,
		);
		await this.addNewTeamPricingLog(team_id, planId, 'Stripe', subscriptionItemId);
	}

	async removePlan(pricingLogId) {
		const { stripe_subscription_item_id: stripeSubscriptionItemId } = await this.dbManager.fetchSingleRow(
			`Select * from team_pricing_log where id=?`,
			pricingLogId,
		);
		await this.stripeManager.deleteSubscriptionItems(stripeSubscriptionItemId);
		const makePlanInactive = this.dbManager.fetchSingleRow(`UPDATE teams SET ongoing=0',  WHERE id = ?`, [
			pricingLogId,
		]);
		await makePlanInactive;
	}

	async changePlan(team_id, newPlanId, subscriptionId): Promise<object> {
		try {
			const newPlanPromise = await this.getPlanData([newPlanId]);
			const currentPlanPromise = await this.getPlans(team_id);
			const [[newPlanInfo], currentPlans] = await Promise.all([newPlanPromise, currentPlanPromise]);

			const {
				is_addon: newPlanIsAddon,
				listing_type: newPlanListingTpye,
				product_type: newPlanProductType,
			} = newPlanInfo;

			const filteredPlan = currentPlans.filter((it) => {
				return (
					it.is_addon === newPlanIsAddon &&
					it.listing_type === newPlanListingTpye &&
					it.product_type === newPlanProductType
				);
			})[0];

			await this.removePlan(filteredPlan.stripe_subscription_item_id);
			await this.addPlan(team_id, subscriptionId, newPlanId);

			return { status: 'success' };
		} catch (e) {
			throw new Error('Some error occured');
		}
	}

	async startBilling(team_id, crusherPlanIds): Promise<object> {
		const teamPromise = this.teamService.getTeamInfo(team_id);
		const planPromise = this.getPlanData(crusherPlanIds);
		const stripe_pricing_ids = (await planPromise).map((row) => row.stripe_pricing_id);

		const [{ stripe_customer_id, stripe_subscription_id }] = await Promise.all([teamPromise]);

		if (stripe_subscription_id) {
			return new HttpError(403, 'Subscription already exist. Either update plan or contact contact@crusher.dev');
		}

		const subscriptionPromise = this.stripeManager.createSubscription(stripe_customer_id, stripe_pricing_ids);
		const [{ subscriptionData }] = await Promise.all([subscriptionPromise]);
		const pricingLogPromise = subscriptionData.items.data.map((item, i) => {
			this.addNewTeamPricingLog(team_id, crusherPlanIds[i], 'Stripe', item.id);
		});
		const updateTeamPromise = this.dbManager.fetchSingleRow(
			`UPDATE teams SET type='PAID', stripe_subscription_id=? WHERE id = ?`,
			[subscriptionData.id, team_id],
		);

		await Promise.all([updateTeamPromise, ...pricingLogPromise]);
		return { status: 'success' };
	}

	// Change subscription to free plan. And delete customer.
	async switchToFreePlan(teamId) {
		const { stripe_subscription_id } = await this.teamService.getTeamInfo(teamId);
		try {
			const updateUserTypePromise = this.dbManager.fetchSingleRow(`UPDATE teams SET type='FREE' WHERE id = ?`, [
				teamId,
			]);
			const updateLogsPromise = this.dbManager.fetchSingleRow(
				`UPDATE team_pricing_log SET ongoing=false and end_at = now() WHERE team_id = ?`,
				[teamId],
			);
			const addFreePricingLog = this.addNewTeamPricingLog(teamId, 1, 'no_payment');
			const changeStripePayment = this.stripeManager.expireFreeTrial(stripe_subscription_id, 0);
			await Promise.all([updateUserTypePromise, updateLogsPromise, addFreePricingLog, changeStripePayment]);
			return { success: true };
		} catch (e) {
			return { success: false };
		}
	}
}
