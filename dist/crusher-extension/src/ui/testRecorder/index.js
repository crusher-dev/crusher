"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const preact_1 = require("preact");
const app_1 = __importDefault(require("./app"));
const compat_1 = __importDefault(require("preact/compat"));
// Get Active Tab id (i.e, tabId) and check if the recorder is one or not (i.e, isSessionGoingOn).
// Pass both of them to our component App
// @ts-ignore
preact_1.render(compat_1.default.createElement(app_1.default, null), document.querySelector("#root"));
//# sourceMappingURL=index.js.map