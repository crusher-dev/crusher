"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryStringParams = exports.addHttpToURLIfNotThere = exports.origins = exports.isOfCrusherExtension = exports.isLocal = void 0;
const url_parse_1 = __importDefault(require("url-parse"));
const clean = (url) => String(url).replace(/^\/|\/$/g, "");
exports.isLocal = (url) => String(url).startsWith("chrome://") ||
    String(url).startsWith("chrome-extension://");
exports.isOfCrusherExtension = (url) => Boolean(url) && clean(url).startsWith(clean(chrome.runtime.getURL("/")));
exports.origins = (url) => {
    const { hostname } = url_parse_1.default(url);
    return [`https://${hostname}`, `http://${hostname}`];
};
exports.addHttpToURLIfNotThere = (uri) => {
    const httpRgx = new RegExp(/^https?\:\/\/[\w\._-]+?\.[\w_-]+/i);
    if (!uri.match(httpRgx)) {
        return `http://${uri}`;
    }
    return uri;
};
exports.getQueryStringParams = function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
//# sourceMappingURL=url.js.map