import { iAction } from "@crusher-shared/types/action";
import * as fs from "fs";
import * as path from "path";
import { isWebpack } from "../utils/helper";

class ActionDescriptor {
	actionsMap = {};

	initActionHandlers() {
		if (isWebpack()) {
			//@ts-ignore
			const actionsRequireContext = require.context("../actions/", true, /\.ts$/);

			actionsRequireContext.keys().forEach((fileName) => {
				const { name, description, handler, actionDescriber } = actionsRequireContext(fileName);
				this.registerStepHandler(name, description, handler, actionDescriber);
			});
		} else {
			const actionsDir = fs.readdirSync(path.join(__dirname, "../actions"));
			for (let actionFilePath of actionsDir) {
				const { name, description, handler, actionDescriber } = require(path.join(__dirname, "../actions", actionFilePath));
				this.registerStepHandler(name, description, handler, actionDescriber);
			}
		}
	}

	constructor() {
		// this.initActionHandlers();
	}

	registerStepHandler(name, description, handler, actionDescriber) {
		this.actionsMap[name] = {
			name,

			description,
			actionDescriber,
			handler,
		};
	}

	describeAction(action: iAction) {
		return this.actionsMap[action.type].actionDescriber(action);
	}
}

export { ActionDescriptor };
