import Analytics from "analytics-node";
import { v4 as uuidv4 } from "uuid";

var osu = require("node-os-utils");

var cpu = osu.cpu;

const client = new Analytics(process.env.ANALYTICS_ID || "nxemO36kWyedh30lfvnyxJoUCqbL0TYA", {
	flushInterval: 5,
});

function getMachineUUID() {
	return uuidv4();
}

export function identify(id) {
	// client.identify({
	//     "anonymousId": getMachineUUID(),
	//     "userId": id
	// }, (err) => {
	//     console.error(err);
	// });
}
