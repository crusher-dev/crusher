export const validateEmail = (email: string) => {
	if (email.length < 3) {
		return false;
	}
	return true;
};

export const validatePassword = (password: string) => {
	if (password.length < 5) {
		return false;
	}
	return true;
};

export const validateName = (name: string) => {
	if (name.length < 3) {
		return false;
	}
	return true;
};

export const validateSessionInviteCode = (inviteCode: string) => {
	return inviteCode && inviteCode.startsWith("CRU-");
};
