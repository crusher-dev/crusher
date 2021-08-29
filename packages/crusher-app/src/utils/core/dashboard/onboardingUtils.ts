import { PROJECT_META_KEYS, USER_META_KEYS } from "@constants/USER";

export const getOnboardingStepIndex = (project, user) => {
	const testCreatedForProject = !!project?.meta[PROJECT_META_KEYS.TEST_CREATED];
	const testCreatedByUser = !!user?.meta[USER_META_KEYS.TEST_CREATED];
	const showTestCreationStep = testCreatedForProject && testCreatedByUser;

	if (!showTestCreationStep) {
		return 0;
	}

	const ranProjectTest = !!project?.meta[PROJECT_META_KEYS.RAN_TEST];
	const ranTestByUser = !!user?.meta[USER_META_KEYS.RAN_TEST];

	const showRanTestStep = ranProjectTest && ranTestByUser;

	if (!showRanTestStep) {
		return 1;
	}

	const viewProjectReport = !!project?.meta[PROJECT_META_KEYS.VIEW_REPORT];
	const viewReportByUser = !!user?.meta[USER_META_KEYS.VIEW_REPORT];

	const showViewReport = viewProjectReport && viewReportByUser;

	if (!showViewReport) {
		return 2;
	}

	const integrateProjectInWorlfow = !!project?.meta[PROJECT_META_KEYS.INTEGRATE_WITH_CI];

	if (!integrateProjectInWorlfow) {
		return 3;
	}

	return -1;
};
