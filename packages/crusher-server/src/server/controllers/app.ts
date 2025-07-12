import { BadRequestError, Get, JsonController, QueryParams, Req, Res } from "routing-controllers";
import { Service } from "typedi";
import { fetch } from "@utils/fetch";
import { response } from "express";
import { resolvePathToFrontendURI } from "@utils/uri";

@Service()
@JsonController("")
export class AppController {
	@Get("/server/redirectToFrontend")
	async getElectronAppReleaseInfo(@Req() req: any, @Res() res: any, @QueryParams() params: { url: string; }): Promise<any> {
                if(!params.url) throw new BadRequestError("No endpoint passed");
                return res.redirect(resolvePathToFrontendURI(params.url));
	}
}
