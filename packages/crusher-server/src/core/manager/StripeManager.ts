import { Service } from 'typedi';
const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);
const _ = require('lodash');
@Service()
export default class StripeManager {
	async createCustomer(name: string, email: string): Promise<string> {
		try {
			const customer = await stripe.customers.create({
				name,
				email,
			});

			return customer.id;
		} catch (e) {
			throw Error(e);
		}
	}

	getCustomerCards(stripeCustomerId: string) {
		return stripe.customers.listSources(stripeCustomerId, { object: 'card', limit: 3 });
	}

	getCurrentSubscription(stringCustomerId: string) {
		return stripe.subscriptions.list({
			customer: stringCustomerId,
		});
	}

	async getCurrentInvoice(stringCustomerId: string) {
		try {
			return await stripe.invoices.listUpcomingLineItems({
				customer: stringCustomerId,
			});
		} catch (e) {
			return null;
		}
	}

	getAllInvoices(stringCustomerId: string) {
		return stripe.invoices.list({
			customer: stringCustomerId,
		});
	}

	// async getAllPlansForProducts(productIds,interval="month"){
	// 	const priceList = [];
	// 	for(let productId of productIds){
	// 		priceList.push(await stripe.plans.list({product:productId}).data.filter((interval === interval)));
	// 	}
	// 	return _.flatten(priceList).map(it => it.id)
	// }

	async createSubscription(stripe_customer_id, pricesList = [], trialDays = 0): Promise<{ subscriptionData: any }> {
		console.log({
			customer: stripe_customer_id,
			trial_period_days: trialDays,
			pricesList,
			items: pricesList.map((price) => {}),
		});
		const subscriptionData = await stripe.subscriptions.create({
			customer: stripe_customer_id,
			trial_period_days: trialDays,
			items: pricesList.map((price) => ({ price })),
		});

		return { subscriptionData };
	}

	async addProductToSubscription(subscriptionId, pricesList) {
		const subscriptionItems = pricesList.map((priceId) =>
			stripe.subscriptionItems.create({
				subscription: subscriptionId,
				price: priceId,
				quantity: 1,
			}),
		);

		await Promise.all(subscriptionItems);
	}

	deleteSubscriptionItems(stripe_subscription_id) {
		return stripe.subscriptionItems.del(stripe_subscription_id);
	}

	addItemInSubscription(subscriptionId, priceId) {
		return stripe.subscriptionItems.create({
			subscription: subscriptionId,
			price: priceId,
			quantity: 1,
		});
	}

	expireFreeTrial(stripe_subscription_id, date) {
		return stripe.subscriptions.update(stripe_subscription_id, { cancel_at_period_end: true });
	}
}
