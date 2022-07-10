// response-time-logger.js
const chalk = require("chalk");

export const ReqLogger = (req, res, next) => {
	const startHrTime = process.hrtime();
	res.on("finish", () => {
		const elapsedHrTime = process.hrtime(startHrTime);
		const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
		console.info(chalk.cyanBright.bold(req.path), `${chalk.whiteBright.bold(res.statusCode)} (${chalk.whiteBright.bold(elapsedTimeInMs)} ms)`, {
			cookies: req.headers.cokkies,
		});
	});
	next();
};
