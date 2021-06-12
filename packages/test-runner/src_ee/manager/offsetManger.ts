let bootAfterNJobsOffset = Number.MAX_SAFE_INTEGER;

export class BootAfterNJobsOffsetManager {
	static set(offset) {
		bootAfterNJobsOffset = offset;
		return offset;
	}

	static get() {
		return bootAfterNJobsOffset;
	}
}
