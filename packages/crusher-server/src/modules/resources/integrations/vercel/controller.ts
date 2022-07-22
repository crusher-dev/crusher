import { SlackService } from "@modules/slack/service";
import { Authorized, CurrentUser, Get, JsonController, Param, QueryParams, Res } from "routing-controllers";
import { Service, Inject } from "typedi";
import { VercelService } from "./service";

@Service()
@JsonController("")
class IntegrationsController {
	@Inject()
	private vercelService: VercelService;

    @Authorized()
    @Get("/integrations/vercel/actions/link")
    async linkVercelIntegration(@CurrentUser({ required: true }) user, @QueryParams() params, @Res() res) {
        const { user_id } = user;
        return this.vercelService.linkVercelIntegration(user_id);
    }
}