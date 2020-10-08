"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPostDataWithForm = exports.hideAllChildNodes = exports.setAttributeForAllChildNodes = exports.loadCSSIfNotAlreadyLoadedForSomeReason = exports.isSessionGoingOn = exports.stopSession = exports.startSession = exports.removeAllTargetBlankFromLinks = exports.loadContentInBody = void 0;
function loadContentInBody(content) {
    // @ts-ignore
    document.body.insertAdjacentHTML("beforeend", content);
}
exports.loadContentInBody = loadContentInBody;
function removeAllTargetBlankFromLinks() {
    const { links } = document;
    let i;
    let length;
    for (i = 0, length = links.length; i < length; i++) {
        links[i].target == "_blank" && links[i].removeAttribute("target");
    }
}
exports.removeAllTargetBlankFromLinks = removeAllTargetBlankFromLinks;
function startSession() {
    // @ts-ignore
    window.sessionStarted = true;
}
exports.startSession = startSession;
function stopSession() {
    // @ts-ignore
    window.sessionStarted = false;
}
exports.stopSession = stopSession;
function isSessionGoingOn() {
    // @ts-ignore
    return !!window.sessionStarted;
}
exports.isSessionGoingOn = isSessionGoingOn;
function loadCSSIfNotAlreadyLoadedForSomeReason(href) {
    const ss = document.styleSheets;
    for (let i = 0, max = ss.length; i < max; i++) {
        if (ss[i].href == "/path/to.css")
            return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.id = "overlay_css";
    document.getElementsByTagName("head")[0].appendChild(link);
}
exports.loadCSSIfNotAlreadyLoadedForSomeReason = loadCSSIfNotAlreadyLoadedForSomeReason;
function setAttributeForAllChildNodes(parent, attributeKey, attributeValue) {
    return [...parent.children].map((children) => {
        children.setAttribute(attributeKey, attributeValue);
    });
}
exports.setAttributeForAllChildNodes = setAttributeForAllChildNodes;
function hideAllChildNodes(parent) {
    return setAttributeForAllChildNodes(parent, "data-gone", "true");
}
exports.hideAllChildNodes = hideAllChildNodes;
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
//# sourceMappingURL=dom.js.map