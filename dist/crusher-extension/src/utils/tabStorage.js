"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("~/crusher-shared/utils/url");
exports.default = {
    tabs: {},
    set(tabId, details, crusherAgent) {
        this.tabs[tabId] = Object.assign(Object.assign({}, details), { crusherAgent });
    },
    all() {
        return this.tabs;
    },
    get(tabId) {
        return this.tabs[tabId];
    },
    has(tabId) {
        return this.tabs.hasOwnProperty(tabId) && this.tabs[tabId] !== null;
    },
    isExtension(tabId) {
        const tab = this.get(tabId);
        if (!tab) {
            return false;
        }
        return url_1.isOfCrusherExtension(this.get(tabId).url);
    },
    remove(tabId) {
        this.tabs[tabId] = null;
    },
};
//# sourceMappingURL=tabStorage.js.map