import parse from "url-parse";

const url = require("url");

const clean = (url: string) => String(url).replace(/^\/|\/$/g, "");

export const isLocal = (url: string) =>
    String(url).startsWith("chrome://") ||
    String(url).startsWith("chrome-extension://");

export const isOfCrusherExtension = (url: string) =>
    Boolean(url) && clean(url).startsWith(clean(chrome.runtime.getURL("/")));

export const origins = (url: string) => {
    const { hostname } = parse(url);
    return [`https://${hostname}`, `http://${hostname}`];
};

export const addHttpToURLIfNotThere = (uri: string) => {
    const httpRgx = new RegExp(/^https?\:\/\/[\w\._-]+?\.[\w_-]+/i);
    if (!uri.match(httpRgx)) {
        return `http://${uri}`;
    }
    return uri;
};

export const getQueryStringParams = function getParameterByName(
    name: string,
    url: string
) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const resolveToBackendPath = (relativePath: string) => {
    return url.resolve("https://backend.crusher-test.com/", relativePath);
}
