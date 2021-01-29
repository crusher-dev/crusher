(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/actions/addInput.ts":
/*!*********************************!*\
  !*** ./src/actions/addInput.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function addInput(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const inputKeys = action.payload.meta.value;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to press keycodes on element with invalid selector: ${selector}`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await functions_1.type(elementHandle, inputKeys);
            return success({
                message: `Pressed keys on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while adding input to element");
        }
    });
}
exports.default = addInput;


/***/ }),

/***/ "./src/actions/assertElement.ts":
/*!**************************************!*\
  !*** ./src/actions/assertElement.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const functions_2 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function assert(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_2.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const validationRows = action.payload.meta.validationRows;
            const output = await functions_1.assertElement(page, selector, validationRows);
            return success({
                message: `Successfully asserted element ${selector}`,
                meta: { output }
            });
        }
        catch (err) {
            console.error(err);
            return error("Some issue occurred while asserting element");
        }
    });
}
exports.default = assert;


/***/ }),

/***/ "./src/actions/click.ts":
/*!******************************!*\
  !*** ./src/actions/click.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function click(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`No element with selector as ${selector} exists`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await elementHandle.dispatchEvent("click");
            // If under navigation wait for load state to complete.
            await page.waitForLoadState();
            return success({
                message: `Clicked on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while clicking on element");
        }
    });
}
exports.default = click;


/***/ }),

/***/ "./src/actions/elementScreenshot.ts":
/*!******************************************!*\
  !*** ./src/actions/elementScreenshot.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
function elementScreenshot(action, page, stepIndex) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== 'string') {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to capture screenshot of element with invalid selector: ${selector}`);
            }
            const elementScreenshotBuffer = await elementHandle.screenshot();
            return success({
                message: `Captured element screenshot for ${selector}`,
                output: { name: helper_1.generateScreenshotName(selector, stepIndex), value: elementScreenshotBuffer },
            });
        }
        catch (err) {
            return error('Some issue occurred while capturing screenshot of element');
        }
    });
}
exports.default = elementScreenshot;


/***/ }),

/***/ "./src/actions/elementScroll.ts":
/*!**************************************!*\
  !*** ./src/actions/elementScroll.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            if (!selector) {
                return error(`Attempt to scroll element with invalid selector: ${selector}`);
            }
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, selector, scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while scrolling on element");
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/hover.ts":
/*!******************************!*\
  !*** ./src/actions/hover.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
async function hover(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            await page.hover(selector);
            return success({
                message: `Hovered on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while hovering on element");
        }
    });
}
exports.default = hover;


/***/ }),

/***/ "./src/actions/index.ts":
/*!******************************!*\
  !*** ./src/actions/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addInput_1 = __importDefault(__webpack_require__(/*! ./addInput */ "./src/actions/addInput.ts"));
const click_1 = __importDefault(__webpack_require__(/*! ./click */ "./src/actions/click.ts"));
const hover_1 = __importDefault(__webpack_require__(/*! ./hover */ "./src/actions/hover.ts"));
const elementScreenshot_1 = __importDefault(__webpack_require__(/*! ./elementScreenshot */ "./src/actions/elementScreenshot.ts"));
const pageScreenshot_1 = __importDefault(__webpack_require__(/*! ./pageScreenshot */ "./src/actions/pageScreenshot.ts"));
const elementScroll_1 = __importDefault(__webpack_require__(/*! ./elementScroll */ "./src/actions/elementScroll.ts"));
const pageScroll_1 = __importDefault(__webpack_require__(/*! ./pageScroll */ "./src/actions/pageScroll.ts"));
const navigateUrl_1 = __importDefault(__webpack_require__(/*! ./navigateUrl */ "./src/actions/navigateUrl.ts"));
const setDevice_1 = __importDefault(__webpack_require__(/*! ./setDevice */ "./src/actions/setDevice.ts"));
const assertElement_1 = __importDefault(__webpack_require__(/*! ./assertElement */ "./src/actions/assertElement.ts"));
module.exports = {
    Element: {
        addInput: addInput_1.default,
        click: click_1.default,
        hover: hover_1.default,
        scroll: elementScroll_1.default,
        screenshot: elementScreenshot_1.default,
        elementScroll: elementScroll_1.default,
        assertElement: assertElement_1.default
    },
    Page: {
        screenshot: pageScreenshot_1.default,
        scroll: pageScroll_1.default,
        navigate: navigateUrl_1.default,
    },
    Browser: {
        setDevice: setDevice_1.default,
    },
};


/***/ }),

/***/ "./src/actions/navigateUrl.ts":
/*!************************************!*\
  !*** ./src/actions/navigateUrl.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function navigateUrl(action, page) {
    return new Promise(async (success, error) => {
        try {
            const urlToGo = action.payload.meta.value;
            await page.goto(urlToGo);
            return success({
                message: `Navigated successfully to ${urlToGo}`,
            });
        }
        catch (err) {
            console.error(err);
            return error('Some issue occurred while navigating to webpage');
        }
    });
}
exports.default = navigateUrl;


/***/ }),

/***/ "./src/actions/pageScreenshot.ts":
/*!***************************************!*\
  !*** ./src/actions/pageScreenshot.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.ts");
function capturePageScreenshot(page, stepIndex) {
    return new Promise(async (success, error) => {
        try {
            const pageTitle = await page.title();
            const pageUrl = await page.url();
            const screenshotBuffer = await page.screenshot();
            return success({
                message: `Clicked page screenshot for ${pageUrl}`,
                output: { name: helper_1.generateScreenshotName(pageTitle, stepIndex), value: screenshotBuffer },
            });
        }
        catch (err) {
            return error('Some issue occurred while capturing screenshot of page');
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/pageScroll.ts":
/*!***********************************!*\
  !*** ./src/actions/pageScroll.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        try {
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, "window", scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while scrolling the page");
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/setDevice.ts":
/*!**********************************!*\
  !*** ./src/actions/setDevice.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function setDevice(action) {
    return new Promise(async (success, error) => {
        try {
            const device = action.payload.meta.device;
            const userAgent = action.payload.meta.userAgent;
            return success({
                message: "Setup device for testing",
                meta: {
                    width: device.width,
                    height: device.height,
                    userAgent: userAgent.value,
                },
            });
        }
        catch (err) {
            return error("Some issue occurred while setting the device");
        }
    });
}
exports.default = setDevice;


/***/ }),

/***/ "./src/functions/assertElement.ts":
/*!****************************************!*\
  !*** ./src/functions/assertElement.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function assertElementAttributes(page, selector, assertions) {
    const elHandle = await page.$(selector);
    let hasPassed = true;
    const logs = [];
    for (let i = 0; i < assertions.length; i++) {
        const { validation, operation, field } = assertions[i];
        const elementAttributeValue = await elHandle.getAttribute(field.name);
        if (operation === "matches") {
            if (elementAttributeValue !== validation) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute=" + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute=" + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
        else if (operation === "contains") {
            const doesContain = elementAttributeValue.includes(validation);
            if (!doesContain) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute contains " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute contains " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
        else if (operation === "regex") {
            const rgx = new RegExp(validation);
            if (!rgx.test(elementAttributeValue)) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute matches regex: " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute matches regex: " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
    }
    return [hasPassed, logs];
}
exports.default = assertElementAttributes;


/***/ }),

/***/ "./src/functions/index.ts":
/*!********************************!*\
  !*** ./src/functions/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertElement = exports.sleep = exports.waitForSelectors = exports.type = exports.scroll = void 0;
const scroll_1 = __importDefault(__webpack_require__(/*! ./scroll */ "./src/functions/scroll.ts"));
exports.scroll = scroll_1.default;
const type_1 = __importDefault(__webpack_require__(/*! ./type */ "./src/functions/type.ts"));
exports.type = type_1.default;
const waitForSelectors_1 = __importDefault(__webpack_require__(/*! ./waitForSelectors */ "./src/functions/waitForSelectors.ts"));
exports.waitForSelectors = waitForSelectors_1.default;
const sleep_1 = __importDefault(__webpack_require__(/*! ./sleep */ "./src/functions/sleep.ts"));
exports.sleep = sleep_1.default;
const assertElement_1 = __importDefault(__webpack_require__(/*! ./assertElement */ "./src/functions/assertElement.ts"));
exports.assertElement = assertElement_1.default;


/***/ }),

/***/ "./src/functions/scroll.ts":
/*!*********************************!*\
  !*** ./src/functions/scroll.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function scroll(page, selector, scrollDeltaArr) {
    await page.evaluate(([scrollDeltaArr, selectorKey]) => {
        const scrollTo = function (element, offset) {
            const fixedOffset = offset.toFixed();
            const onScroll = () => {
                if (element.pageYOffset.toFixed() === fixedOffset) {
                    element.removeEventListener("scroll", onScroll);
                    return true;
                }
                return false;
            };
            element.addEventListener("scroll", onScroll);
            onScroll();
            element.scrollTo({
                top: offset,
                behavior: "smooth",
            });
        };
        const element = selectorKey === "window" ? window : document.querySelector(selectorKey);
        for (let i = 0; i < scrollDeltaArr.length; i++) {
            scrollTo(element, scrollDeltaArr[i]);
        }
    }, [scrollDeltaArr, selector]);
}
exports.default = scroll;


/***/ }),

/***/ "./src/functions/sleep.ts":
/*!********************************!*\
  !*** ./src/functions/sleep.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}
exports.default = sleep;


/***/ }),

/***/ "./src/functions/type.ts":
/*!*******************************!*\
  !*** ./src/functions/type.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function type(elHandle, keyCodes) {
    for (let i = 0; i < keyCodes.length; i++) {
        await elHandle.press(String.fromCharCode(keyCodes[i]));
    }
    return true;
}
exports.default = type;


/***/ }),

/***/ "./src/functions/waitForSelectors.ts":
/*!*******************************************!*\
  !*** ./src/functions/waitForSelectors.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
async function waitForSelectors(page, selectors, defaultSelector = null) {
    if (!defaultSelector) {
        defaultSelector = selectors[0].value;
    }
    try {
        await page.waitForSelector(defaultSelector, { state: "attached" });
        return defaultSelector;
    }
    catch (_a) {
        const validSelector = await page.evaluate((selectors) => {
            for (const selector of selectors) {
                try {
                    if (selector.type === "xpath") {
                        const elements = dom_1.getElementsByXPath(selector.value);
                        if (elements.length) {
                            const elementSelectorFromXpath = dom_1.generateQuerySelector(elements[0]);
                            return elementSelectorFromXpath;
                        }
                    }
                    else if (document.querySelector(selector.value)) {
                        return selector.value;
                    }
                }
                catch (ex) {
                    console.debug("Caught exception", ex);
                }
            }
            return null;
        }, selectors);
        if (typeof validSelector === "undefined") {
            throw new Error("This is not working");
        }
        return validSelector;
    }
}
exports.default = waitForSelectors;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", { value: true });
const actions = __importStar(__webpack_require__(/*! ./actions */ "./src/actions/index.ts"));
module.exports = actions;


/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuerySelector = exports.getElementsByXPath = void 0;
const getElementsByXPath = (xpath, parent = null) => {
    const results = [];
    const query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        const item = query.snapshotItem(i);
        if (item)
            results.push(item);
    }
    return results;
};
exports.getElementsByXPath = getElementsByXPath;
const generateQuerySelector = (el) => {
    if (el.tagName.toLowerCase() == "html")
        return "HTML";
    let str = el.tagName;
    str += el.id != "" ? "#" + el.id : "";
    if (el.className) {
        const classes = el.className.split(/\s/);
        for (let i = 0; i < classes.length; i++) {
            str += "." + classes[i];
        }
    }
    return generateQuerySelector(el.parentNode) + " > " + str;
};
exports.generateQuerySelector = generateQuerySelector;


/***/ }),

/***/ "./src/utils/helper.ts":
/*!*****************************!*\
  !*** ./src/utils/helper.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScreenshotName = void 0;
const generateScreenshotName = (selector, stepIndex) => {
    return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
};
exports.generateScreenshotName = generateScreenshotName;


/***/ })

/******/ })));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYWRkSW5wdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9jbGljay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2NyZWVuc2hvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL25hdmlnYXRlVXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JvbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvc2V0RGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Z1bmN0aW9ucy90eXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RvbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7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LENBQUMsQ0FBQztTQUN4QjtLQUNEO0lBQ0QsT0FBTyxxQkFBcUIsQ0FBRSxFQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNwRSxDQUFDLENBQUM7QUFFMkIsc0RBQXFCOzs7Ozs7Ozs7Ozs7Ozs7O0FDaENsRCxNQUFNLHNCQUFzQixHQUFHLENBQUMsUUFBZ0IsRUFBRSxTQUFpQixFQUFVLEVBQUU7SUFDOUUsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksU0FBUyxNQUFNLENBQUM7QUFDbkYsQ0FBQyxDQUFDO0FBRU8sd0RBQXNCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRJbnB1dChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3QgaW5wdXRLZXlzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihcblx0XHRcdFx0XHRgQXR0ZW1wdCB0byBwcmVzcyBrZXljb2RlcyBvbiBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRcdGF3YWl0IHR5cGUoZWxlbWVudEhhbmRsZSwgaW5wdXRLZXlzKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgUHJlc3NlZCBrZXlzIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYWRkaW5nIGlucHV0IHRvIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsIiBpbXBvcnQge2Fzc2VydEVsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbiBpbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuIGltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuIGltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG4gaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzc2VydChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0IHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHQgdHJ5e1xuXHRcdFx0IGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHQgY29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdCBpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0IHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0IH1cblxuXHRcdFx0IGNvbnN0IHZhbGlkYXRpb25Sb3dzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWxpZGF0aW9uUm93cztcblx0XHRcdCBjb25zdCBvdXRwdXQgPSBhd2FpdCBhc3NlcnRFbGVtZW50KHBhZ2UsIHNlbGVjdG9yLCB2YWxpZGF0aW9uUm93cyk7XG5cblx0XHRcdCByZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdCBtZXNzYWdlOiBgU3VjY2Vzc2Z1bGx5IGFzc2VydGVkIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0XHQgbWV0YToge291dHB1dH1cblx0XHRcdCB9KTtcblx0XHQgfSBjYXRjaChlcnIpe1xuXHRcdCBcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdCByZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFzc2VydGluZyBlbGVtZW50XCIpO1xuXHRcdCB9XG5cdCB9KTtcbiB9XG4iLCJpbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGljayhhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeXtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHR9XG5cdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0cmV0dXJuIGVycm9yKGBObyBlbGVtZW50IHdpdGggc2VsZWN0b3IgYXMgJHtzZWxlY3Rvcn0gZXhpc3RzYCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5kaXNwYXRjaEV2ZW50KFwiY2xpY2tcIik7XG5cblx0XHQvLyBJZiB1bmRlciBuYXZpZ2F0aW9uIHdhaXQgZm9yIGxvYWQgc3RhdGUgdG8gY29tcGxldGUuXG5cdFx0YXdhaXQgcGFnZS53YWl0Rm9yTG9hZFN0YXRlKCk7XG5cblx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjbGlja2luZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uJztcbmltcG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbGVtZW50U2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UsIHN0ZXBJbmRleDogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRpZiAoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IgYXMgc3RyaW5nKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gY2FwdHVyZSBzY3JlZW5zaG90IG9mIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IGVsZW1lbnRIYW5kbGUuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3J9YCxcblx0XHRcdFx0b3V0cHV0OiB7IG5hbWU6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUoc2VsZWN0b3IsIHN0ZXBJbmRleCksIHZhbHVlOiBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciB9LFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoJ1NvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2FwdHVyaW5nIHNjcmVlbnNob3Qgb2YgZWxlbWVudCcpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgc2Nyb2xsLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFzZWxlY3Rvcikge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gc2Nyb2xsIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBzZWxlY3Rvciwgc2Nyb2xsRGVsdGEpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBob3ZlcihhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblxuXHRcdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBwYWdlLmhvdmVyKHNlbGVjdG9yKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgSG92ZXJlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGhvdmVyaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCBhZGRJbnB1dCBmcm9tIFwiLi9hZGRJbnB1dFwiO1xuaW1wb3J0IGNsaWNrIGZyb20gXCIuL2NsaWNrXCI7XG5pbXBvcnQgaG92ZXIgZnJvbSBcIi4vaG92ZXJcIjtcbmltcG9ydCBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QgZnJvbSBcIi4vZWxlbWVudFNjcmVlbnNob3RcIjtcbmltcG9ydCBjYXB0dXJlUGFnZVNjcmVlbnNob3QgZnJvbSBcIi4vcGFnZVNjcmVlbnNob3RcIjtcbmltcG9ydCBlbGVtZW50U2Nyb2xsIGZyb20gXCIuL2VsZW1lbnRTY3JvbGxcIjtcbmltcG9ydCBwYWdlU2Nyb2xsIGZyb20gXCIuL3BhZ2VTY3JvbGxcIjtcbmltcG9ydCBuYXZpZ2F0ZVVybCBmcm9tIFwiLi9uYXZpZ2F0ZVVybFwiO1xuaW1wb3J0IHNldERldmljZSBmcm9tIFwiLi9zZXREZXZpY2VcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gJy4vYXNzZXJ0RWxlbWVudCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRFbGVtZW50OiB7XG5cdFx0YWRkSW5wdXQsXG5cdFx0Y2xpY2ssXG5cdFx0aG92ZXIsXG5cdFx0c2Nyb2xsOiBlbGVtZW50U2Nyb2xsLFxuXHRcdHNjcmVlbnNob3Q6IGNhcHR1cmVFbGVtZW50U2NyZWVuc2hvdCxcblx0XHRlbGVtZW50U2Nyb2xsLFxuXHRcdGFzc2VydEVsZW1lbnRcblx0fSxcblx0UGFnZToge1xuXHRcdHNjcmVlbnNob3Q6IGNhcHR1cmVQYWdlU2NyZWVuc2hvdCxcblx0XHRzY3JvbGw6IHBhZ2VTY3JvbGwsXG5cdFx0bmF2aWdhdGU6IG5hdmlnYXRlVXJsLFxuXHR9LFxuXHRCcm93c2VyOiB7XG5cdFx0c2V0RGV2aWNlLFxuXHR9LFxufTtcbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gbmF2aWdhdGVVcmwoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdXJsVG9HbyA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cblx0XHRcdGF3YWl0IHBhZ2UuZ290byh1cmxUb0dvKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgTmF2aWdhdGVkIHN1Y2Nlc3NmdWxseSB0byAke3VybFRvR299YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIG5hdmlnYXRpbmcgdG8gd2VicGFnZScpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FwdHVyZVBhZ2VTY3JlZW5zaG90KHBhZ2U6IFBhZ2UsIHN0ZXBJbmRleDogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFnZVRpdGxlID0gYXdhaXQgcGFnZS50aXRsZSgpO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRjb25zdCBzY3JlZW5zaG90QnVmZmVyID0gYXdhaXQgcGFnZS5zY3JlZW5zaG90KCk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYENsaWNrZWQgcGFnZSBzY3JlZW5zaG90IGZvciAke3BhZ2VVcmx9YCxcblx0XHRcdFx0b3V0cHV0OiB7IG5hbWU6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUocGFnZVRpdGxlLCBzdGVwSW5kZXgpLCB2YWx1ZTogc2NyZWVuc2hvdEJ1ZmZlciB9LFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoJ1NvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2FwdHVyaW5nIHNjcmVlbnNob3Qgb2YgcGFnZScpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgc2Nyb2xsIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2Nyb2xsRGVsdGEgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRhd2FpdCBzY3JvbGwocGFnZSwgXCJ3aW5kb3dcIiwgc2Nyb2xsRGVsdGEpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyB0aGUgcGFnZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpRGV2aWNlIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9leHRlbnNpb24vZGV2aWNlXCI7XG5pbXBvcnQgeyBpVXNlckFnZW50IH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC9jb25zdGFudHMvdXNlckFnZW50c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzZXREZXZpY2UoYWN0aW9uOiBpQWN0aW9uKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGV2aWNlID0gYWN0aW9uLnBheWxvYWQubWV0YS5kZXZpY2UgYXMgaURldmljZTtcblx0XHRcdGNvbnN0IHVzZXJBZ2VudCA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudXNlckFnZW50IGFzIGlVc2VyQWdlbnQ7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogXCJTZXR1cCBkZXZpY2UgZm9yIHRlc3RpbmdcIixcblx0XHRcdFx0bWV0YToge1xuXHRcdFx0XHRcdHdpZHRoOiBkZXZpY2Uud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBkZXZpY2UuaGVpZ2h0LFxuXHRcdFx0XHRcdHVzZXJBZ2VudDogdXNlckFnZW50LnZhbHVlLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzZXR0aW5nIHRoZSBkZXZpY2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFzc2VydGlvblJvdyB9IGZyb20gJy4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL2Fzc2VydGlvblJvdyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGFzc2VydEVsZW1lbnRBdHRyaWJ1dGVzKHBhZ2U6IFBhZ2UsIHNlbGVjdG9yOiBzdHJpbmcsIGFzc2VydGlvbnM6IEFycmF5PGlBc3NlcnRpb25Sb3c+KXtcblx0Y29uc3QgZWxIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IpO1xuXHRsZXQgaGFzUGFzc2VkID0gdHJ1ZTtcblx0Y29uc3QgbG9ncyA9IFtdO1xuXG5cdGZvcihsZXQgaSA9IDA7IGkgPCBhc3NlcnRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qge3ZhbGlkYXRpb24sIG9wZXJhdGlvbiwgZmllbGR9ID0gYXNzZXJ0aW9uc1tpXTtcblx0XHRjb25zdCBlbGVtZW50QXR0cmlidXRlVmFsdWUgPSBhd2FpdCBlbEhhbmRsZSEuZ2V0QXR0cmlidXRlKGZpZWxkLm5hbWUpO1xuXHRcdGlmKG9wZXJhdGlvbiA9PT0gXCJtYXRjaGVzXCIpIHtcblx0XHRcdGlmKGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSAhPT0gdmFsaWRhdGlvbil7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZT1cIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwiY29udGFpbnNcIikge1xuXHRcdFx0Y29uc3QgZG9lc0NvbnRhaW4gPSAgZWxlbWVudEF0dHJpYnV0ZVZhbHVlIS5pbmNsdWRlcyh2YWxpZGF0aW9uKTtcblx0XHRcdGlmKCFkb2VzQ29udGFpbiApe1xuXHRcdFx0XHRoYXNQYXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRkFJTEVEXCIsIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIGFzc2VydCBhdHRyaWJ1dGUgY29udGFpbnMgXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYob3BlcmF0aW9uID09PSBcInJlZ2V4XCIgKXtcblx0XHRcdGNvbnN0IHJneCA9IG5ldyBSZWdFeHAodmFsaWRhdGlvbik7XG5cdFx0XHRpZiAoIXJneC50ZXN0KGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSEpKSB7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGUgbWF0Y2hlcyByZWdleDogXCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFtoYXNQYXNzZWQsIGxvZ3NdO1xufVxuIiwiaW1wb3J0IHNjcm9sbCBmcm9tIFwiLi9zY3JvbGxcIjtcbmltcG9ydCB0eXBlIGZyb20gXCIuL3R5cGVcIjtcbmltcG9ydCB3YWl0Rm9yU2VsZWN0b3JzIGZyb20gXCIuL3dhaXRGb3JTZWxlY3RvcnNcIjtcbmltcG9ydCBzbGVlcCBmcm9tIFwiLi9zbGVlcFwiO1xuaW1wb3J0IGFzc2VydEVsZW1lbnQgZnJvbSAnLi9hc3NlcnRFbGVtZW50JztcblxuZXhwb3J0IHsgc2Nyb2xsLCB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzLCBzbGVlcCwgYXNzZXJ0RWxlbWVudCB9O1xuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNjcm9sbChcblx0cGFnZTogUGFnZSxcblx0c2VsZWN0b3I6IHN0cmluZyxcblx0c2Nyb2xsRGVsdGFBcnI6IEFycmF5PG51bWJlcj4sXG4pIHtcblx0YXdhaXQgcGFnZS5ldmFsdWF0ZShcblx0XHQgKFtzY3JvbGxEZWx0YUFyciwgc2VsZWN0b3JLZXldOiBbbnVtYmVyW10sIHN0cmluZ10pID0+IHtcblx0XHRcdGNvbnN0IHNjcm9sbFRvID0gIGZ1bmN0aW9uIChlbGVtZW50OiBIVE1MRWxlbWVudCwgb2Zmc2V0OiBudW1iZXIpIHtcblx0XHRcdFx0Y29uc3QgZml4ZWRPZmZzZXQgPSBvZmZzZXQudG9GaXhlZCgpO1xuXHRcdFx0XHRjb25zdCBvblNjcm9sbCA9ICgpID0+IHtcblx0XHRcdFx0XHRpZiAoKGVsZW1lbnQgYXMgYW55KS5wYWdlWU9mZnNldC50b0ZpeGVkKCkgPT09IGZpeGVkT2Zmc2V0KSB7XG5cdFx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGwpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgb25TY3JvbGwpO1xuXHRcdFx0XHRvblNjcm9sbCgpO1xuXHRcdFx0XHRlbGVtZW50LnNjcm9sbFRvKHtcblx0XHRcdFx0XHR0b3A6IG9mZnNldCxcblx0XHRcdFx0XHRiZWhhdmlvcjogXCJzbW9vdGhcIixcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBlbGVtZW50ID1cblx0XHRcdFx0c2VsZWN0b3JLZXkgPT09IFwid2luZG93XCIgPyB3aW5kb3cgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yS2V5KTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzY3JvbGxEZWx0YUFyci5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHQgc2Nyb2xsVG8oZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgc2Nyb2xsRGVsdGFBcnJbaV0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0W3Njcm9sbERlbHRhQXJyLCBzZWxlY3Rvcl0sXG5cdCk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzbGVlcCh0aW1lOiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdH0sIHRpbWUpO1xuXHR9KTtcbn1cbiIsImltcG9ydCB7IEVsZW1lbnRIYW5kbGUgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB0eXBlKFxuXHRlbEhhbmRsZTogRWxlbWVudEhhbmRsZSxcblx0a2V5Q29kZXM6IEFycmF5PG51bWJlcj4sXG4pIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlDb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdGF3YWl0IGVsSGFuZGxlLnByZXNzKFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5Q29kZXNbaV0pKTtcblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IsIGdldEVsZW1lbnRzQnlYUGF0aCB9IGZyb20gXCIuLi91dGlscy9kb21cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvclNlbGVjdG9ycyhcblx0cGFnZTogUGFnZSxcblx0c2VsZWN0b3JzOiBBcnJheTxpU2VsZWN0b3JJbmZvPixcblx0ZGVmYXVsdFNlbGVjdG9yID0gbnVsbCBhcyBzdHJpbmcgfCBudWxsLFxuKSB7XG5cdGlmICghZGVmYXVsdFNlbGVjdG9yKSB7XG5cdFx0ZGVmYXVsdFNlbGVjdG9yID0gc2VsZWN0b3JzWzBdLnZhbHVlO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRhd2FpdCBwYWdlLndhaXRGb3JTZWxlY3RvcihkZWZhdWx0U2VsZWN0b3IsIHsgc3RhdGU6IFwiYXR0YWNoZWRcIiB9KTtcblx0XHRyZXR1cm4gZGVmYXVsdFNlbGVjdG9yO1xuXHR9IGNhdGNoIHtcblx0XHRjb25zdCB2YWxpZFNlbGVjdG9yID0gYXdhaXQgcGFnZS5ldmFsdWF0ZSgoc2VsZWN0b3JzKSA9PiB7XG5cdFx0XHRmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGlmIChzZWxlY3Rvci50eXBlID09PSBcInhwYXRoXCIpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVsZW1lbnRzID0gZ2V0RWxlbWVudHNCeVhQYXRoKHNlbGVjdG9yLnZhbHVlKTtcblx0XHRcdFx0XHRcdGlmIChlbGVtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudFNlbGVjdG9yRnJvbVhwYXRoID0gZ2VuZXJhdGVRdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRcdGVsZW1lbnRzWzBdIGFzIEhUTUxFbGVtZW50LFxuXHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yLnZhbHVlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGVjdG9yLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZXgpIHtcblx0XHRcdFx0XHRjb25zb2xlLmRlYnVnKFwiQ2F1Z2h0IGV4Y2VwdGlvblwiLCBleCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0sIHNlbGVjdG9ycyk7XG5cdFx0aWYgKHR5cGVvZiB2YWxpZFNlbGVjdG9yID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGlzIG5vdCB3b3JraW5nXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsaWRTZWxlY3Rvcjtcblx0fVxufVxuIiwiaW1wb3J0ICogIGFzIGFjdGlvbnMgZnJvbSBcIi4vYWN0aW9uc1wiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFjdGlvbnM7XG4iLCJjb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdHhwYXRoOiBzdHJpbmcsXG5cdHBhcmVudDogTm9kZSB8IG51bGwgPSBudWxsLFxuKTogTm9kZVtdID0+IHtcblx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRjb25zdCBxdWVyeSA9IGRvY3VtZW50LmV2YWx1YXRlKFxuXHRcdHhwYXRoLFxuXHRcdHBhcmVudCB8fCBkb2N1bWVudCxcblx0XHRudWxsLFxuXHRcdFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdG51bGwsXG5cdCk7XG5cdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0Y29uc3QgaXRlbSA9IHF1ZXJ5LnNuYXBzaG90SXRlbShpKTtcblx0XHRpZiAoaXRlbSkgcmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuY29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIpIHJldHVybiBcIkhUTUxcIjtcblx0bGV0IHN0ciA9IGVsLnRhZ05hbWU7XG5cdHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdGlmIChlbC5jbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLnNwbGl0KC9cXHMvKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHN0ciArPSBcIi5cIiArIGNsYXNzZXNbaV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoKGVsIGFzIGFueSkucGFyZW50Tm9kZSkgKyBcIiA+IFwiICsgc3RyO1xufTtcblxuZXhwb3J0IHsgZ2V0RWxlbWVudHNCeVhQYXRoLCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgfTtcbiIsImNvbnN0IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgPSAoc2VsZWN0b3I6IHN0cmluZywgc3RlcEluZGV4OiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuXHRyZXR1cm4gc2VsZWN0b3IucmVwbGFjZSgvW15cXHdcXHNdL2dpLCAnJykucmVwbGFjZSgvIC9nLCAnXycpICsgYF8ke3N0ZXBJbmRleH0ucG5nYDtcbn07XG5cbmV4cG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgfTtcbiJdLCJzb3VyY2VSb290IjoiIn0=