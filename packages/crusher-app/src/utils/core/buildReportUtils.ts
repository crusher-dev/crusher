import filter from "lodash/filter";
import flatten from "lodash/flatten";
import union from "lodash/union";

import { ACTIONS_TO_LABEL_MAP } from "@crusher-shared/constants/recordedActions";
import { IBuildReportResponse, Instance, Test } from "@crusher-shared/types/response/iBuildReportResponse";

export const getStatusString = (type) => {
	switch (type) {
		case "PASSED":
			return "Your build has passes succesfully. No review is required";
		case "FAILED":
			return "Your build has failed. Please see reports to see what went wrong.";
		case "MANUAL_REVIEW_REQUIRED":
			return "Your build requires some review. Please see reports.";
		case "INITIATED":
			return "Your build has been initiated.";
		default:
			return "We're running your test";
	}
};

export const showReviewButton = (type) => {
	switch (type) {
		case "FAILED":
			return true;
		case "MANUAL_REVIEW_REQUIRED":
			return true;
		default:
			return false;
	}
};

export const getActionLabel = (type) => {
	return ACTIONS_TO_LABEL_MAP[type] || false;
};

export const getScreenShotsAndChecks = (steps: any[]) => {
	const screenShotCount = filter(steps, { actionType: "ELEMENT_SCREENSHOT" }).length;
	return { screenshotCount: screenShotCount, checksCount: steps.length };
};

/*
	Check if required
 */
export const groupTestByStatus = (tests: Pick<IBuildReportResponse, "tests">) => {
	const statusTestTestInstanceGroup = {};
	let i = 0;

	for (const { testInstances } of tests) {
		for (const { status, id } of testInstances) {
			if (!statusTestTestInstanceGroup[status]) statusTestTestInstanceGroup[status] = {};
			// change i to testGroupKey
			if (!statusTestTestInstanceGroup[status][i]) statusTestTestInstanceGroup[status][i] = [];
			statusTestTestInstanceGroup[status][i].push(id);
		}

		i++;
	}
	return statusTestTestInstanceGroup;
};

export const getCountByTestStatus = (tests: Pick<IBuildReportResponse, "tests">) => {
	const testsGroupByStatus = groupTestByStatus(tests);

	const statusObj = {};
	for (const status of Object.keys(testsGroupByStatus)) {
		statusObj[status] = flatten(Object.values(testsGroupByStatus[status])).length;
	}

	return statusObj;
};

export const getAllConfiguration = (tests: Pick<IBuildReportResponse, "tests">) => {
	const parsedConfig = tests
		.map((test) => getAllConfigurationForGivenTest(test))
		.reduce((accumulator, item) => {
			for (const key of Object.keys(item)) {
				accumulator[key] = union(accumulator[key], item[key]);
			}
			return accumulator;
		}, {});

	return parsedConfig;
};

export const getAllConfigurationForGivenTest = (test: Test) => {
	const parsedConfig = {};
	const { testInstances } = test;
	for (const { config } of testInstances) {
		for (const [key, value] of Object.entries(config)) {
			const configNotPresent = !parsedConfig[key]?.includes(value);
			if (configNotPresent) {
				const configKeyNotPresent = !parsedConfig[key];
				if (configKeyNotPresent) parsedConfig[key] = [];

				parsedConfig[key].push(value);
			}
		}
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
	for (const key of Object.keys(allConfiguration)) {
		[baseConfigForTest[key]] = allConfiguration[key];
	}

	return baseConfigForTest;
};

const removeAllFailedStep = (testInstanceData: Instance) => {
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
	return removeAllFailedStep(testInstanceData);
};

export const getFailedConfigurationForTest = (test: Test) => {
	const { testInstances } = test;

	return testInstances.filter(({ status }) => status === "MANUAL_REVIEW_REQUIRED" || status === "FAILED").map(({ config }) => config);
};

export const getFailedNotifyFromConfig = (failedTestsConfiguration) => {
	return failedTestsConfiguration
		.map((config) => {
			return Object.entries(config).map((config) => {
				return config.join(" - ");
			});
		})
		.join(", ");
};
