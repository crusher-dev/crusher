import { Service } from "typedi";

@Service()
class SegmentManager {
	segment: any | undefined;

	constructor() {
		if (!process.env.EVENT_INGEST_KEY) {
			console.error("No tracking ingest key provided in environment");
			return;
		}
	}

	trackEvent() {}
}

export { SegmentManager };
