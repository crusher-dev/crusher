export const sentenceCase = (string: string): string => {
	return string.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
		return c.toUpperCase();
	});
};
