require("dotenv").config();
require("./utils/logger");

import { getEdition } from "@utils/helper";
import { authorization, getCurrentUserChecker } from "./server/middleware/Authorization";
import { Logger } from "./utils/logger";
import * as bodyParser from "body-parser";
import { useContainer, useExpressServer } from "routing-controllers";
import * as http from "http";
import { Container } from "typedi";
import "reflect-metadata";
import { CorsMiddleware } from "./server/middleware/CorsMiddleware";
import { ReqLogger } from "./server/middleware/ResponseTime";
import * as express from "express";
import { UserController } from "@modules/users/controller";
import { EmailManager } from "@manager/EmailManager";
import { EDITION_TYPE } from "@crusher-shared/types/common/general";
import MongoManager from "@manager/MongoManager";
import { RedisManager } from "@manager/redis";
import { TestController } from "@modules/tests/controller";
import { BuildsController } from "@modules/builds/controller";
import { BuildReportController } from "@modules/buildReports/controller";
import { ReleaseController } from '@controllers/ReleaseController';

RedisManager.initialize();

// For bundling one standalone server instead of seperate
// cron, queue and backend servers. (Used in OSS)
if (process.env.RUN_ALL_TOGETHER) {
	require("./cron");
	require("./queue");
}

const chalk = require("chalk");
Container.get(MongoManager);

useContainer(Container);
const expressApp = express();
expressApp.use(ReqLogger);
expressApp.use(bodyParser({ limit: "50mb" }));
expressApp.use(bodyParser.urlencoded({ extended: false }));

EmailManager.sendVerificationMail("test@gmail.com", "");

if (process.env.STORAGE_MODE === "local") {
	const serveStatic = require("serve-static");
	const finalhandler = require("finalhandler");
	const serve = serveStatic(process.env.BASE_STORAGE_FOLDER);

	const storagePort = parseInt(process.env.STORAGE_PORT, 10);
	const server = http.createServer(function (req: any, res: any) {
		const done = finalhandler(req, res);
		serve(req, res, done);
	});

	server.listen(storagePort);
}

const controllersArr: any = [UserController, TestController, BuildsController, BuildReportController, ReleaseController];

// @TODO: Look into this
// if (getEdition() === EDITION_TYPE.EE) {
// 	const eeControllerArr: any = require("./ee/controllers");
// 	controllersArr.push(...Object.values(eeControllerArr));
// }
useExpressServer(expressApp, {
	controllers: controllersArr,
	middlewares: [CorsMiddleware],
	authorizationChecker: authorization(),
	currentUserChecker: getCurrentUserChecker(),
	defaultErrorHandler: true,
});

process.on("unhandledRejection", (reason, p) => {
	p.catch((error) => {
		Logger.fatal("unhandledRejection", `Caught exception: ${reason}\n` + `Exception origin: ${p}`, { error });
	});
});

process.on("uncaughtException", (err: Error) => {
	Logger.fatal("uncaughtException", `Caught exception: ${err.message}\n` + `Exception origin: ${err.stack}`);
	process.exit(1);
});

const httpServer = http.createServer(expressApp);
const port = process.env.PORT || 8000;

httpServer.listen(port);

Logger.info("App", chalk.hex("#ec2e6a").bold(`Starting at ${port}`));
