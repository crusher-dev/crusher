'use strict';
/*
	Not keeping styling strict here, keep it in components if needed
 */
const getSpacingSizes = () => {
	let sizingMap = {};
	for (let i = 0; i <= 120; i++) sizingMap[i] = `${i}rem`;
	return sizingMap;
};

const spacingSize = getSpacingSizes();

module.exports = {
	spacingSize,
};
