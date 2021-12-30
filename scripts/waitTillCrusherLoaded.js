const fetch = require('node-fetch');
const yargs = require('yargs');
const installOptions = {};

function preParseArgv() {
	const argv = yargs
		.options({
			url: {
				describe: 'Server Url of crusher deployment',
				string: true,
			},
		})
		.help()
		.alias('help', 'h').argv;

	if (argv.url) {
		installOptions['url'] = argv.url;
	}
}

async function waitForWebsite(url) {
	return new Promise(async (resolve, reject) => {
		let startingOffsetCount = 0;

		let interval = null;

		const waitFunc = async () => {
			if (startingOffsetCount > 60) {
				if (interval) clearInterval(interval);
				resolve(false);
				return false;
			}
			console.log(`Pinging ${url} now...`);
			const res = await fetch(url, { method: 'GET' });
			const responseText = await res.text();
			if (responseText.includes('Cannot GET /')) {
				if (interval) clearInterval(interval);
				resolve(true);
				return true;
			}
			startingOffsetCount++;
		};

		if (await waitFunc()) return resolve(true);

		interval = setInterval(waitFunc, 5000);
	});
}

async function boot() {
	preParseArgv();
	if (!installOptions.url) {
		console.error('No crusher server deployment url provided');
		process.exit(1);
	}

	await waitForWebsite(installOptions.url);
}

boot();
