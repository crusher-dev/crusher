"use strict";
/*
	Not keeping styling strict here, keep it in components if needed
 */
const getSpacingSizes = () => {
	const sizingMap = {};
	for (let i = 0; i <= 120; i++) sizingMap[i] = `${i}rem`;

	sizingMap["12.8"] = "12.8rem";
	sizingMap["12.5"] = "12.5rem";
	return sizingMap;
};

const spacingSize = getSpacingSizes();

module.exports = {
	spacingSize,
};
