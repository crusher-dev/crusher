import winston from "winston";
import LokiTransport from "winston-loki";
import TransportStream from "winston-transport";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const transports: Array<TransportStream> =  [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
	new winston.transports.File({ filename: 'combined.log' }),
	new winston.transports.Console({ format: winston.format.cli() }),
];

if(IS_PRODUCTION) {
	transports.push(new LokiTransport({
		host: 'https://146225:eyJrIjoiY2I4YTU3ODIxMjY4OTIwNzM5YjkzODQzODllNzNjMWQ4Mjk3YmZmZSIsIm4iOiJtYWluLWxvZyIsImlkIjo1ODQ3OTh9@logs-prod-us-central1.grafana.net',
		json: true,
		basicAuth: '146225:eyJrIjoiY2I4YTU3ODIxMjY4OTIwNzM5YjkzODQzODllNzNjMWQ4Mjk3YmZmZSIsIm4iOiJtYWluLWxvZyIsImlkIjo1ODQ3OTh9',
		labels: { component: 'server' },
		onConnectionError: (err) => {
		    _error(err)
		}
	}));
}
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { },
  transports: transports,
});



const chalk = require("chalk");

const _log = console.log;
const _error = console.error;
const _info = console.info;
const _trace = console.trace;
const _warn = console.warn;
const _debug = console.debug;

const logger =  { log: (message, meta) => { winstonLogger.log('info', message, meta); }, info: (message, meta) => { winstonLogger.log('info', message, meta); }, debug: (message, meta) => { winstonLogger.log('debug', message, meta); }, warn: (message, meta) => { winstonLogger.log('warn', message, meta); }, error: (message, meta) => { winstonLogger.log('error', message, meta); }, fatal: (message, meta) => { winstonLogger.log('error', message, meta); } };

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
			logger.info(msgToShow, { meta });
		},
		warn: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			logger.warn(msgToShow, { meta });
		},
		debug: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			logger.debug(msgToShow, { meta });
		},
		error: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			logger.error(msgToShow, { meta });
		},
		fatal: function (tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			logger.fatal(msgToShow, { meta });
		},
		trace: function trace(tag, message, meta = null) {
			const msgToShow = `[${tag}]: ${message}`;
			logger.trace(msgToShow, { meta });
		},
	},
};

const log = function () {
	logger.log([...arguments].join(" "));
};

const info = function () {
	logger.info([...arguments].join(" "));
};

const debug = function () {
	logger.debug([...arguments].join(" "));
};

const trace = function () {
	logger.debug([...arguments].join(" "));
};

const warn = function () {
	logger.warn([...arguments].join(" "));
};

const error = function () {
	logger.error([...arguments].join(" "));
};

console.log = log;
console.error = error;
console.warn = warn;
console.info = info;
console.trace = trace;
console.debug = debug;
