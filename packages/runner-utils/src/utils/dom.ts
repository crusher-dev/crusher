const getElementsByXPath = (
	xpath: string,
	parent: Node | null = null,
): Node[] => {
	const results = [];
	const query = document.evaluate(
		xpath,
		parent || document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null,
	);
	for (let i = 0, length = query.snapshotLength; i < length; ++i) {
		const item = query.snapshotItem(i);
		if (item) results.push(item);
	}
	return results;
};

const generateQuerySelector = (el: HTMLElement): string => {
	if (el.tagName.toLowerCase() == "html") return "HTML";
	let str = el.tagName;
	str += el.id != "" ? "#" + el.id : "";
	if (el.className) {
		const classes = el.className.split(/\s/);
		for (let i = 0; i < classes.length; i++) {
			str += "." + classes[i];
		}
	}
	return generateQuerySelector((el as any).parentNode) + " > " + str;
};

export { getElementsByXPath, generateQuerySelector };
