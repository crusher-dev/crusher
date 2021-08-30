import { Get, JsonController, Req, Res } from "routing-controllers";
import { Service } from "typedi";
import axios from "axios";
import { fetch } from "@utils/fetch";

@Service()
@JsonController("/release")
export class ReleaseController {
	@Get("/info")
	async getElectronAppReleaseInfo(@Req() req: any, @Res() res: any): Promise<any> {
		const data: any = await fetch("https://api.github.com/repos/crusherdev/electron/releases/latest");
		return { assets: data.assets };
	}
}
