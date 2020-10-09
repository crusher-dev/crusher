"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_FORM_TYPE = void 0;
const compat_1 = __importDefault(require("preact/compat"));
const hooks_1 = require("preact/hooks");
const actionTypes_1 = require("~/crusher-extension/src/constants/actionTypes");
const domEventsToRecord_1 = require("~/crusher-extension/src/constants/domEventsToRecord");
const devices_1 = __importDefault(require("~/crusher-shared/constants/devices"));
const userAgents_1 = __importDefault(require("~/crusher-shared/constants/userAgents"));
const url_1 = require("~/crusher-shared/utils/url");
const constants_1 = require("../../constants");
const helpers_1 = require("../../utils/helpers");
const modal_1 = require("./components/modal");
exports.ACTION_FORM_TYPE = {
    PAGE_ACTIONS: "PAGE_ACTIONS",
    ELEMENT_ACTIONS: "ELEMENT_ACTIONS",
};
function RecordingIcon(props) {
    return (compat_1.default.createElement("svg", Object.assign({ height: "512pt", viewBox: "0 0 512 512", width: "512pt" }, props),
        compat_1.default.createElement("path", { d: "M512 256c0 141.387-114.613 256-256 256S0 397.387 0 256 114.613 0 256 0s256 114.613 256 256zm0 0", fill: "#e76e54" }),
        compat_1.default.createElement("path", { d: "M384 256c0 70.691-57.309 128-128 128s-128-57.309-128-128 57.309-128 128-128 128 57.309 128 128zm0 0", fill: "#dd523c" })));
}
function Step(props) {
    const { type, path, value } = props;
    return (compat_1.default.createElement("li", { style: styles.step },
        compat_1.default.createElement("div", { style: styles.stepImage },
            compat_1.default.createElement("img", { src: chrome.runtime.getURL("icons/mouse.svg") })),
        compat_1.default.createElement("div", { style: Object.assign({}, styles.stepTextContainer) },
            compat_1.default.createElement("div", { style: styles.stepAction }, type),
            compat_1.default.createElement("div", { style: { width: "70%", overflow: "hidden" } },
                compat_1.default.createElement("div", { style: styles.stepSelector }, value || path))),
        compat_1.default.createElement("div", { style: styles.centerItemsVerticalFlex },
            compat_1.default.createElement("img", { style: styles.stepGoImage, src: chrome.runtime.getURL("icons/arrow.svg") }))));
}
function Steps(props) {
    const { steps } = props;
    const stepList = steps.map((step) => {
        console.log(step);
        const { event_type, selectors, value } = step;
        return (compat_1.default.createElement(Step, { type: event_type, path: selectors && selectors[0].value, value: value }));
    });
    return (compat_1.default.createElement("div", { style: {
            height: 300,
            minHeight: "50%",
            overflowY: "auto",
            marginBottom: "2rem",
        } },
        compat_1.default.createElement("ul", { style: styles.stepsContainer, className: "margin-list-item" }, stepList)));
}
function Actions(props) {
    const { iframeRef, type, isShowingElementFormCallback, updateState } = props;
    const pageActions = [
        {
            id: actionTypes_1.SETTINGS_ACTIONS.INSPECT_MODE_ON,
            value: "Inspect",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: actionTypes_1.SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT,
            value: "Screenshot",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: actionTypes_1.SETTINGS_ACTIONS.SHOW_SEO_MODAL,
            value: "SEO",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
    ];
    const elementActions = [
        {
            id: domEventsToRecord_1.ACTIONS_IN_TEST.CLICK,
            value: "Click",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: domEventsToRecord_1.ACTIONS_IN_TEST.HOVER,
            value: "Hover",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: domEventsToRecord_1.ACTIONS_IN_TEST.ELEMENT_SCREENSHOT,
            value: "Screenshot",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
        {
            id: domEventsToRecord_1.ACTIONS_IN_TEST.BLACKOUT,
            value: "Blackout",
            icon: chrome.runtime.getURL("icons/action.svg"),
        },
    ];
    function handleElementActionClick(actionType, updateState) {
        const cn = iframeRef.current.contentWindow;
        switch (actionType) {
            case actionTypes_1.SETTINGS_ACTIONS.INSPECT_MODE_ON:
                cn.postMessage({
                    type: actionTypes_1.SETTINGS_ACTIONS.INSPECT_MODE_ON,
                    formType: exports.ACTION_FORM_TYPE.PAGE_ACTIONS,
                    value: true,
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT:
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.PAGE_SCREENSHOT,
                    formType: exports.ACTION_FORM_TYPE.PAGE_ACTIONS,
                    value: true,
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.SHOW_SEO_MODAL:
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.VALIDATE_SEO,
                    formType: exports.ACTION_FORM_TYPE.PAGE_ACTIONS,
                    value: true
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.START_CAPTURING_CONSOLE:
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.CAPTURE_CONSOLE,
                    formType: exports.ACTION_FORM_TYPE.PAGE_ACTIONS,
                    value: true,
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.CLICK_ON_ELEMENT:
                isShowingElementFormCallback(false);
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.CLICK,
                    formType: exports.ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                    value: true,
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.HOVER_ON_ELEMENT:
                isShowingElementFormCallback(false);
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.HOVER,
                    formType: exports.ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                    value: true,
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT:
                isShowingElementFormCallback(false);
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.ELEMENT_SCREENSHOT,
                    formType: exports.ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                    value: true,
                }, "*");
                break;
            case actionTypes_1.SETTINGS_ACTIONS.BLACKOUT_ON_ELEMENT:
                isShowingElementFormCallback(false);
                cn.postMessage({
                    type: domEventsToRecord_1.ACTIONS_IN_TEST.BLACKOUT,
                    formType: exports.ACTION_FORM_TYPE.ELEMENT_ACTIONS,
                    value: true,
                }, "*");
                break;
        }
    }
    const out = [];
    const actions = type === exports.ACTION_FORM_TYPE.ELEMENT_ACTIONS ? elementActions : pageActions;
    for (let i = 0; i < actions.length; i += 2) {
        const shouldAddMarginRight = i % 2 && i !== actions.length - 1;
        out.push(compat_1.default.createElement("div", { style: styles.actionRow },
            compat_1.default.createElement("div", { style: shouldAddMarginRight
                    ? Object.assign(Object.assign({}, styles.actionItem), styles.oddItem) : Object.assign(Object.assign({}, styles.actionItem), styles.oddItem), id: actions[i].id, onClick: () => {
                    handleElementActionClick(actions[i].id, updateState);
                } },
                compat_1.default.createElement("img", { style: styles.actionImage, src: actions[i].icon }),
                compat_1.default.createElement("span", { style: styles.actionText }, actions[i].value)),
            i + 1 < actions.length && (compat_1.default.createElement("div", { style: shouldAddMarginRight
                    ? Object.assign(Object.assign({}, styles.actionItem), styles.oddItem) : Object.assign(Object.assign({}, styles.actionItem), styles.oddItem), id: actions[i + 1].id, onClick: () => {
                    handleElementActionClick(actions[i].id, updateState);
                } },
                compat_1.default.createElement("img", { style: styles.actionImage, src: actions[i + 1].icon }),
                compat_1.default.createElement("span", { style: styles.actionText }, actions[i + 1].value)))));
    }
    return (compat_1.default.createElement("div", { style: Object.assign(Object.assign({}, styles.actionListContainer), { marginTop: "2rem" }) }, out));
}
function DesktopBrowser(props) {
    const selectedDeviceId = url_1.getQueryStringParams("device", window.location.href);
    const urlParams = url_1.getQueryStringParams("url", window.location.href);
    const urlEncoded = urlParams ? new URL(urlParams) : null;
    const url = urlEncoded
        ? decodeURI(urlEncoded.toString().replace(/^["']/, "").replace(/["']$/, ""))
        : "https://google.com";
    const { forwardRef } = props;
    const addressInput = hooks_1.useRef(null);
    const [addressValue, setAddressValue] = hooks_1.useState(url);
    const deviceInfoIndex = devices_1.default.findIndex((device) => device.id === selectedDeviceId);
    const selectedDevice = deviceInfoIndex
        ? devices_1.default[deviceInfoIndex]
        : devices_1.default[8];
    const isMobile = ["Pixel 3, 3 XL", "iPhone 8 Plus, 7 Plus, 6S Plus"].includes(selectedDevice.name);
    function handleKeyDown(event) {
        if (event.keyCode === 13) {
            setAddressValue(url_1.addHttpToURLIfNotThere(addressInput.current.innerText.trim()));
        }
    }
    function goBack() {
        const cn = forwardRef.current.contentWindow;
        cn.postMessage({ type: actionTypes_1.SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL, value: true }, "*");
    }
    function goForward() {
        const cn = forwardRef.current.contentWindow;
        cn.postMessage({ type: actionTypes_1.SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL, value: true }, "*");
    }
    function refreshPage() {
        const cn = forwardRef.current.contentWindow;
        cn.postMessage({ type: actionTypes_1.SETTINGS_ACTIONS.REFRESH_PAGE, value: true }, "*");
    }
    function Addressbar() {
        const urlEncoded = new URL(addressValue);
        urlEncoded.searchParams.delete("__crusherAgent__");
        return (compat_1.default.createElement("div", { style: styles.addressBar },
            compat_1.default.createElement("div", { style: {
                    width: "1.75rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                } },
                compat_1.default.createElement("img", { style: { width: "0.8rem" }, src: chrome.runtime.getURL("/icons/ssl.svg") })),
            compat_1.default.createElement("div", { ref: addressInput, style: styles.addressBarInput, onKeyDown: handleKeyDown, contentEditable: true }, urlEncoded.toString().substr(0, 50)),
            compat_1.default.createElement("div", { style: styles.recordingStatus },
                compat_1.default.createElement(RecordingIcon, { height: 12, width: 12, style: { marginRight: ".5rem" } }),
                "Recording Test")));
    }
    function Toolbar() {
        return (compat_1.default.createElement("div", { style: styles.browserToolbar },
            compat_1.default.createElement("div", { style: styles.browserSmallShadow }),
            compat_1.default.createElement("div", { style: styles.browserMainToolbar },
                compat_1.default.createElement("div", { style: { display: "flex", alignItems: "center" } },
                    compat_1.default.createElement("img", { src: chrome.runtime.getURL("/icons/navigation-back.svg"), onClick: goBack })),
                compat_1.default.createElement("div", { style: {
                        marginLeft: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                    } },
                    compat_1.default.createElement("img", { src: chrome.runtime.getURL("/icons/navigation-forward.svg"), onClick: goForward })),
                compat_1.default.createElement("div", { style: {
                        marginLeft: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                    } },
                    compat_1.default.createElement("img", { style: { width: "1.1rem" }, src: chrome.runtime.getURL("/icons/navigation-refresh.svg"), onClick: refreshPage })),
                compat_1.default.createElement(Addressbar, null))));
    }
    const IframeSection = () => {
        return (compat_1.default.createElement("div", { style: styles.previewBrowser },
            isMobile && (compat_1.default.createElement("div", { className: "smartphone", style: {
                    width: selectedDevice.width,
                    height: selectedDevice.height,
                } },
                compat_1.default.createElement("div", { className: "content", style: { width: "100%", height: "100%" } },
                    compat_1.default.createElement("iframe", { ref: forwardRef, style: Object.assign(Object.assign({}, styles.browserFrame), { width: "100%", height: "100%" }), scrolling: "auto", sandbox: "allow-scripts allow-forms allow-same-origin", id: "screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634", title: selectedDevice.name, src: addressValue })))),
            !isMobile && (compat_1.default.createElement("iframe", { ref: forwardRef, style: Object.assign(Object.assign({}, styles.browserFrame), { width: selectedDevice.width, height: selectedDevice.height }), scrolling: "auto", id: "screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634", sandbox: "allow-scripts allow-forms allow-same-origin", title: selectedDevice.name, src: addressValue }))));
    };
    return (compat_1.default.createElement("div", { style: styles.mainContainer },
        compat_1.default.createElement("div", { style: styles.browser },
            compat_1.default.createElement(Toolbar, null),
            IframeSection())));
}
let messageListenerCallback = null;
window.addEventListener("message", (event) => {
    if (messageListenerCallback) {
        messageListenerCallback(event);
    }
});
function App() {
    const selectedDeviceId = url_1.getQueryStringParams("device", window.location.href);
    const [steps, setSteps] = hooks_1.useState([
        {
            event_type: domEventsToRecord_1.ACTIONS_IN_TEST.SET_DEVICE,
            selectors: [{ value: "body", uniquenessScore: 1, type: "body" }],
            value: selectedDeviceId,
        },
    ]);
    const [seoMeta, setSeoMeta] = hooks_1.useState({});
    const [isRecording, setIsRecording] = hooks_1.useState(false);
    const [isShowingElementForm, setIsShowingElementForm] = hooks_1.useState(false);
    const [isUsingElementInspector] = hooks_1.useState(false);
    const iframeRef = hooks_1.useRef(null);
    function getSteps() {
        return steps;
    }
    function saveSeoValidation(options) {
        setSteps([...getSteps(), { event_type: domEventsToRecord_1.ACTIONS_IN_TEST.VALIDATE_SEO, value: options, selectors: ["body"] }]);
    }
    messageListenerCallback = function (event) {
        const { type, eventType, value, selectors } = event.data;
        const steps = getSteps();
        if (eventType) {
            const lastStep = steps[steps.length - 1];
            if (!lastStep) {
                setSteps([...getSteps(), { event_type: eventType, value, selectors }]);
            }
            else {
                const navigateEventExist = steps.find((step) => step.event_type === domEventsToRecord_1.ACTIONS_IN_TEST.NAVIGATE_URL);
                if (navigateEventExist && eventType === domEventsToRecord_1.ACTIONS_IN_TEST.NAVIGATE_URL) {
                }
                else {
                    if (lastStep.event_type === domEventsToRecord_1.ACTIONS_IN_TEST.INPUT &&
                        eventType === domEventsToRecord_1.ACTIONS_IN_TEST.INPUT &&
                        lastStep.selectors[0].value === selectors[0].value) {
                        steps[steps.length - 1].value = value;
                        setSteps(steps);
                    }
                    else {
                        setSteps([
                            ...getSteps(),
                            { event_type: eventType, value, selectors },
                        ]);
                    }
                }
            }
        }
        else if (type) {
            const cn = iframeRef.current.contentWindow;
            switch (type) {
                case actionTypes_1.SETTINGS_ACTIONS.SHOW_ELEMENT_FORM_IN_SIDEBAR:
                    setIsShowingElementForm(true);
                    break;
                case actionTypes_1.SETTINGS_ACTIONS.START_RECORDING:
                    setIsRecording(true);
                    break;
                // case ACTION_TYPES.TOOGLE_INSPECTOR:
                //     setIsUsingElementInspector(!isUsingElementInspector);
                //     break;
                case actionTypes_1.META_ACTIONS.FETCH_RECORDING_STATUS:
                    cn.postMessage({
                        type: actionTypes_1.META_ACTIONS.FETCH_RECORDING_STATUS_RESPONSE,
                        value: isUsingElementInspector
                            ? constants_1.START_INSPECTING_RECORDING_MODE
                            : isRecording
                                ? constants_1.START_NON_INSPECTING_RECORDING_MODE
                                : constants_1.NOT_RECORDING,
                        isFromParent: true,
                    }, "*");
                    break;
                case actionTypes_1.META_ACTIONS.FETCH_USER_AGENT:
                    const iframeURL = url_1.getQueryStringParams("url", window.location.href);
                    const crusherAgent = url_1.getQueryStringParams("__crusherAgent__", iframeURL);
                    const userAgent = userAgents_1.default.find((agent) => agent.name === (crusherAgent || userAgents_1.default[6].value));
                    cn.postMessage({ type: actionTypes_1.META_ACTIONS.FETCH_USER_AGENT_RESPONSE, value: userAgent }, "*");
                    break;
                case actionTypes_1.META_ACTIONS.FETCH_SEO_META_RESPONSE:
                    setSeoMeta({ title: value.title, description: value.description });
                    break;
            }
        }
    };
    function saveTest() {
        helpers_1.sendPostDataWithForm(url_1.resolveToBackendPath("/test/goToEditor"), {
            events: escape(JSON.stringify(steps)),
        });
    }
    function cancelTest() {
        if (isShowingElementForm) {
            setIsShowingElementForm(false);
        }
        else {
            window.close();
        }
    }
    function RightBottomSection() {
        return (compat_1.default.createElement("div", { style: { display: "flex", marginTop: "auto" } },
            compat_1.default.createElement("div", { onClick: cancelTest, style: {
                    marginLeft: "auto",
                    width: "auto",
                    marginRight: "3rem",
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "DM Sans",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                } }, "Stop"),
            compat_1.default.createElement("div", { style: Object.assign(Object.assign({}, styles.button), { width: "auto" }), onClick: saveTest },
                compat_1.default.createElement("img", { style: styles.buttonImage, src: chrome.runtime.getURL("icons/record.svg") }),
                compat_1.default.createElement("span", null, "Save Test"))));
    }
    function RightMiddleSection(props) {
        const isElementSelected = isShowingElementForm;
        return isElementSelected ? (compat_1.default.createElement(compat_1.default.Fragment, null,
            compat_1.default.createElement("div", { style: styles.sectionHeading }, "Element Actions"),
            compat_1.default.createElement(Actions, { type: exports.ACTION_FORM_TYPE.ELEMENT_ACTIONS, isShowingElementFormCallback: setIsShowingElementForm, iframeRef: iframeRef, updateState: () => {
                } }))) : (compat_1.default.createElement(compat_1.default.Fragment, null,
            compat_1.default.createElement("div", { style: styles.sectionHeading }, "Actions"),
            compat_1.default.createElement(Actions, { type: exports.ACTION_FORM_TYPE.PAGE_ACTIONS, isShowingElementFormCallback: setIsShowingElementForm, iframeRef: iframeRef, updateState: updateState })));
    }
    const [state, updateState] = hooks_1.useState(null);
    function RightSection() {
        return (compat_1.default.createElement("div", { style: Object.assign(Object.assign({}, styles.sidebar), styles.paddingContainer) },
            compat_1.default.createElement("div", { style: styles.sectionHeading }, "Steps"),
            compat_1.default.createElement(Steps, { steps: steps }),
            compat_1.default.createElement(RightMiddleSection, { state: state, updateState: updateState }),
            compat_1.default.createElement(RightBottomSection, null)));
    }
    // @ts-ignore
    return (compat_1.default.createElement("div", { style: styles.container },
        compat_1.default.createElement(DesktopBrowser, { forwardRef: iframeRef }),
        compat_1.default.createElement(RightSection, null),
        compat_1.default.createElement("style", null, `
                    html, body{
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        font-size: 20px;
                    }
                    .margin-list-item li:not(:first-child){
                        margin-top: 0.75rem;
                    }
                    /* The device with borders */
                    .smartphone {
                        position: relative;
                        width: 360px;
                          height: 640px;
                          margin: auto;
                          border: 16px black solid;
                          border-top-width: 60px;
                          border-bottom-width: 60px;
                          border-radius: 36px;
                    }
                    
                    /* The horizontal line on the top of the device */
                    .smartphone:before {
                      content: '';
                      display: block;
                      width: 60px;
                      height: 5px;
                      position: absolute;
                      top: -30px;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: #333;
                      border-radius: 10px;
                    }

                    /* The circle on the bottom of the device */
                    .smartphone:after {
                      content: '';
                      display: block;
                      width: 35px;
                      height: 35px;
                      position: absolute;
                      left: 50%;
                      bottom: -65px;
                      transform: translate(-50%, -50%);
                      background: #333;
                      border-radius: 50%;
                    }

                    /* The screen (or content) of the device */
                    .smartphone .content {
                      width: 360px;
                      height: 640px;
                      background: white;
                    }
                `),
        compat_1.default.createElement("link", { rel: "stylesheet", href: chrome.runtime.getURL("/styles/devices.min.css") }),
        compat_1.default.createElement("link", { rel: "stylesheet", href: chrome.runtime.getURL("/styles/fonts.css") }),
        compat_1.default.createElement(modal_1.Modal, { seoMeta: seoMeta, state: state, updateState: updateState, saveSeoValidationCallback: saveSeoValidation })));
}
const styles = {
    container: {
        display: "flex",
        height: "auto",
        background: "rgb(40, 40, 40)",
    },
    mainContainer: {
        flex: 1,
        width: "70%",
        maxHeight: "100vh",
        overflow: "auto",
    },
    sidebar: {
        background: "#141528",
        display: "flex",
        flexDirection: "column",
        maxWidth: "19rem",
        marginLeft: "auto",
        maxHeight: "100vh",
    },
    centerItemsVerticalFlex: {
        display: "flex",
        alignItems: "center",
    },
    sectionHeading: {
        fontFamily: "DM Sans",
        fontSize: "0.9rem",
        fontWeight: 700,
        marginBottom: "0rem",
        color: "#fff",
    },
    paddingContainer: {
        padding: "1.9rem 1.25rem",
    },
    stepsContainer: {
        listStyle: "none",
        padding: 0,
    },
    step: {
        display: "flex",
        cursor: "pointer",
        fontFamily: "DM Sans",
        fontStyle: "normal",
        background: "#0C0C1F",
        borderRadius: "0.25rem",
        padding: "0.6rem 0",
        overflow: "hidden",
    },
    stepImage: {
        padding: "0rem 0.9rem",
    },
    stepTextContainer: {
        flex: 1,
    },
    stepAction: {
        fontWeight: "bold",
        color: "#9393BC",
        fontSize: "0.8rem",
    },
    stepSelector: {
        marginTop: "0.25rem",
        color: "#fff",
        fontSize: "0.6rem",
        whiteSpace: "nowrap",
    },
    stepGoImage: {
        paddingRight: "0.75rem",
    },
    browser: {
        background: "rgb(40, 40, 40)",
        minHeight: "100vh",
        overflow: "hidden",
    },
    browserToolbar: {
        display: "flex",
        flexDirection: "column",
    },
    browserSmallShadow: {
        background: "rgb(53, 57, 74)",
        height: "0.4rem",
    },
    browserMainToolbar: {
        background: "rgb(53, 57, 74)",
        display: "flex",
        padding: "0.25rem 0.75rem",
    },
    addressBar: {
        width: "65%",
        padding: "0 0.1rem",
        background: "#2b2e37",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        borderRadius: "1rem",
        marginLeft: "0.9rem",
        height: "1.3rem",
    },
    addressBarInput: {
        flex: 1,
        fontSize: "0.7rem",
        outline: "none",
        display: "flex",
        marginLeft: "0.1rem",
        alignItems: "center",
    },
    recordingStatus: {
        background: "#1E2027",
        color: "#64707C",
        lineHeight: "1.15rem",
        fontSize: "0.6rem",
        display: "flex",
        alignItems: "center",
        fontWeight: "500",
        fontFamily: "DM Sans",
        padding: "0 0.8rem",
    },
    previewBrowser: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        paddingTop: "3rem",
        overflowY: "auto",
        background: "rgb(40, 40, 40)",
    },
    browserFrame: {
        border: "none",
        display: "block",
        borderRadius: 2,
        width: 1280,
        height: 800,
        backgroundColor: "#fff",
    },
    button: {
        background: "#0C0C1F",
        boxShadow: "inset 0px 1px 13px 4px #070718",
        borderRadius: 4,
        fontWeight: 600,
        fontSize: "0.825rem",
        color: "#fff",
        fontFamily: "DM Sans",
        padding: "0.65rem 1rem",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    buttonImage: {
        marginRight: "1.2rem",
    },
    actionListContainer: {
        display: "flex",
        flexDirection: "column",
    },
    actionRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
    },
    actionItem: {
        padding: "0.8rem 0.8rem",
        fontFamily: "DM Sans",
        fontWeight: "bold",
        fontSize: "0.8rem",
        color: "#fff",
        background: "#0D0D20",
        boxShadow: "inset 0px 0px 15px 1px rgba(7, 7, 26, 0.7)",
        borderRadius: "0.2rem",
        width: "6.5rem",
        display: "flex",
        cursor: "pointer",
    },
    actionImage: {},
    actionText: {
        marginLeft: "auto",
    },
    oddItem: {
        marginRight: "1rem",
    },
};
exports.default = App;
//# sourceMappingURL=app.js.map