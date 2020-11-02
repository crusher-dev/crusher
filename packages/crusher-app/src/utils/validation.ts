export const validateSurveyData = (role, objective, whatToTest) => {
	if (!role || !objective || !whatToTest) {
		return false;
	}
	return true;
};
