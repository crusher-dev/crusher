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
	for (let key of keys) {
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

const log = function (...args) {
	logger.log(args.slice().join(" "));
	_log.apply(console, args);
};

const info = function (...args) {
	logger.info(args.slice().join(" "));
	_info.apply(console, args);
};

const debug = function (...args) {
	logger.debug(args.slice().join(" "));
	_debug.apply(console, args);
};

const trace = function (...args) {
	logger.debug(args.slice().join(" "));
	_trace.apply(console, args);
};

const warn = function (...args) {
	logger.warn(args.slice().join(" "));
	_warn.apply(console, args);
};

const error = function (...args) {
	logger.error(args.slice().join(" "));
	_error.apply(console, args);
};

console.log = log;
console.error = error;
console.warn = warn;
console.info = info;
console.trace = trace;
console.debug = debug;
