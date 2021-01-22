export const getUniqueScore = (querySelector: string, target: Element): Number => {
	const totalNodes = target.querySelectorAll(querySelector).length;
	return Number((1 / totalNodes).toPrecision());
};

export const getQuerySelector = (nodeName: string, attributeName: string, attributeValue: string | undefined): String => {
	return `${nodeName.toLowerCase()}[${attributeName}="${attributeValue}"]`;
};
