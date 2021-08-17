import { ACTIONS_TO_LABEL_MAP } from "@crusher-shared/constants/recordedActions";

export const getStatusString = (type) => {
	switch (type) {
		case "PASSED":
			return "Your build has passes succesfully. No review is required";
			break;
		case "FAILED":
			return "Your build has failed. Please see reports to see what went wrong.";
			break;
		case "REVIEW_REQUIRED":
			return "Your build requires some review. Please see reports.";
			break;
		case "INITIATED":
			return "Your build has been initiated.";
			break;
		default:
			return "We're running your test";
	}
};

export const showReviewButton = (type) => {
	switch (type) {
		case "FAILED":
			return true;
			break;
		case "REVIEW_REQUIRED":
			return true;
			break;
		default:
			return false;
	}
};

export const getActionLabel = (type) => {
	return ACTIONS_TO_LABEL_MAP[type] ? ACTIONS_TO_LABEL_MAP[type] : false;
};
