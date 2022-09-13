export const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);
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
