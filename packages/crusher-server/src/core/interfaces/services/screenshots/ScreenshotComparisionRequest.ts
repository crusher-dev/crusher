import { ScreenShotComparisionStatus } from '../../ScreenShotComparisionStatus';

export interface ScreenshotComparisionRequest {
	screenshotId: number;
	referenceScreenshotId: number;
	status: ScreenShotComparisionStatus;
	referenceInstanceId: number;
	visualDiffUrl: string;
	visualDiffDelta: number;
}
