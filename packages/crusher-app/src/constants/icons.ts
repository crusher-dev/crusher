import { BuildStatus } from "@interfaces/BuildStatus";

export const BUILD_ICONS = {
	[BuildStatus.QUEUED]: "/svg/tests/buttons/queued.svg",
	[BuildStatus.RUNNING]: "/svg/tests/buttons/running.svg",
	[BuildStatus.PASSED]: "/svg/tests/buttons/approved.svg",
	[BuildStatus.FAILED]: "/svg/tests/buttons/failed.svg",
	[BuildStatus.MANUAL_REVIEW_REQUIRED]: "/svg/tests/buttons/needsReview.svg",
	[BuildStatus.TIMEOUT]: "/svg/tests/buttons/timeout.svg",
	[BuildStatus.ABORTED]: "/svg/tests/buttons/failed.svg",
};
