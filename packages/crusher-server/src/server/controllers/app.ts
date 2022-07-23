import { BadRequestError, Get, JsonController, QueryParams, Req, Res } from "routing-controllers";
import { Service } from "typedi";
import { fetch } from "@utils/fetch";
import { response } from "express";
import { resolvePathToFrontendURI } from "@utils/uri";

@Service()
@JsonController("/")
export class AppController {
	@Get("/server/redirectToFrontend")
	async getElectronAppReleaseInfo(@Req() req: any, @Res() res: any, @QueryParams() params: { endpoint: string; }): Promise<any> {
        if(!params.endpoint) throw new BadRequestError("No endpoint passed");
        response.redirect(resolvePathToFrontendURI(params.endpoint));
        return response;
	}
}
