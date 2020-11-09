import { Body, CurrentUser, Get, InternalServerError, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import UserService from '../../core/services/UserService';
import GoogleAPIService from '../../core/services/GoogleAPIService';
import { USER_NOT_REGISTERED } from '../../constants';
import TeamService from '../../core/services/TeamService';
import ProjectService from '../../core/services/ProjectService';
import PaymentService from '../../core/services/PaymentService';

@Service()
@JsonController('/plan')
export class PaymentController {
    @Inject()
    private userService: UserService;
    @Inject()
    private googleAPIService: GoogleAPIService;
    @Inject()
    private teamService: TeamService;
    @Inject()
    private projectService: ProjectService;
    @Inject()
    private paymentService: PaymentService;
    // Returns pricing plans for current user.
    // Base plan + custom plans if any. This can also be changed after starting a trials
    @Get('/get/all')
    async getPricingPlans(@CurrentUser({ required: false }) user, @Body() body) {
        const { team_id } = user;

        const stripePromise = this.paymentService.getDataFromStripe(team_id);
        const onHoldPromise = this.paymentService.getOnHoldStatus(team_id);
        const plansPromise = this.paymentService.getPlans(team_id);

        const [
            [cards, current_subscription, past_invoices, current_invoices],
            on_hold,
            [featurePlan, currentPlan],
        ] = await Promise.all([stripePromise, onHoldPromise, plansPromise]);

        return {
            on_hold: Boolean(on_hold),
            cards,
            current_subscription,
            past_invoices,
            current_invoices,
            featurePlan,
            currentPlan,
        };
    }

    // Intializes trial and create stripe subscription
    // Can be overriden for large companies.
    // In that case set trial equal false and create normal log.
    @Post('/billing/change_item')
    async changePlan(@CurrentUser({ required: false }) user, @Body() body) {
        const {new_plan_id:newPlanId,pricing_log_id: currentPricingLog} = body;
        const {team_id: teamId, subscription_id } = user;
        return this.paymentService.changePlan(teamId,newPlanId,subscription_id)
    }

    // Intializes trial and create stripe subscription
    // Can be overriden for large companies.
    // In that case set trial equal false and create normal log.
    @Post('/billing/remove_plans')
    async removeSubscriptionItem(@CurrentUser({ required: false }) user, @Body() body) {
        const { pricing_log_ids: toRemove} = body;
        return Promise.all(toRemove.map((crusherLogId)=>{
            this.paymentService.removePlan(crusherLogId)
        }))
    }

    // Intializes trial and create stripe subscription
    // Can be overriden for large companies.
    // In that case set trial equal false and create normal log.
    @Post('/billing/add_plans')
    async addSubscriptionItem(@CurrentUser({ required: false }) user, @Body() body) {
        const { team_id: teamId, subscription_id: subscriptionId } = user;
        const { new_plan_ids: newPlanIds} = body;
        return Promise.all(newPlanIds.map((crusherPlanId)=>{
            this.paymentService.addPlan(teamId,subscriptionId,crusherPlanId)
        }))
    }

    // Intializes trial and create stripe subscription
    // Can be overriden for large companies.
    // In that case set trial equal false and create normal log.
    @Post('/start/billing')
    async startUserTrial(@CurrentUser({ required: false }) user, @Body() body) {
        const { team_id: teamId } = user;
        const { plan_ids: planIds, trial =false } = body;
        return this.paymentService.startBilling(teamId,planIds)
    }

    // Intializes trial and create stripe subscription
    // Can be overriden for large companies.
    // In that case set trial equal false and create normal log.
    @Post('/stop_plan')
    async stopPlan(@CurrentUser({ required: false }) user, @Body() body) {
        const { team_id } = user;
        return this.paymentService.switchToFreePlan(team_id)
    }

    // Get all cards
    @Get('/get/cards')
    async addUserMeta(@CurrentUser({ required: false }) user, @Body() body) {
        const { user_id } = user;
        const metaArray = body;
        if (!user_id) {
            return { status: USER_NOT_REGISTERED };
        }

        return this.userService
            .addUserMeta(metaArray, user_id)
            .then(async () => {
                return { status: 'success' };
            })
            .catch((err) => {
                return new InternalServerError('Some internal error occurred');
            });
    }

    // Get all cards
    @Get('/get/current_plan')
    async getCurrentPlans(@CurrentUser({ required: false }) user, @Body() body) {
        const { user_id } = user;
        const metaArray = body;
        if (!user_id) {
            return { status: USER_NOT_REGISTERED };
        }

        return this.userService
            .addUserMeta(metaArray, user_id)
            .then(async () => {
                return { status: 'success' };
            })
            .catch((err) => {
                return new InternalServerError('Some internal error occurred');
            });
    }

    // Get all cards
    @Get('/get/invoice')
    async getInvoice(@CurrentUser({ required: false }) user, @Body() body) {
        const { user_id } = user;
        const metaArray = body;
        if (!user_id) {
            return { status: USER_NOT_REGISTERED };
        }

        return this.userService
            .addUserMeta(metaArray, user_id)
            .then(async () => {
                return { status: 'success' };
            })
            .catch((err) => {
                return new InternalServerError('Some internal error occurred');
            });
    }
}
