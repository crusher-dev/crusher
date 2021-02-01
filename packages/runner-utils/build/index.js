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

/***/ "../../node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/actions sync recursive":
/*!**************************!*\
  !*** ./src/actions sync ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/actions sync recursive";

/***/ }),

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

/***/ "./src/actions/elementCustomScript.ts":
/*!********************************************!*\
  !*** ./src/actions/elementCustomScript.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, __filename, __dirname) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScriptOnElement = void 0;
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const runScriptOnElement = (script, elHandle) => {
    return new Function('exports', 'require', 'module', '__filename', '__dirname', 'script', 'elHandle', `return new Promise(async function (resolve, reject) {
				    try{
				        const scriptFunction = ${script};
				        console.log(scriptFunction);
				        resolve(scriptFunction(elHandle));
				    } catch(err){
				      reject(err);
				    }
				});`)(exports, __webpack_require__("./src/actions sync recursive"), module, __filename, __dirname, script, elHandle);
};
exports.runScriptOnElement = runScriptOnElement;
function elementCustomScript(action, page) {
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
            const customScript = action.payload.meta.script;
            const scriptOutput = await exports.runScriptOnElement(customScript, elementHandle);
            if (!!scriptOutput) {
                return success({
                    message: `Clicked on the element ${selector}`,
                });
            }
            else {
                return error(`Assertion failed according to the script with output: ${JSON.stringify(scriptOutput)}`);
            }
        }
        catch (err) {
            console.error(err);
            return error("Some issue occurred while running script on element");
        }
    });
}
exports.default = elementCustomScript;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/module.js */ "../../node_modules/webpack/buildin/module.js")(module), "/index.js", "/"))

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
const elementCustomScript_1 = __importDefault(__webpack_require__(/*! ./elementCustomScript */ "./src/actions/elementCustomScript.ts"));
module.exports = {
    Element: {
        addInput: addInput_1.default,
        click: click_1.default,
        hover: hover_1.default,
        scroll: elementScroll_1.default,
        screenshot: elementScreenshot_1.default,
        elementScroll: elementScroll_1.default,
        assertElement: assertElement_1.default,
        runCustomScript: elementCustomScript_1.default
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucyBzeW5jIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2FkZElucHV0LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2Fzc2VydEVsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvY2xpY2sudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvZWxlbWVudEN1c3RvbVNjcmlwdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2NyZWVuc2hvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL25hdmlnYXRlVXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JvbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvc2V0RGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Z1bmN0aW9ucy90eXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RvbS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLFdBQVc7QUFDbEQ7QUFDQTtBQUNBLHdEOzs7Ozs7Ozs7Ozs7OztBQ0xBLHdGQUFzRDtBQUV0RCxTQUF3QixRQUFRLENBQUMsTUFBZSxFQUFFLElBQVU7SUFDM0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFF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QUU7SUFDOUUsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksU0FBUyxNQUFNLENBQUM7QUFDbkYsQ0FBQyxDQUFDO0FBRU8sd0RBQXNCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZiAoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcblx0XHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn07XG4iLCJmdW5jdGlvbiB3ZWJwYWNrRW1wdHlDb250ZXh0KHJlcSkge1xuXHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0dGhyb3cgZTtcbn1cbndlYnBhY2tFbXB0eUNvbnRleHQua2V5cyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gW107IH07XG53ZWJwYWNrRW1wdHlDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrRW1wdHlDb250ZXh0O1xud2VicGFja0VtcHR5Q29udGV4dC5pZCA9IFwiLi9zcmMvYWN0aW9ucyBzeW5jIHJlY3Vyc2l2ZVwiOyIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZElucHV0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBpbnB1dEtleXMgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKFxuXHRcdFx0XHRcdGBBdHRlbXB0IHRvIHByZXNzIGtleWNvZGVzIG9uIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWAsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdFx0YXdhaXQgdHlwZShlbGVtZW50SGFuZGxlLCBpbnB1dEtleXMpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBQcmVzc2VkIGtleXMgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgaW5wdXQgdG8gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiIGltcG9ydCB7YXNzZXJ0RWxlbWVudH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuIGltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG4gaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG4gaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbiBpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXNzZXJ0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHQgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdCB0cnl7XG5cdFx0XHQgY29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdCBjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0IGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHQgcmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHQgfVxuXG5cdFx0XHQgY29uc3QgdmFsaWRhdGlvblJvd3MgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbGlkYXRpb25Sb3dzO1xuXHRcdFx0IGNvbnN0IG91dHB1dCA9IGF3YWl0IGFzc2VydEVsZW1lbnQocGFnZSwgc2VsZWN0b3IsIHZhbGlkYXRpb25Sb3dzKTtcblxuXHRcdFx0IHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0IG1lc3NhZ2U6IGBTdWNjZXNzZnVsbHkgYXNzZXJ0ZWQgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0XHRcdCBtZXRhOiB7b3V0cHV0fVxuXHRcdFx0IH0pO1xuXHRcdCB9IGNhdGNoKGVycil7XG5cdFx0IFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0IHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYXNzZXJ0aW5nIGVsZW1lbnRcIik7XG5cdFx0IH1cblx0IH0pO1xuIH1cbiIsImltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaWNrKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5e1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdH1cblx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoYE5vIGVsZW1lbnQgd2l0aCBzZWxlY3RvciBhcyAke3NlbGVjdG9yfSBleGlzdHNgKTtcblx0XHR9XG5cblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLmRpc3BhdGNoRXZlbnQoXCJjbGlja1wiKTtcblxuXHRcdC8vIElmIHVuZGVyIG5hdmlnYXRpb24gd2FpdCBmb3IgbG9hZCBzdGF0ZSB0byBjb21wbGV0ZS5cblx0XHRhd2FpdCBwYWdlLndhaXRGb3JMb2FkU3RhdGUoKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNsaWNraW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IEVsZW1lbnRIYW5kbGUsIFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gJy4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcblxuZXhwb3J0IGNvbnN0IHJ1blNjcmlwdE9uRWxlbWVudCA9IChzY3JpcHQ6IHN0cmluZywgZWxIYW5kbGU6IEVsZW1lbnRIYW5kbGUpOiBQcm9taXNlPGFueT4gPT4ge1xuXHRyZXR1cm4gbmV3IEZ1bmN0aW9uKFxuXHRcdCdleHBvcnRzJyxcblx0XHQncmVxdWlyZScsXG5cdFx0J21vZHVsZScsXG5cdFx0J19fZmlsZW5hbWUnLFxuXHRcdCdfX2Rpcm5hbWUnLFxuXHRcdCdzY3JpcHQnLFxuXHRcdCdlbEhhbmRsZScsXG5cdFx0YHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdCAgICB0cnl7XG5cdFx0XHRcdCAgICAgICAgY29uc3Qgc2NyaXB0RnVuY3Rpb24gPSAke3NjcmlwdH07XG5cdFx0XHRcdCAgICAgICAgY29uc29sZS5sb2coc2NyaXB0RnVuY3Rpb24pO1xuXHRcdFx0XHQgICAgICAgIHJlc29sdmUoc2NyaXB0RnVuY3Rpb24oZWxIYW5kbGUpKTtcblx0XHRcdFx0ICAgIH0gY2F0Y2goZXJyKXtcblx0XHRcdFx0ICAgICAgcmVqZWN0KGVycik7XG5cdFx0XHRcdCAgICB9XG5cdFx0XHRcdH0pO2AsXG5cdCkoZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIHNjcmlwdCwgZWxIYW5kbGUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudEN1c3RvbVNjcmlwdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeXtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0aWYgKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIGNhcHR1cmUgc2NyZWVuc2hvdCBvZiBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgY3VzdG9tU2NyaXB0ID0gYWN0aW9uLnBheWxvYWQubWV0YS5zY3JpcHQ7XG5cblx0XHRcdGNvbnN0IHNjcmlwdE91dHB1dCA9IGF3YWl0IHJ1blNjcmlwdE9uRWxlbWVudChjdXN0b21TY3JpcHQsIGVsZW1lbnRIYW5kbGUpO1xuXHRcdFx0aWYoISFzY3JpcHRPdXRwdXQpe1xuXHRcdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdFx0bWVzc2FnZTogYENsaWNrZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXNzZXJ0aW9uIGZhaWxlZCBhY2NvcmRpbmcgdG8gdGhlIHNjcmlwdCB3aXRoIG91dHB1dDogJHtKU09OLnN0cmluZ2lmeShzY3JpcHRPdXRwdXQpfWApXG5cdFx0XHR9XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBydW5uaW5nIHNjcmlwdCBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uJztcbmltcG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbGVtZW50U2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UsIHN0ZXBJbmRleDogbnVtYmVyKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRpZiAoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRIYW5kbGUgPSBhd2FpdCBwYWdlLiQoc2VsZWN0b3IgYXMgc3RyaW5nKTtcblx0XHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gY2FwdHVyZSBzY3JlZW5zaG90IG9mIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciA9IGF3YWl0IGVsZW1lbnRIYW5kbGUuc2NyZWVuc2hvdCgpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3J9YCxcblx0XHRcdFx0b3V0cHV0OiB7IG5hbWU6IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUoc2VsZWN0b3IsIHN0ZXBJbmRleCksIHZhbHVlOiBlbGVtZW50U2NyZWVuc2hvdEJ1ZmZlciB9LFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoJ1NvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgY2FwdHVyaW5nIHNjcmVlbnNob3Qgb2YgZWxlbWVudCcpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgc2Nyb2xsLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFzZWxlY3Rvcikge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEF0dGVtcHQgdG8gc2Nyb2xsIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBzZWxlY3Rvciwgc2Nyb2xsRGVsdGEpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBTY3JvbGxlZCBzdWNjZXNzZnVsbHkgb24gJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNjcm9sbGluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBob3ZlcihhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblxuXHRcdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBwYWdlLmhvdmVyKHNlbGVjdG9yKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgSG92ZXJlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGhvdmVyaW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCBhZGRJbnB1dCBmcm9tIFwiLi9hZGRJbnB1dFwiO1xuaW1wb3J0IGNsaWNrIGZyb20gXCIuL2NsaWNrXCI7XG5pbXBvcnQgaG92ZXIgZnJvbSBcIi4vaG92ZXJcIjtcbmltcG9ydCBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QgZnJvbSBcIi4vZWxlbWVudFNjcmVlbnNob3RcIjtcbmltcG9ydCBjYXB0dXJlUGFnZVNjcmVlbnNob3QgZnJvbSBcIi4vcGFnZVNjcmVlbnNob3RcIjtcbmltcG9ydCBlbGVtZW50U2Nyb2xsIGZyb20gXCIuL2VsZW1lbnRTY3JvbGxcIjtcbmltcG9ydCBwYWdlU2Nyb2xsIGZyb20gXCIuL3BhZ2VTY3JvbGxcIjtcbmltcG9ydCBuYXZpZ2F0ZVVybCBmcm9tIFwiLi9uYXZpZ2F0ZVVybFwiO1xuaW1wb3J0IHNldERldmljZSBmcm9tIFwiLi9zZXREZXZpY2VcIjtcbmltcG9ydCBhc3NlcnRFbGVtZW50IGZyb20gJy4vYXNzZXJ0RWxlbWVudCc7XG5pbXBvcnQgcnVuQ3VzdG9tU2NyaXB0IGZyb20gXCIuL2VsZW1lbnRDdXN0b21TY3JpcHRcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdEVsZW1lbnQ6IHtcblx0XHRhZGRJbnB1dCxcblx0XHRjbGljayxcblx0XHRob3Zlcixcblx0XHRzY3JvbGw6IGVsZW1lbnRTY3JvbGwsXG5cdFx0c2NyZWVuc2hvdDogY2FwdHVyZUVsZW1lbnRTY3JlZW5zaG90LFxuXHRcdGVsZW1lbnRTY3JvbGwsXG5cdFx0YXNzZXJ0RWxlbWVudCxcblx0XHRydW5DdXN0b21TY3JpcHQ6IHJ1bkN1c3RvbVNjcmlwdFxuXHR9LFxuXHRQYWdlOiB7XG5cdFx0c2NyZWVuc2hvdDogY2FwdHVyZVBhZ2VTY3JlZW5zaG90LFxuXHRcdHNjcm9sbDogcGFnZVNjcm9sbCxcblx0XHRuYXZpZ2F0ZTogbmF2aWdhdGVVcmwsXG5cdH0sXG5cdEJyb3dzZXI6IHtcblx0XHRzZXREZXZpY2UsXG5cdH0sXG59O1xuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBuYXZpZ2F0ZVVybChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB1cmxUb0dvID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0YXdhaXQgcGFnZS5nb3RvKHVybFRvR28pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBOYXZpZ2F0ZWQgc3VjY2Vzc2Z1bGx5IHRvICR7dXJsVG9Hb31gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRyZXR1cm4gZXJyb3IoJ1NvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgbmF2aWdhdGluZyB0byB3ZWJwYWdlJyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUgfSBmcm9tICcuLi91dGlscy9oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QocGFnZTogUGFnZSwgc3RlcEluZGV4OiBudW1iZXIpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBwYWdlVGl0bGUgPSBhd2FpdCBwYWdlLnRpdGxlKCk7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGNvbnN0IHNjcmVlbnNob3RCdWZmZXIgPSBhd2FpdCBwYWdlLnNjcmVlbnNob3QoKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBwYWdlIHNjcmVlbnNob3QgZm9yICR7cGFnZVVybH1gLFxuXHRcdFx0XHRvdXRwdXQ6IHsgbmFtZTogZ2VuZXJhdGVTY3JlZW5zaG90TmFtZShwYWdlVGl0bGUsIHN0ZXBJbmRleCksIHZhbHVlOiBzY3JlZW5zaG90QnVmZmVyIH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjYXB0dXJpbmcgc2NyZWVuc2hvdCBvZiBwYWdlJyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBcIndpbmRvd1wiLCBzY3JvbGxEZWx0YSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2Nyb2xsaW5nIHRoZSBwYWdlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlEZXZpY2UgfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2V4dGVuc2lvbi9kZXZpY2VcIjtcbmltcG9ydCB7IGlVc2VyQWdlbnQgfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL2NvbnN0YW50cy91c2VyQWdlbnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNldERldmljZShhY3Rpb246IGlBY3Rpb24pIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZXZpY2UgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLmRldmljZSBhcyBpRGV2aWNlO1xuXHRcdFx0Y29uc3QgdXNlckFnZW50ID0gYWN0aW9uLnBheWxvYWQubWV0YS51c2VyQWdlbnQgYXMgaVVzZXJBZ2VudDtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBcIlNldHVwIGRldmljZSBmb3IgdGVzdGluZ1wiLFxuXHRcdFx0XHRtZXRhOiB7XG5cdFx0XHRcdFx0d2lkdGg6IGRldmljZS53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IGRldmljZS5oZWlnaHQsXG5cdFx0XHRcdFx0dXNlckFnZW50OiB1c2VyQWdlbnQudmFsdWUsXG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNldHRpbmcgdGhlIGRldmljZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQXNzZXJ0aW9uUm93IH0gZnJvbSAnLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvYXNzZXJ0aW9uUm93JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXNzZXJ0RWxlbWVudEF0dHJpYnV0ZXMocGFnZTogUGFnZSwgc2VsZWN0b3I6IHN0cmluZywgYXNzZXJ0aW9uczogQXJyYXk8aUFzc2VydGlvblJvdz4pe1xuXHRjb25zdCBlbEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3Rvcik7XG5cdGxldCBoYXNQYXNzZWQgPSB0cnVlO1xuXHRjb25zdCBsb2dzID0gW107XG5cblx0Zm9yKGxldCBpID0gMDsgaSA8IGFzc2VydGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB7dmFsaWRhdGlvbiwgb3BlcmF0aW9uLCBmaWVsZH0gPSBhc3NlcnRpb25zW2ldO1xuXHRcdGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSA9IGF3YWl0IGVsSGFuZGxlIS5nZXRBdHRyaWJ1dGUoZmllbGQubmFtZSk7XG5cdFx0aWYob3BlcmF0aW9uID09PSBcIm1hdGNoZXNcIikge1xuXHRcdFx0aWYoZWxlbWVudEF0dHJpYnV0ZVZhbHVlICE9PSB2YWxpZGF0aW9uKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG5cdFx0XHRjb25zdCBkb2VzQ29udGFpbiA9ICBlbGVtZW50QXR0cmlidXRlVmFsdWUhLmluY2x1ZGVzKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYoIWRvZXNDb250YWluICl7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwicmVnZXhcIiApe1xuXHRcdFx0Y29uc3Qgcmd4ID0gbmV3IFJlZ0V4cCh2YWxpZGF0aW9uKTtcblx0XHRcdGlmICghcmd4LnRlc3QoZWxlbWVudEF0dHJpYnV0ZVZhbHVlISkpIHtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW2hhc1Bhc3NlZCwgbG9nc107XG59XG4iLCJpbXBvcnQgc2Nyb2xsIGZyb20gXCIuL3Njcm9sbFwiO1xuaW1wb3J0IHR5cGUgZnJvbSBcIi4vdHlwZVwiO1xuaW1wb3J0IHdhaXRGb3JTZWxlY3RvcnMgZnJvbSBcIi4vd2FpdEZvclNlbGVjdG9yc1wiO1xuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3NsZWVwXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuXG5leHBvcnQgeyBzY3JvbGwsIHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMsIHNsZWVwLCBhc3NlcnRFbGVtZW50IH07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2Nyb2xsKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRzY3JvbGxEZWx0YUFycjogQXJyYXk8bnVtYmVyPixcbikge1xuXHRhd2FpdCBwYWdlLmV2YWx1YXRlKFxuXHRcdCAoW3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcktleV06IFtudW1iZXJbXSwgc3RyaW5nXSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2Nyb2xsVG8gPSAgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPVxuXHRcdFx0XHRzZWxlY3RvcktleSA9PT0gXCJ3aW5kb3dcIiA/IHdpbmRvdyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JLZXkpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNjcm9sbERlbHRhQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdCBzY3JvbGxUbyhlbGVtZW50IGFzIEhUTUxFbGVtZW50LCBzY3JvbGxEZWx0YUFycltpXSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRbc2Nyb2xsRGVsdGFBcnIsIHNlbGVjdG9yXSxcblx0KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSwgdGltZSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHR5cGUoXG5cdGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlLFxuXHRrZXlDb2RlczogQXJyYXk8bnVtYmVyPixcbikge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleUNvZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXdhaXQgZWxIYW5kbGUucHJlc3MoU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2Rlc1tpXSkpO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGdlbmVyYXRlUXVlcnlTZWxlY3RvciwgZ2V0RWxlbWVudHNCeVhQYXRoIH0gZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JzKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LFxuXHRkZWZhdWx0U2VsZWN0b3IgPSBudWxsIGFzIHN0cmluZyB8IG51bGwsXG4pIHtcblx0aWYgKCFkZWZhdWx0U2VsZWN0b3IpIHtcblx0XHRkZWZhdWx0U2VsZWN0b3IgPSBzZWxlY3RvcnNbMF0udmFsdWU7XG5cdH1cblxuXHR0cnkge1xuXHRcdGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKGRlZmF1bHRTZWxlY3RvciwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xuXHRcdHJldHVybiBkZWZhdWx0U2VsZWN0b3I7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHZhbGlkU2VsZWN0b3IgPSBhd2FpdCBwYWdlLmV2YWx1YXRlKChzZWxlY3RvcnMpID0+IHtcblx0XHRcdGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZWN0b3IudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoXCJDYXVnaHQgZXhjZXB0aW9uXCIsIGV4KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSwgc2VsZWN0b3JzKTtcblx0XHRpZiAodHlwZW9mIHZhbGlkU2VsZWN0b3IgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgaXMgbm90IHdvcmtpbmdcIik7XG5cdFx0fVxuXHRcdHJldHVybiB2YWxpZFNlbGVjdG9yO1xuXHR9XG59XG4iLCJpbXBvcnQgKiAgYXMgYWN0aW9ucyBmcm9tIFwiLi9hY3Rpb25zXCI7XG5cbm1vZHVsZS5leHBvcnRzID0gYWN0aW9ucztcbiIsImNvbnN0IGdldEVsZW1lbnRzQnlYUGF0aCA9IChcblx0eHBhdGg6IHN0cmluZyxcblx0cGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG4pOiBOb2RlW10gPT4ge1xuXHRjb25zdCByZXN1bHRzID0gW107XG5cdGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0eHBhdGgsXG5cdFx0cGFyZW50IHx8IGRvY3VtZW50LFxuXHRcdG51bGwsXG5cdFx0WFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsXG5cdFx0bnVsbCxcblx0KTtcblx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHF1ZXJ5LnNuYXBzaG90TGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgPSAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nID0+IHtcblx0aWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0c3RyICs9IGVsLmlkICE9IFwiXCIgPyBcIiNcIiArIGVsLmlkIDogXCJcIjtcblx0aWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG59O1xuXG5leHBvcnQgeyBnZXRFbGVtZW50c0J5WFBhdGgsIGdlbmVyYXRlUXVlcnlTZWxlY3RvciB9O1xuIiwiY29uc3QgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBzdGVwSW5kZXg6IG51bWJlcik6IHN0cmluZyA9PiB7XG5cdHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKC9bXlxcd1xcc10vZ2ksICcnKS5yZXBsYWNlKC8gL2csICdfJykgKyBgXyR7c3RlcEluZGV4fS5wbmdgO1xufTtcblxuZXhwb3J0IHsgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZSB9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==