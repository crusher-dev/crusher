// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Chrome = typeof chrome !== "undefined" ? (chrome as any) : null;

const checkIfExtensionPresent = (): Promise<boolean> => {
	return new Promise((resolve) => {
		Chrome.runtime.sendMessage(
			"fdbnpjonlhmjhjfojacolckkbipcecoe",
			{ message: "version" },
			function (reply: any) {
				if (reply && reply.version) {
					resolve(true);
				} else {
					resolve(false);
				}
			},
		);
	});
};

export { checkIfExtensionPresent };
