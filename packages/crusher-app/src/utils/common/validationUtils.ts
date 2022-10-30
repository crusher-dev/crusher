export const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(/^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}\])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/);
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
	return inviteCode?.startsWith("CRU-");
};
