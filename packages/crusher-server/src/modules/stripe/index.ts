import { Service } from "typedi";
import Stripe from "stripe";

@Service()
class StripeManager {
	stripeClient: Stripe | undefined;

	constructor() {
		if (!process.env.STRIPE_SECRET_KEY) {
			console.error("No stripe secret key provided in environment");
			return;
		}

		this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: "2020-08-27",
		});
	}

	isAvailable(): boolean {
		return !!this.stripeClient;
	}

	async createCustomer(name: string, email: string): Promise<string> {
		return this.stripeClient.customers
			.create({
				name,
				email,
			})
			.then((customer) => {
				return customer.id;
			});
	}

	getCustomerCards(stripeCustomerId: string): Stripe.ApiListPromise<Stripe.CustomerSource> {
		return this.stripeClient.customers.listSources(stripeCustomerId, {
			object: "card",
			limit: 3,
		});
	}

	getCurrentSubscription(stringCustomerId: string): Stripe.ApiListPromise<Stripe.Subscription> {
		return this.stripeClient.subscriptions.list({
			customer: stringCustomerId,
		});
	}

	async getCurrentInvoice(stringCustomerId: string): Promise<Stripe.ApiListPromise<Stripe.InvoiceLineItem> | null> {
		return this.stripeClient.invoices
			.listUpcomingLineItems({
				customer: stringCustomerId,
			})
			.catch((e) => {
				console.error(e);
				return null;
			});
	}

	getAllInvoices(stringCustomerId: string): Stripe.ApiListPromise<Stripe.Invoice> {
		return this.stripeClient.invoices.list({
			customer: stringCustomerId,
		});
	}

	async createSubscription(stripeCustomerId: string, pricesList = [], trialDays = 0): Promise<{ subscriptionData: Stripe.Response<Stripe.Subscription> }> {
		return this.stripeClient.subscriptions
			.create({
				customer: stripeCustomerId,
				trial_period_days: trialDays,
				items: pricesList.map((price) => ({ price })),
			})
			.then((subscription) => ({ subscriptionData: subscription }));
	}

	async addProductToSubscription(subscriptionId: string, pricesList: Array<string>): Promise<Array<Stripe.Response<Stripe.SubscriptionItem>>> {
		const subscriptionItemsPromise = pricesList.map((priceId) =>
			this.stripeClient.subscriptionItems.create({
				subscription: subscriptionId,
				price: priceId,
				quantity: 1,
			}),
		);

		return Promise.all(subscriptionItemsPromise);
	}

	deleteSubscriptionItems(stripe_subscription_id: string): Promise<Stripe.Response<Stripe.DeletedSubscriptionItem>> {
		return this.stripeClient.subscriptionItems.del(stripe_subscription_id);
	}

	addItemInSubscription(subscriptionId: string, priceId: string): Promise<Stripe.Response<Stripe.SubscriptionItem>> {
		return this.stripeClient.subscriptionItems.create({
			subscription: subscriptionId,
			price: priceId,
			quantity: 1,
		});
	}

	expireFreeTrial(stripeSubscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>> {
		return this.stripeClient.subscriptions.update(stripeSubscriptionId, {
			cancel_at_period_end: true,
		});
	}
}

export { StripeManager };
