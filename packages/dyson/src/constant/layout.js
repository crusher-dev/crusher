const getSpacingSizes = () => {
	let sizingMap = {};
	const remBaseUnit = 16;
	for (let i = 0; i <= 120; i++) sizingMap[i] = `${i / remBaseUnit}rem`;
	return sizingMap;
};

const spacingSize = getSpacingSizes();

module.exports = {
	spacingSize,
};
