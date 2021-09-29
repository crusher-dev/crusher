import { iAction } from "crusher-shared/types/action";

class ParserChecks {
	static validateActions(actions: iAction[]): void {
		if (!actions.length) {
			throw new Error("No Actions provided");
		}

		if (actions[0].type !== ("BROWSER_SET_DEVICE" as any)) {
			throw new Error("First action should always be to set the device");
		}
	}
}

export { ParserChecks };
