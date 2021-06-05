export const validateSurveyData = (role, objective) => {
	if (!role || !objective) {
		return false;
	}
	return true;
};
