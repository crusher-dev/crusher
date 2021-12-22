/* eslint-disable @typescript-eslint/no-var-requires */
const { currentEnvironmentName } = require("./env");
const LoggerDNA = require("logdna");
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const chalk = require("chalk");

const _log = console.log;
const _error = console.error;
const _info = console.info;
const _trace = console.trace;
const _warn = console.warn;
const _debug = console.debug;

const logger = process.env.LOGDNA_API_KEY
	? LoggerDNA.setupDefaultLogger(process.env.LOGDNA_API_KEY, {
			env: currentEnvironmentName,
			app: "crusher-server",
			hostname: "crusher-server",
			index_meta: true,
	  })
	: { log: () => null, info: () => null, debug: () => null, warn: () => null, error: () => null, fatal: () => null };

const showMeta = (meta) => {
	if (!meta) {
		return;
	}
	const keys = Object.keys(meta);
	for (const key of keys) {
		if (meta[key]) {
			_info(`> [${key}]: `, meta[key]);
		}
	}
};

module.exports = {
	Logger: {
		info: function (tag, message, meta = null) {
			const msgToShow = chalk.cyanBright.bold(`[${tag}]`) + `: ${message}`;
			_info(msgToShow);
			showMeta(meta);

			if (IS_PRODUCTION) {
				// Enable to get more logs in production
				logger.info(msgToShow, { meta });
			}
		},
		warn: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			_warn(msgToShow);
			showMeta(meta);
			if (IS_PRODUCTION) {
				logger.warn(msgToShow, { meta });
			}
		},
		debug: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			_debug(msgToShow);
			showMeta(meta);
			if (IS_PRODUCTION) {
				logger.debug(msgToShow, { meta });
			}
		},
		error: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			_error(msgToShow);
			showMeta(meta);
			if (IS_PRODUCTION) {
				logger.error(msgToShow, { meta });
			}
		},
		fatal: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			_error(msgToShow);
			showMeta(meta);
			if (IS_PRODUCTION) {
				logger.fatal(msgToShow, { meta });
			}
		},
		trace: function trace(tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			_trace(msgToShow);
			showMeta(meta);
			if (IS_PRODUCTION) {
				logger.trace(msgToShow, { meta });
			}
		},
	},
};

const log = function () {
	logger.log([...arguments].join(" "));
	_log.apply(console, arguments);
};

const info = function () {
	logger.info([...arguments].join(" "));
	_info.apply(console, arguments);
};

const debug = function () {
	logger.debug([...arguments].join(" "));
	_debug.apply(console, arguments);
};

const trace = function () {
	logger.debug([...arguments].join(" "));
	_trace.apply(console, arguments);
};

const warn = function () {
	logger.warn([...arguments].join(" "));
	_warn.apply(console, arguments);
};

const error = function () {
	logger.error([...arguments].join(" "));
	_error.apply(console, arguments);
};

console.log = log;
console.error = error;
console.warn = warn;
console.info = info;
console.trace = trace;
console.debug = debug;
