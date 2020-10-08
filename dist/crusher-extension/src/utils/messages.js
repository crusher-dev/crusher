"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToPage = exports.sendMessageToBackground = void 0;
function sendMessageToBackground(payload, callback = null) {
    chrome.runtime.sendMessage(payload, (response) => {
        if (callback) {
            callback(response);
        }
    });
}
exports.sendMessageToBackground = sendMessageToBackground;
function sendMessageToPage(payload, callback = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, payload, (response) => {
            if (callback) {
                callback(response);
            }
        });
    });
}
exports.sendMessageToPage = sendMessageToPage;
//# sourceMappingURL=messages.js.map