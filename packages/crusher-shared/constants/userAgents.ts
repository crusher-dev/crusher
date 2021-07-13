export interface iUserAgent{
	name: string;
	value: string;
	appVersion: string;
	platform: string;
};

const userAgents: Array<iUserAgent> = [
	{
		name: 'Google Chrome',
		value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
		appVersion: 'Mac OS X 10.14.0',
		platform: 'Mac OS X',
	},
	{
		name: 'Google Pixel',
		value: 'Mozilla/5.0 (Linux; Android 7.1.1; Pixel Build/NOF27B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36',
		appVersion: 'Android 8.0.0',
		platform: 'Android',
	},
];

export default userAgents;
