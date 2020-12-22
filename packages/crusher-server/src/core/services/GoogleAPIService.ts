import { Service, Container } from "typedi";
import { fetch } from "../utils/fetch";
import { BadRequestError } from "routing-controllers";

@Service()
export default class GoogleAPIService {
	private accessToken: string;

	constructor(accessToken) {
		this.accessToken = accessToken;
	}

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}

	getProfileInfo() {
		if (!this.accessToken) {
			throw new Error("Setup access token for the API Service first");
		}
		return fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
			method: "GET",
			payload: { alt: "json", access_token: this.accessToken },
		});
	}
}
