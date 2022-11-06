const token = "xaat-ce17493a-8da5-428b-93be-01b53d13a525";
const ORG_ID = "crusher-1fgb"
process.env.AXIOM_TOKEN = token;
process.env.AXIOM_ORG_ID = ORG_ID;

import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";
const chalk = require('chalk');
const { Readable } = require("stream")
const IS_PRODUCTION = process.env.NODE_ENV === "production";

import Client, { datasets } from '@axiomhq/axiom-node';
const client = new Client();

let isSetupComplete = false;

// Native console.error
const _error = console.error;

export const chalkShared = require('chalk');

export function setupLogger(crusherModuleName: string) {
	// console.debug("Setting up logger now");
	if (!crusherModuleName) throw new Error("Provide a unique component name for you logger");
	if (isSetupComplete) return;

	const logsDir = path.join(process.env.HOME, ".crusher/logs", crusherModuleName);
	if (!fs.existsSync(logsDir)) {
		console.log("Logs dir doesn't exist, creating it");
		fs.mkdirSync(logsDir, { recursive: true });
	}

	let winstonLogger = winston.createLogger({
		level: "info",
		format: winston.format.json(),
		defaultMeta: {},
		transports: [
			new winston.transports.File({ filename: "error.log", dirname: logsDir, level: "error" }),
			new winston.transports.File({ filename: "combined.log", dirname: logsDir }),
			new winston.transports.Console({
				format: winston.format.combine(winston.format.colorize(), winston.format.printf((info) => {
					const values = Object.keys(info).filter((a) => !["level", "message"].includes(a)).map((a) => info[a]);

					return `${info.level}: ${info.message && typeof info.message === "string" ? info.message.replace(/^(\[.+\])/, (x) => {
						return chalk.bold(x);
					}) : info.message} ` + (values && values.length ? values.map((v) => { return JSON.stringify(v, null) }).join(", ") : "");
				})), level: process.env.CRUSHER_DEBUG ? "debug" : "info"
			}),
		],
	});

	const consoleMiddleware = (type, message, ...meta) => {
		logToAxiom(type, message, ...meta)
		winstonLogger.log(type, message, meta);
	};

	// Native console.error
	const _error = console.error;
	const _log = console.log;

	function modifyNativeConsoleFunctions() {
		(console as any).logPlain = console.log;
		console.log = consoleMiddleware.bind(this, "info");
		console.error = consoleMiddleware.bind(this, "error");
		console.warn = consoleMiddleware.bind(this, "warn");
		console.info = consoleMiddleware.bind(this, "info");
		console.trace = consoleMiddleware.bind(this, "debug");
		console.debug = consoleMiddleware.bind(this, "debug");
	}

	modifyNativeConsoleFunctions();

	// Add better logger later on with winston
	function logToAxiom(type, message, ...meta) {
		(async () => {
			if (IS_PRODUCTION) {
				const str = JSON.stringify([
					!!meta ? { from: crusherModuleName, type, message, meta } : { from: crusherModuleName, type, message }
				]);
				const stream = Readable.from(str);
				try {
					await client.datasets.ingest(
						'crusher-prod',
						stream,
						datasets.ContentType.JSON,
						datasets.ContentEncoding.Identity,
					);
				} catch (e) {
					console.log("error", e)
				}
			}
		})()
	}

}

