import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import * as debug from "debug";
import { Service } from "typedi";

// Generally later to be shifted to ngnix
@Service()
@Middleware({ type: "before" })
export class CorsMiddleware implements ExpressMiddlewareInterface {
	// interface implementation is optional
	private logger: debug.IDebugger = debug("pick:middleware:CorsMiddleware");

	public use(req: Request, res: Response, next?: NextFunction): any {
		if (req.get("origin")) {
			this.logger(`Setting Access-Control-Allow-Origin headers to ${req.get("origin")}`);
			res.header("Access-Control-Allow-Origin", String(req.get("origin")));
		}
		res.header("Access-Control-Allow-Credentials", `true`);
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
		res.header(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization, Content-Length, X-CSRF-Token, x-client-type,x-client-version,x-containers-id, X-Requested-With, Access-Control-Allow-Credentials, cache-control, Accept",
		);
		if (req.method === "OPTIONS") {
			res.sendStatus(200);
			res.end();
		} else {
			next();
		}
	}
}
