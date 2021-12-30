import { Service } from "typedi";
import { fetch } from "@utils/fetch";

@Service()
class GoogleAPIService {
	private accessToken: string;

	constructor(accessToken: string) {
		this.accessToken = accessToken;
	}

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}

	getProfileInfo(): Promise<any> {
		if (!this.accessToken) {
			throw Error("Setup access token for the API Service first");
		}
		return fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
			method: "GET",
			payload: { alt: "json", access_token: this.accessToken },
		});
	}
}

export { GoogleAPIService };
