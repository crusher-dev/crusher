"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPostDataWithForm = exports.getActiveTabId = exports.loadScript = void 0;
function loadScript(name, tabId, cb) {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === "production") {
            chrome.tabs.executeScript(tabId, { file: `/js/${name}.js`, runAt: "document_end" }, () => {
                resolve(true);
                if (cb) {
                    cb();
                }
            });
        }
        else {
            // dev: async fetch bundle
            fetch(`http://localhost:2400/${name}.js`)
                .then((res) => res.text())
                .then((fetchRes) => {
                chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: "document_end" }, () => {
                    resolve(true);
                    if (cb) {
                        cb();
                    }
                });
            });
        }
    });
}
exports.loadScript = loadScript;
function getActiveTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    });
}
exports.getActiveTabId = getActiveTabId;
function sendPostDataWithForm(url, options = {}) {
    const form = document.createElement("form");
    form.method = "post";
    form.action = url;
    form.target = "_blank";
    const optionKeys = Object.keys(options);
    for (const optionKey of optionKeys) {
        const hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.name = optionKey;
        hiddenField.value = options[optionKey];
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
    form.remove();
}
exports.sendPostDataWithForm = sendPostDataWithForm;
//# sourceMappingURL=helpers.js.map