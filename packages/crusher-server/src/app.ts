import "reflect-metadata";
import { setupLogger } from "@crusher-shared/modules/logger";

setupLogger("crusher-server");

require("dotenv").config();

import { authorization, getCurrentUserChecker } from "./server/middleware/Authorization";
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
import { CLIController } from "@modules/resources/cli/controller";
import { ProxyController } from "@modules/resources/proxy/controller";
import { VercelIntegrationsController } from "@modules/resources/integrations/vercel/controller";

import { routingControllersToSpec } from "routing-controllers-openapi";
import { getMetadataArgsStorage } from "routing-controllers";
import * as swaggerUi from "swagger-ui-express";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { DiscordWebhookManager } from "@modules/webhook/sources/discord";
import { TWebHookMessage, WebhookManager } from "@modules/webhook";

const chalk = require("chalk");

Container.set(RedisManager, new RedisManager());
useContainer(Container);
const expressApp = express();
expressApp.use(ReqLogger);
expressApp.use(bodyParser({ limit: "50mb" }));
expressApp.use(bodyParser.urlencoded({ extended: false }));

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
	VercelIntegrationsController,
	CLIController,
	ProxyController,
];
// @TODO: Look into this
// if (getEdition() === EDITION_TYPE.EE) {
// 	const eeControllerArr: any = require("./ee/controllers");
// 	controllersArr.push(...Object.values(eeControllerArr));
// }
useExpressServer(expressApp, {
	controllers: controllersArr,
	middlewares: [CorsMiddleware],
	authorizationChecker: authorization(expressApp),
	currentUserChecker: getCurrentUserChecker(expressApp),
	defaultErrorHandler: true,
});

const storage = getMetadataArgsStorage();
const schemas = validationMetadatasToSchemas({
	refPointerPrefix: "#/components/schemas/",
});

const spec = routingControllersToSpec(
	storage,
	{},
	{
		servers: [
			{
				description: "Dev",
				url: "http://localhost:8000",
			},
			{
				description: "Prod",
				url: "http://server.crusher.dev/",
			},
		],
		info: {
			title: "Crusher API",
			version: "1.0.0",
		},
		components: {
			schemas,
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "jwt",
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
);

expressApp.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

process.on("unhandledRejection", (reason, p) => {
	p.catch((error) => {
		console.error("unhandledRejection", `Caught exception: ${reason}\n` + `Exception origin: ${p}`, { error });
	});
});

process.on("uncaughtException", (err: Error) => {
	console.error("uncaughtException", `Caught exception: ${err.message}\n` + `Exception origin: ${err.stack}`);
	process.exit(1);
});

const httpServer = http.createServer(expressApp);
const port = process.env.PORT || 8000;

httpServer.listen(port);

console.info("App", chalk.hex("#ec2e6a").bold(`Starting at ${port}`));

// setInterval(() => {

// 	const message: TWebHookMessage = {
// 		eventType: "buildTrigger",
// 		payload: {
// 			reportStatus: "Passed",
// 			buildId: 3232,
// 			host: "https://google.com	",
// 			triggeredBy: "utkarsh",
// 			totalTests: 20,
// 			buildReportUrl: "https://crusher.dev",
// 			projectName: "Crusher"
// 		}
// 	}
// 	WebhookManager.send(
// 		"https://discord.com/api/webhooks/1027065849003122688/nFGkqj8oatEM0R700Zp8ISmTvlYWL0mwdy5AFVpbP0_ve1ZP2Ts4FfvpprpSelEA8MNT",
// 		message
// 	)
// }, 5000)
