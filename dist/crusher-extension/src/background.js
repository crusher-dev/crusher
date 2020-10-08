"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url = __importStar(require("./utils/url"));
const tabStorage_1 = __importDefault(require("./utils/tabStorage"));
const frameStorage_1 = __importDefault(require("./utils/frameStorage"));
const url_1 = require("./utils/url");
const userAgents_1 = __importDefault(require("~/crusher-shared/constants/userAgents"));
class ChromeEventsListener {
    constructor() {
        this.onTabUpdated = this.onTabUpdated.bind(this);
        this.onTabRemoved = this.onTabRemoved.bind(this);
        this.onBeforeRequest = this.onBeforeRequest.bind(this);
        this.onHeadersReceived = this.onHeadersReceived.bind(this);
        this.onBeforeSendHeaders = this.onBeforeSendHeaders.bind(this);
        this.onRuntimeMessage = this.onRuntimeMessage.bind(this);
        this.onBeforeNavigation = this.onBeforeNavigation.bind(this);
    }
    isAllowedToPerformAction(tab) {
        if (!tab || !tab.id) {
            return false;
        }
        return tabStorage_1.default.isExtension(tab.id);
    }
    onTabUpdated(tabId, changeInfo, tab) {
        if (tab.url && url.isOfCrusherExtension(tab.url)) {
            const iframeURL = url_1.getQueryStringParams("url", tab.url);
            const crusherAgent = url_1.getQueryStringParams("__crusherAgent__", iframeURL);
            const userAgent = userAgents_1.default.find((agent) => agent.name === (crusherAgent || userAgents_1.default[6].value));
            tabStorage_1.default.set(tabId, tab, userAgent ? userAgent.value : userAgents_1.default[0].value);
        }
        else {
            tabStorage_1.default.remove(tabId);
        }
    }
    onTabRemoved(tabId) {
        if (!tabStorage_1.default.has(tabId)) {
        }
    }
    onBeforeRequest(details) {
        const areActionsAllowed = this.isAllowedToPerformAction(tabStorage_1.default.get(details.tabId));
        if (!areActionsAllowed || details.parentFrameId !== 0) {
            return { cancel: false };
        }
        chrome.browsingData.remove({}, {
            serviceWorkers: true,
        });
        return { cancel: false };
    }
    onHeadersReceived(details) {
        const areActionsAllowed = this.isAllowedToPerformAction(tabStorage_1.default.get(details.tabId));
        const headers = details.responseHeaders;
        if (!headers || !areActionsAllowed || details.parentFrameId !== 0) {
            return { responseHeaders: headers };
        }
        const responseHeaders = headers.filter((header) => {
            const name = header.name.toLowerCase();
            return (["x-frame-options", "content-security-policy", "frame-options"].indexOf(name) === -1);
        });
        const redirectUrl = headers.find((header) => header.name.toLowerCase() === "location");
        if (redirectUrl) {
            chrome.browsingData.remove({}, {
                serviceWorkers: true,
            });
        }
        return {
            responseHeaders,
        };
    }
    onBeforeSendHeaders(details) {
        var _a;
        const areActionsAllowed = this.isAllowedToPerformAction(tabStorage_1.default.get(details.tabId));
        const headers = details.requestHeaders;
        if (!areActionsAllowed || details.parentFrameId !== 0) {
            return { requestHeaders: headers };
        }
        const frame = frameStorage_1.default.get(details.tabId, details.frameId);
        if (!frame) {
            return {
                requestHeaders: details.requestHeaders,
            };
        }
        const userAgent = tabStorage_1.default.get(details.tabId).crusherAgent;
        (_a = details.requestHeaders) === null || _a === void 0 ? void 0 : _a.push({
            name: "User-Agent",
            value: userAgent,
        });
        return { requestHeaders: details.requestHeaders };
    }
    onRuntimeMessage() { }
    onBeforeNavigation(details) {
        const isAllowed = this.isAllowedToPerformAction(tabStorage_1.default.get(details.tabId));
        if (!isAllowed || details.frameId === 0) {
            return;
        }
        if (details.parentFrameId === 0) {
            const userAgentId = url_1.getQueryStringParams("__crusherAgent__", details.url);
            const userAgentFromUrl = userAgents_1.default.find((agent) => agent.name === userAgentId);
            const userAgent = userAgentFromUrl
                ? userAgentFromUrl.value
                : tabStorage_1.default.get(details.tabId).crusherAgent;
            if (userAgent) {
                frameStorage_1.default.set(Object.assign(Object.assign({}, details), { userAgent }));
            }
        }
    }
    registerEventListeners() {
        chrome.tabs.onUpdated.addListener(this.onTabUpdated);
        chrome.tabs.onRemoved.addListener(this.onTabRemoved);
        chrome.webRequest.onBeforeRequest.addListener(this.onBeforeRequest, { urls: ["<all_urls>"] }, ["blocking"]);
        chrome.webRequest.onHeadersReceived.addListener(this.onHeadersReceived, { urls: ["<all_urls>"], types: ["sub_frame", "main_frame"] }, ["blocking", "responseHeaders"]);
        chrome.webRequest.onBeforeSendHeaders.addListener(this.onBeforeSendHeaders, { urls: ["<all_urls>"], types: ["sub_frame"] }, ["blocking", "requestHeaders"]);
        chrome.runtime.onMessage.addListener(this.onRuntimeMessage);
        chrome.webNavigation.onBeforeNavigate.addListener(this.onBeforeNavigation);
    }
    boot() {
        this.registerEventListeners();
    }
    shutdown() { }
}
const chromeEventsManager = new ChromeEventsListener();
chromeEventsManager.boot();
//# sourceMappingURL=background.js.map