import "reflect-metadata";

require("dotenv").config();
require("./utils/logger");

import { authorization, getCurrentUserChecker } from "./server/middleware/Authorization";
import { Logger } from "./utils/logger";
import * as bodyParser from "body-parser";
import { useContainer, useExpressServer } from "routing-controllers";
import * as http from "http";
import { Container } from "typedi";
import { CorsMiddleware } from "./server/middleware/CorsMiddleware";
import { ReqLogger } from "./server/middleware/ResponseTime";
import * as express from "express";
import { RedisManager } from "@modules/redis";
import { UserController } from "@modules/resources/users/controller";
import { TestController } from "@modules/resources/tests/controller";
import { BuildReportController } from "@modules/resources/buildReports/controller";
import { BuildsController } from "@modules/resources/builds/controller";
import { BuildTestInstancesController } from "@modules/resources/builds/instances/controller";
import { ReleaseController } from "./server/controllers/releaseController";
import { ProjectsController } from "@modules/resources/projects/controller";
import { TeamsController } from "@modules/resources/teams/controller";
import { ProjectMonitoringController } from "@modules/resources/projects/monitoring/controller";
import { ProjectEnvironmentController } from "@modules/resources/projects/environments/controller";
import { IntegrationsController } from "@modules/resources/integrations/controller";

Container.set(RedisManager, new RedisManager());

require("./queue");

const chalk = require("chalk");

useContainer(Container);
const expressApp = express();
expressApp.use(ReqLogger);
expressApp.use(bodyParser({ limit: "50mb" }));
expressApp.use(bodyParser.urlencoded({ extended: false }));

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

const controllersArr: any = [
	UserController,
	TestController,
	BuildsController,
	BuildReportController,
	ReleaseController,
	ProjectsController,
	TeamsController,
	BuildTestInstancesController,
	ProjectMonitoringController,
	ProjectEnvironmentController,
	IntegrationsController,
];

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
