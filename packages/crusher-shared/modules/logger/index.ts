import * as winston from "winston";
const LokiTransport = require("winston-loki");
import * as chalk from "chalk";

const IS_PRODUCTION = true;

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { },
  transports:  [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' }),
		new winston.transports.Console({ format: winston.format.cli() }),
	],
});

// Native console.error
const _error = console.error;
const _log = console.log;

const logger =  { log: (message, meta) => { winstonLogger.log('info', message, meta); }, info: (message, meta) => { winstonLogger.log('info', message, meta); }, debug: (message, meta) => { winstonLogger.log('debug', message, meta); }, warn: (message, meta) => { winstonLogger.log('warn', message, meta); }, error: (message, meta) => { winstonLogger.log('error', message, meta); }, fatal: (message, meta) => { winstonLogger.log('error', message, meta); } };

function modifyNativeConsoleFunctions() {
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
}

modifyNativeConsoleFunctions();

export function setupLogger(componentName: string) {
	if (!componentName) throw new Error("Provide a unique component name for you logger");
	if (IS_PRODUCTION) {
		console.log("Setting up loki transport");
		winstonLogger.transports.push(new LokiTransport({
			host: 'https://146225:eyJrIjoiY2I4YTU3ODIxMjY4OTIwNzM5YjkzODQzODllNzNjMWQ4Mjk3YmZmZSIsIm4iOiJtYWluLWxvZyIsImlkIjo1ODQ3OTh9@logs-prod-us-central1.grafana.net',
			json: true,
			basicAuth: '146225:eyJrIjoiY2I4YTU3ODIxMjY4OTIwNzM5YjkzODQzODllNzNjMWQ4Mjk3YmZmZSIsIm4iOiJtYWluLWxvZyIsImlkIjo1ODQ3OTh9',
			labels: { component: componentName },
			onConnectionError: (err) => {
					_error(err)
			}
		}));
	}
}