export function getDefaultHostFromCode(code: string) {
	const rgx = new RegExp(/goto\((["'])([^\1]+?)\1\)/m);
	const match = code.match(rgx);
	return match && match.length == 3 ? match[2] : false;
}

export function replaceHostInCode(host: string, code: string) {
	const rgx = new RegExp(/goto\((["'])([^\1]+?)\1\)/m);
	return code.replace(rgx, function (fullPater, quote, value) {
		const url = new URL(value);
		url.hostname = host;
		return `goto(${quote}${url.href}${quote})`;
	});
}

export function extractOwnerAndRepoName(fullRepoName: string) {
	if (!fullRepoName) {
		return false;
	}
	const splitArr = fullRepoName.split('/');
	return { ownerName: splitArr[0], repoName: splitArr[1] };
}
const labelOptions = [
	{ value: 1800, label: '0.5h' },
	{ value: 3600, label: '1h' },
	{ value: 7200, label: '2h' },
	{ value: 14400, label: '4h' },
	{ value: 28800, label: '8h' },
	{ value: 43200, label: '12h' },
	{ value: 86400, label: '1d' },
];

export function convertSecondsToLabel(seconds) {
	return labelOptions.sort(function (a, b) {
		return Math.abs(seconds - a.value) - Math.abs(seconds - b.value);
	})[0].label;
}

export function convertLabelToSeconds(labelToFind) {
	const label = labelOptions.find((l) => {
		return l.label === labelToFind;
	});
	if (!label) {
		throw new Error('Invalid time interval');
	}
	return label.value;
}

export const generateId = (length) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
