export const waitForSegmentToLoad = () => {
	return new Promise((res, rej) => {
		const timer = setInterval(() => {
			if (!!window["analytics"]) {
				res();
			}
			clearInterval(timer);
		}, 100);
	});
};
export class Analytics {
	static async identify(name, userId, teamID, planType, selfHost, mode) {
		await waitForSegmentToLoad();
		window["analytics"].identify({
			name,
			userId,
			teamID,
			planType,
			selfHost,
			mode,
		});
	}
}
