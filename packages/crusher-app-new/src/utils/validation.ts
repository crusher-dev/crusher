export const validateSurveyData = (role: string, objective: string) => {
	if (!role || !objective) {
		return false;
	}
	return true;
};
