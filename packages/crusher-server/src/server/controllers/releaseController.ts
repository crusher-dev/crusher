import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { fetch } from "@utils/fetch";

class holdReleaseInfo {
	static data = null;
}

@Service()
@JsonController("/release")
export class ReleaseController {
	@Get("/info")
	async getElectronAppReleaseInfo(): Promise<any> {
		if (holdReleaseInfo.data !== null) return holdReleaseInfo.data;
		const data: any = await fetch("https://api.github.com/repos/crusherdev/celectron-releases/releases/latest");

		holdReleaseInfo.data = { assets: data.assets };
		return holdReleaseInfo.data;
	}
}
