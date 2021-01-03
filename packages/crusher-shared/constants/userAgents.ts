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
		name: 'Mozilla Firefox',
		value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0',
		appVersion: 'Mac OS X 10.14.0',
		platform: 'Mac OS X',
	},
	{
		name: 'Microsoft Edge',
		value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
		appVersion: 'Windows 10 0.0.0',
		platform: 'Windows 10',
	},
	{
		name: 'iPhone',
		value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
		appVersion: 'iOS 10.3.1',
		platform: 'iOS',
	},
	{
		name: 'iPad',
		value: 'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
		appVersion: 'iOS 8.4.1',
		platform: 'iOS',
	},
	{
		name: 'Samsung Phone',
		value:
			'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G570Y Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36',
		appVersion: 'Android 6.0.1',
		platform: 'Android',
	},
	{
		name: 'Google Pixel',
		value: 'Mozilla/5.0 (Linux; Android 7.1.1; Pixel Build/NOF27B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36',
		appVersion: 'Android 8.0.0',
		platform: 'Android',
	},
];

export default userAgents;
