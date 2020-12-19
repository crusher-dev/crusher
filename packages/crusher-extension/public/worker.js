import "./js/unique-selector.umd.js";
const _uniqueSelector2 = new uniqueSelector({});
function getSelectorsForNode(element) {
	const selectors = _uniqueSelector2.getUniqueSelector(element);
	return selectors;
}

exportFunction("getSelectorsForNode", getSelectorsForNode);
