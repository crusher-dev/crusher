import { Get, JsonController, Req, Res } from "routing-controllers";
import { Service } from "typedi";
import { fetch } from "@utils/fetch";

class holdReleaseInfo {
	static data = null;
}

@Service()
@JsonController("/release")
export class ReleaseController {
	@Get("/info")
	async getElectronAppReleaseInfo(@Req() req: any, @Res() res: any): Promise<any> {

		if(holdReleaseInfo.data !== null) return holdReleaseInfo.data;
		const data: any = await fetch("https://api.github.com/repos/crusherdev/electron/releases/latest");

		holdReleaseInfo.data = { assets: data.assets }
		return holdReleaseInfo.data;
	}
}
