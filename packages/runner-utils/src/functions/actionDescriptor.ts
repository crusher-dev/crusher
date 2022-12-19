import { iAction } from "@crusher-shared/types/action";
import * as fs from "fs";
import * as path from "path";
import { isWebpack } from "../utils/helper";
const actionTypes = ["page", "element", "browser", "customCode"];

class ActionDescriptor {
	actionsMap = {};

	initActionHandlers() {
		const actions = {};

		if (!isWebpack()) {

			actionTypes.forEach((type) => {
				if(type === "customCode") return;
				const actionDir = path.join(__dirname, "../actions/", type + "");
				fs.readdirSync(actionDir).forEach((file) => {
					const out = {};
					const action = require(path.join(actionDir, file, "index.ts"));
					const {name : type} = action as any;
					out["core"] = action;
					out["ui"] = { recorder: null };
					const recorderUIPath = path.join(actionDir, file, "ui/recorder.tsx");
					if(fs.existsSync(recorderUIPath)) {
						out["ui"]["recorder"] = require(recorderUIPath);
					}
			
					actions[type] = out;
				});
			});
			
			{
				const out = {};
				const customCodeAction = require(path.join(__dirname, "../actions/customCode/index.ts"));
				out["core"] = customCodeAction;
				out["ui"] = { recorder: null };
			
				const {name: type} = customCodeAction as any;
				const customCodeUiPath = path.join(__dirname, "../actions/customCode/ui/recorder.tsx");
				if(fs.existsSync(customCodeUiPath)) {
					customCodeAction["ui"]["recorder"] = require(customCodeUiPath);
				}
				actions[type] = out;
			}
			
			} else {
				// Use require.context
				// @ts-ignore
				const actionDir = require.context("../actions/", true, /index\.ts$/);
				// @ts-ignore
				const actionsUIDir = require.context("../actions/", true, /ui\/recorder\.tsx$/);
				actionDir.keys().forEach((file) => {
					const out = {};
					const action = actionDir(file);
					const {name : type} = action as any;
					out["core"] = action;
					out["ui"] = { recorder: null };
					// console.log("File is", file);
					const recorderUIPath = file.replace("index.ts", "ui/recorder.tsx");
					if(actionsUIDir.keys().includes(recorderUIPath)) {
						out["ui"]["recorder"] = actionsUIDir(recorderUIPath);
					}
					actions[type] = out;
				});
			
		}

		for (let action in Object.values(actions)) {
			const { core, ui } = action as any;
			const { name, description, handler, actionDescriber } = core;
			this.registerStepHandler(name, description, handler, actionDescriber);
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
