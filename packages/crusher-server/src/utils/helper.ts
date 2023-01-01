import { EditionTypeEnum, IActionResultItemWithIndex } from "@crusher-shared/types/common/general";
import { iAction } from "@crusher-shared/types/action";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { camelCase, forEach, isArray, isPlainObject, snakeCase } from "lodash";
import { KeysToCamelCase, KeysToSnakeCase } from "@modules/common/typescript/interface";
import * as ejs from "ejs";

export function getTestHostFromActions(actions: Array<iAction>): string {
	const navigateAction = actions.find((action) => action.type === ActionsInTestEnum.NAVIGATE_URL);
	if (!navigateAction) throw new Error("Test created without no navigation action");

	return navigateAction.payload.meta.value;
}

export function getDefaultHostFromCode(code: string) {
	const rgx = new RegExp(/goto\((["'])([^\1]+?)\1\)/m);
	const match = code.match(rgx);
	return match && match.length == 3 ? match[2] : false;
}

export function replaceHostInCode(host: string, code: string) {
	const rgx = new RegExp(/goto\((["'])([^\1]+?)\1\)/m);
	return code.replace(rgx, function (fullPater, quote, value) {
		const url = new URL(value);
		url.hostname = host;
		return `goto(${quote}${url.href}${quote})`;
	});
}

export function extractOwnerAndRepoName(fullRepoName: string) {
	if (!fullRepoName) {
		return false;
	}
	const splitArr = fullRepoName.split("/");
	return { ownerName: splitArr[0], repoName: splitArr[1] };
}
const labelOptions = [
	{ value: 1800, label: "0.5h" },
	{ value: 3600, label: "1h" },
	{ value: 7200, label: "2h" },
	{ value: 14400, label: "4h" },
	{ value: 28800, label: "8h" },
	{ value: 43200, label: "12h" },
	{ value: 86400, label: "1d" },
];

export function convertSecondsToLabel(seconds) {
	return labelOptions.sort(function (a, b) {
		return Math.abs(seconds - a.value) - Math.abs(seconds - b.value);
	})[0].label;
}

export function convertLabelToSeconds(labelToFind) {
	const label = labelOptions.find((l) => {
		return l.label === labelToFind;
	});
	if (!label) {
		throw new Error("Invalid time interval");
	}
	return label.value;
}

export const generateId = (length) => {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

function getEdition(): EditionTypeEnum {
	return process.env.CRUSHER_MODE as EditionTypeEnum;
}

function isOpenSourceEdition(): boolean {
	return getEdition() === EditionTypeEnum.OPEN_SOURCE;
}

function isUsingLocalStorage(): boolean {
	return process.env.STORAGE_MODE === "local";
}

function getFullName(firstName: string | null, lastName: string | null) {
	return [firstName, lastName].filter((name) => !!name).join(" ");
}

// @TODO: Make this compatible with typescript array and objects
function getCamelizeObject<Type>(object: Type): KeysToCamelCase<Type> {
	const camelCaseObject = {};
	if (object instanceof Array) {
		return object.map((obj) => {
			return getCamelizeObject(obj);
		}) as any;
	}
	if (typeof object !== "object") return object as any;

	forEach(object as any, function (value, key) {
		if (isPlainObject(value) || isArray(value)) {
			value = getCamelizeObject(value);
		}
		camelCaseObject[camelCase(key)] = value;
	});

	return camelCaseObject as any;
}

// @TODO: Make this compatible with typescript array and objects
function getSnakedObject<Type>(object: Type): KeysToSnakeCase<Type> {
	if (object instanceof Array) {
		return object.map((obj) => {
			return getSnakedObject(obj);
		}) as any;
	}
	if (typeof object !== "object") return object as any;
	const snakeCaseObject = {};

	forEach(object as any, function (value, key) {
		if (isPlainObject(value) || isArray(value)) {
			value = getSnakedObject(value);
		}
		snakeCaseObject[snakeCase(key)] = value;
	});

	return snakeCaseObject as any;
}

function getInsertOrUpdateQuerySetFromObject(payload): [string, Array<any>] {
	const updateQueryArr = [];
	const updateQueryArrValues = [];

	for (const key of Object.keys(payload)) {
		if (Object.prototype.hasOwnProperty.call(payload, key)) {
			updateQueryArr.push(`${key} = ?`);
			updateQueryArrValues.push(payload[key]);
		}
	}

	return [updateQueryArr.join(", "), updateQueryArrValues];
}

function getScreenshotActionsResult(actionsResult: Array<IActionResultItemWithIndex>) {
	return actionsResult
		.filter((actionResult) =>
			[ActionsInTestEnum.PAGE_SCREENSHOT, ActionsInTestEnum.ELEMENT_SCREENSHOT, ActionsInTestEnum.CUSTOM_CODE].includes(actionResult.actionType),
		)
		.filter((actionResult) => {
			if (actionResult.actionType !== ActionsInTestEnum.CUSTOM_CODE) {
				return true;
			}

			if (actionResult.meta && actionResult.meta.outputs && actionResult.meta.outputs.length) {
				return true;
			}

			return false;
		});
}

function getTemplateFileContent(templatePath: string, valuesToInject: any): Promise<string> {
	return new Promise((resolve, reject) => {
		ejs.renderFile(templatePath, valuesToInject, function (err, str) {
			if (err) return reject("Can't load the template at " + templatePath);
			resolve(str);
		});
	});
}

export {
	getEdition,
	isOpenSourceEdition,
	getInsertOrUpdateQuerySetFromObject,
	isUsingLocalStorage,
	getFullName,
	getCamelizeObject,
	getSnakedObject,
	getScreenshotActionsResult,
	getTemplateFileContent,
};
