module.exports = {
	removeNullValuesFromObject: function (obj) {
		return Object.keys(obj).reduce(function (prev, currentKey) {
			if (!obj[currentKey]) return prev;

			const currentObject = {};
			currentObject[currentKey] = obj[currentKey];

			return Object.assign(prev, currentObject);
		}, {});
	},
};
