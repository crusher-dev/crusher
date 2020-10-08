"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("preact");
const app_1 = __importDefault(require("./app"));
const compat_1 = __importDefault(require("preact/compat"));
const helpers_1 = require("../../utils/helpers");
// Get Active Tab id (i.e, tabId) and check if the recorder is one or not (i.e, isSessionGoingOn).
// Pass both of them to our component App
helpers_1.getActiveTabId().then((tabId) => preact_1.render(compat_1.default.createElement(app_1.default, { tabId: tabId }), document.body));
//# sourceMappingURL=index.js.map