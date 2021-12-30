export const getUniqueScore = (querySelector: string, target: Element): Number => {
	try {
		const totalNodes = target.querySelectorAll(querySelector).length;
		return Number((1 / totalNodes).toPrecision());
	} catch (err) {
		return 0;
	}
};

export const getQuerySelector = (nodeName: string, attributeName: string, attributeValue: string | undefined): string => {
	return `${nodeName.toLowerCase()}[${attributeName}="${attributeValue}"]`;
};
