import { UsersService } from "@modules/resources/users/service";
import { JsonController, Get, Authorized, BadRequestError, Post, Param, CurrentUser, Body, QueryParams, Params } from "routing-controllers";
import { Inject, Service } from "typedi";
import { ProxyService } from "./service";

@Service()
@JsonController("")
export class ProxyController {
	@Inject()
	private projectService: ProxyService;

    @Post("/proxy/actions/validate.response")
    async validateProxyResponse(@Body() body: { url: string }) {
        return this.projectService.validateResponse(body.url);
    }
}