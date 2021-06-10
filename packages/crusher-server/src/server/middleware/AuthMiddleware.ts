import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import * as debug from "debug";
import { Service } from "typedi";

// Generally later to be shifted to ngnix
@Service()
@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
	// interface implementation is optional
	private logger: debug.IDebugger = debug("pick:middleware:CorsMiddleware");

	public use(req: Request, res: Response, next?: NextFunction): any {
		next();
	}
}
