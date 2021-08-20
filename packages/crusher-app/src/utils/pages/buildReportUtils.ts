import { ACTIONS_TO_LABEL_MAP } from "@crusher-shared/constants/recordedActions";
import filter from "lodash/filter";
import { IBuildReportResponse, Instance, Test } from "@crusher-shared/types/response/iBuildReportResponse";
import union from "lodash/union";
import { forEach } from "lodash";

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

export const getScreenShotsAndChecks = (steps: Array<any>) => {
	const screenShotCount = filter(steps, { actionType: "ELEMENT_SCREENSHOT" }).length;
	return { screenshotCount: screenShotCount, checksCount: steps.length };
};

export const groupTestByStatus = (tests: Pick<IBuildReportResponse, "tests">) => {
	const statusTestTestInstanceGroup = {};
	let i = 0;

	for (const test of tests) {
		const { testInstances } = test;
		for (const testInstance of testInstances) {
			const { status, id } = testInstance;
			if (!statusTestTestInstanceGroup[status]) statusTestTestInstanceGroup[status] = {};
			if (!statusTestTestInstanceGroup[status][i]) statusTestTestInstanceGroup[status][i] = [];
			statusTestTestInstanceGroup[status][i].push(id);
		}

		i++;
	}
	return statusTestTestInstanceGroup;
};

export const getAllConfiguration = (tests: Pick<IBuildReportResponse, "tests">) => {
	const parsedConfig = tests
		.map((test) => getAllConfigurationForGivenTest(test))
		.reduce((accumulator, item) => {
			Object.keys(item).forEach((key) => {
				accumulator[key] = union(accumulator[key], item[key]);
			});
			return accumulator;
		}, {});

	return parsedConfig;
};

export const getAllConfigurationForGivenTest = (test: Test) => {
	const parsedConfig = {};
	const { testInstances } = test;
	for (const testInstance of testInstances) {
		const { config } = testInstance;

		Object.entries(config).forEach(([key, value]) => {
			const configNotPresent = !parsedConfig[key]?.includes(value);
			if (configNotPresent) {
				const configKeyNotPresent = !parsedConfig[key];
				if (configKeyNotPresent) parsedConfig[key] = [];

				parsedConfig[key].push(value);
			}
		});
	}
	return parsedConfig;
};

export const getTestIndexByConfig = (test: Test, config) => {
	const { testInstances } = test;
	let i = 0;

	for (const testInstance of testInstances) {
		if (JSON.stringify(testInstance.config) === JSON.stringify(config)) {
			return i;
		}
		i++;
	}

	return 0;
};

export const getBaseConfig = (allConfiguration) => {
	const baseConfigForTest = {};
	Object.keys(allConfiguration).forEach((key) => {
		baseConfigForTest[key] = allConfiguration[key][0];
	});

	return baseConfigForTest;
};

const removeAllFailedTest = (testInstanceData: Instance) => {
	const { steps } = testInstanceData;
	let i = 0;

	for (const step of steps) {
		i++;
		if (step.status === "FAILED") {
			break;
		}
	}

	return steps.slice(0, i);
};

export const getStepsFromInstanceData = (testInstanceData) => {
	return removeAllFailedTest(testInstanceData);
};
