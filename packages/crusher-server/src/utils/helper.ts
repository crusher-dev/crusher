function isEnterpriseEdition() {
	return process.env.CRUSHER_MODE === "ee";
}

export { isEnterpriseEdition };
