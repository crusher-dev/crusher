import { Service } from "typedi";
import { Logger } from "@utils/logger";

@Service()
class SegmentManager {
	segmentKey: Stripe | undefined;

	constructor() {
		if (!process.env.EVENT_INGEST_KEY) {
			Logger.error("No tracking ingest key provided in environment");
			return;
		}
	}

	trackEvent(){

	}

}

export { SegmentManager };
