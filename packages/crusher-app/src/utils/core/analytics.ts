import { getAllCookies } from "crusher-app/src/utils/common/cookieUtils";

export const waitForSegmentToLoad = () => {
	return new Promise((res) => {
		const timer = setInterval(() => {
			if (window["analytics"]) {
				res();
				clearInterval(timer);
			}
		}, 100);
	});
};
export class Analytics {
	static async identify(name: string, userId, email: string, teamID, planType, selfHost: boolean, mode) {
		const isBotUser = email.includes("testing-") && email.includes("crusher.dev");
		const emailToTrack = isBotUser ? "bot@crusher.dev" : email;
		const userIdToTrack = isBotUser ? "9999999999999" : userId;
		await waitForSegmentToLoad();
		window["analytics"].identify(userIdToTrack, {
			name,
			teamID,
			email: emailToTrack,
			planType,
			selfHost,
			mode,
		});

		const CRUSHER_USER_ID = getAllCookies()["CRUSHER_USER_ID"];
		if (CRUSHER_USER_ID) {
			window["analytics"].identify(CRUSHER_USER_ID, {
				email,
			});
		}
	}

	static async trackPage() {
		await waitForSegmentToLoad();
		window["analytics"].page();
	}
}
