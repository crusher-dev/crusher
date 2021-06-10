import { Logger } from "./utils/logger";

require("./utils/logger");
const chalk = require("chalk");
const cookie = require("cookie");
import * as bodyParser from "body-parser";
import { useContainer, useExpressServer, Action } from "routing-controllers";
import * as http from "http";
import { Container } from "typedi";
import "reflect-metadata";
import { CorsMiddleware } from "./server/middleware/CorsMiddleware";
import { ReqLogger } from "./server/middleware/ResponseTime";
import * as express from "express";
import { UserController } from "./server/controllers/UserController";
import { ProjectsController } from "./server/controllers/ProjectsController";
import { clearAuthCookies, decodeToken } from "./core/utils/auth";
import { TestController } from "./server/controllers/TestController";
import { TestInstanceController } from "./server/controllers/TestInstanceController";
import { DraftController } from "./server/controllers/DraftController";
import { JobsController } from "./server/controllers/JobsController";
import { CLIController } from "./server/controllers/CLIController";
import { AlertingController } from "./server/controllers/AlertingController";
import { ProjectHostsController } from "./server/controllers/ProjectHostsController";
import { CommentsController } from "./server/controllers/CommentsController";
import { TestInstanceResultSetsController } from "./server/controllers/TestInstanceResultSetsController";
import { TestInstanceResultsController } from "./server/controllers/TestInstanceResultsController";
import { MonitoringController } from "./server/controllers/MonitoringController";
import { Slack } from "./server/controllers/integrations/Slack";
import { JobsControllerV2 } from "./server/controllers/v2/JobsControllerV2";
import { TestInstanceControllerV2 } from "./server/controllers/v2/TestInstanceControllerV2";
import { PaymentController } from "./server/controllers/PaymentController";
import { JobReportsController } from "./server/controllers/v2/JobReportsController";
import { ProjectsControllerV2 } from "./server/controllers/v2/ProjectsControllerV2";
import { TeamControllerV2 } from "./server/controllers/v2/TeamControllerV2";
import { InviteMembersController } from "./server/controllers/v2/InviteMembersController";
import { UserControllerV2 } from "./server/controllers/v2/UserControllerV2";
import { DraftControllerV2 } from "./server/controllers/v2/DraftControllerV2";
import { LoginConnectionsController } from "./server/controllers/v2/LoginConnectionsController";
import { GitIntegrationsController } from "./server/controllers/integrations/Github";
import MongoManager from "./core/manager/MongoManager";
import { EmailManager } from "@manager/EmailManager";

useContainer(Container);
const expressApp = express();
expressApp.use(ReqLogger);
expressApp.use(bodyParser({ limit: "50mb" }));
expressApp.use(bodyParser.urlencoded({ extended: false }));

const mongoManager = Container.get(MongoManager);

EmailManager.sendVerificationMail("test@gmail.com", "");

useExpressServer(expressApp, {
	controllers: [
		UserController,
		ProjectsController,
		TestController,
		TestInstanceController,
		DraftController,
		JobsController,
		CLIController,
		AlertingController,
		ProjectHostsController,
		CommentsController,
		TestInstanceResultSetsController,
		TestInstanceResultsController,
		MonitoringController,
		JobsControllerV2,
		TestInstanceControllerV2,
		Slack,
		PaymentController,
		JobReportsController,
		ProjectsControllerV2,
		TeamControllerV2,
		InviteMembersController,
		UserControllerV2,
		DraftControllerV2,
		LoginConnectionsController,
		GitIntegrationsController,
	],
	middlewares: [CorsMiddleware],
	authorizationChecker: async (action: Action) => {
		if (action.request.headers.method === "OPTIONS") {
			action.response.status(200);
			action.response.end();
		}
		try {
			const cookies = cookie.parse(action.request.headers.cookie || "");
			const user = decodeToken(cookies.token);
			if (!user) {
				clearAuthCookies(action.response);
				return false;
			}
			return user;
		} catch (error) {
			clearAuthCookies(action.response);
			return false;
		}
	},
	currentUserChecker: async (action: Action) => {
		if (action.request.headers.method === "OPTIONS") {
			action.response.status(200);
			action.response.end();
		}
		try {
			const { token } = cookie.parse(action.request.headers.cookie);
			return decodeToken(token);
		} catch (error) {
			console.error(error);
			return false;
		}
	},
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
