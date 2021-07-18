
export const validateEmail = (email) => {
	if (email.length < 3) {
		return false;
	}
	return true;
};

export const validatePassword = (password) => {
	if (password.length < 5) {
		return false;
	}
	return true;
};

export const validateName = (name) => {
	if (name.length < 3) {
		return false;
	}
	return true;
};
